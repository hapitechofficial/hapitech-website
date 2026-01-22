import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const items = await prisma.portfolioItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    )
  }
}
