import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar avaliações do usuário
    const evaluations = await prisma.evaluation.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE'
      },
      include: {
        technicalReports: {
          select: {
            id: true,
            reportNumber: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Formatar dados para retorno
    const formattedEvaluations = evaluations.map(evaluation => ({
      id: evaluation.id,
      deviceType: evaluation.deviceType,
      deviceModel: evaluation.deviceModel,
      storage: evaluation.storage,
      color: evaluation.color,
      estimatedValue: evaluation.estimatedValue,
      condition: evaluation.condition,
      createdAt: evaluation.createdAt.toISOString(),
      hasReport: evaluation.technicalReports.length > 0
    }))

    return NextResponse.json({
      success: true,
      evaluations: formattedEvaluations
    })
  } catch (error) {
    console.error('Erro ao listar avaliações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
