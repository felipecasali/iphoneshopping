import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login', // Redireciona erros para a página de login
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Verificar se o usuário está banido
      if (user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { status: true }
        })

        if (dbUser?.status === 'BANNED') {
          return false // Impede login de usuários banidos
        }
      }

      // Permitir login com credenciais normalmente
      if (account?.provider === 'credentials') {
        return true
      }

      // Para login com Google, verificar se já existe conta com esse email
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { accounts: true }
          })

          // Se o usuário existe mas não tem conta Google linkada, linkar automaticamente
          if (existingUser && !existingUser.accounts.some((acc: any) => acc.provider === 'google')) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state as string | null,
              }
            })

            // Atualizar emailVerified se não estiver definido
            if (!existingUser.emailVerified) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { emailVerified: new Date() }
              })
            }

            return true
          }

          return true
        } catch (error) {
          console.error('Erro ao linkar conta Google:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Se a URL já é absoluta e pertence ao nosso domínio, usar ela
      if (url.startsWith(baseUrl)) return url
      
      // Se começa com "/", é relativa ao domínio
      if (url.startsWith("/")) return `${baseUrl}${url}`
      
      // Se tem o parâmetro callbackUrl na query, usar ele
      const urlObj = new URL(url, baseUrl)
      const callbackUrl = urlObj.searchParams.get('callbackUrl')
      if (callbackUrl && callbackUrl.startsWith('/')) {
        return `${baseUrl}${callbackUrl}`
      }
      
      // Default: redirecionar para dashboard
      return `${baseUrl}/dashboard`
    }
  }
}
