import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const report = await prisma.technicalReport.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: 'Laudo não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, report })

  } catch (error) {
    console.error('Erro ao buscar laudo:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar laudo' },
      { status: 500 }
    )
  }
}
