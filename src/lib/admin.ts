import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function isAdmin() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return false
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  })

  return user?.role === 'ADMIN'
}

export async function requireAdmin() {
  const admin = await isAdmin()
  
  if (!admin) {
    throw new Error('Acesso negado. Apenas administradores podem acessar esta área.')
  }
  
  return true
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true
    }
  })
}
