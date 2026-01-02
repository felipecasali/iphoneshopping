import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    // Período para análise de crescimento (últimos 30 dias)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Métricas totais
    const [
      totalUsers,
      totalEvaluations,
      totalReports,
      totalListings,
      newUsersThisMonth,
      newEvaluationsThisMonth,
      newReportsThisMonth,
      newListingsThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.evaluation.count(),
      prisma.technicalReport.count(),
      prisma.listing.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.evaluation.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.technicalReport.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.listing.count({ where: { createdAt: { gte: thirtyDaysAgo } } })
    ])

    // Atividades recentes
    const [recentUsers, recentEvaluations, recentReports, recentListings] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.evaluation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          deviceModel: true,
          estimatedValue: true,
          createdAt: true,
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.technicalReport.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          reportNumber: true,
          deviceModel: true,
          reportType: true,
          createdAt: true,
          user: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.listing.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          condition: true,
          price: true,
          status: true,
          createdAt: true,
          device: {
            select: { model: true }
          },
          user: {
            select: { name: true, email: true }
          }
        }
      })
    ])

    // Calcular taxa de conversão (avaliação → laudo → anúncio)
    const conversionFunnel = {
      evaluations: totalEvaluations,
      reports: totalReports,
      listings: totalListings,
      evaluationToReport: totalEvaluations > 0 ? ((totalReports / totalEvaluations) * 100).toFixed(1) : '0',
      reportToListing: totalReports > 0 ? ((totalListings / totalReports) * 100).toFixed(1) : '0',
      evaluationToListing: totalEvaluations > 0 ? ((totalListings / totalEvaluations) * 100).toFixed(1) : '0'
    }

    // Crescimento mensal (comparação)
    const previousMonth = new Date(thirtyDaysAgo)
    previousMonth.setDate(previousMonth.getDate() - 30)

    const [
      usersLastMonth,
      evaluationsLastMonth,
      reportsLastMonth,
      listingsLastMonth
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: previousMonth, lt: thirtyDaysAgo } } }),
      prisma.evaluation.count({ where: { createdAt: { gte: previousMonth, lt: thirtyDaysAgo } } }),
      prisma.technicalReport.count({ where: { createdAt: { gte: previousMonth, lt: thirtyDaysAgo } } }),
      prisma.listing.count({ where: { createdAt: { gte: previousMonth, lt: thirtyDaysAgo } } })
    ])

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous * 100).toFixed(1)
    }

    return NextResponse.json({
      overview: {
        totalUsers,
        totalEvaluations,
        totalReports,
        totalListings
      },
      thisMonth: {
        newUsers: newUsersThisMonth,
        newEvaluations: newEvaluationsThisMonth,
        newReports: newReportsThisMonth,
        newListings: newListingsThisMonth
      },
      growth: {
        users: calculateGrowth(newUsersThisMonth, usersLastMonth),
        evaluations: calculateGrowth(newEvaluationsThisMonth, evaluationsLastMonth),
        reports: calculateGrowth(newReportsThisMonth, reportsLastMonth),
        listings: calculateGrowth(newListingsThisMonth, listingsLastMonth)
      },
      conversion: conversionFunnel,
      recentActivity: {
        users: recentUsers,
        evaluations: recentEvaluations,
        reports: recentReports,
        listings: recentListings
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar estatísticas' },
      { status: error.message?.includes('Acesso negado') ? 403 : 500 }
    )
  }
}
