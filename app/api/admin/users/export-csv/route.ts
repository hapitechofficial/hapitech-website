import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Generate CSV content
    const headers = ['ID', 'Name', 'Email', 'Provider', 'Joined Date']
    const rows = users.map((user) => {
      const provider = user.accounts.length > 0 
        ? user.accounts[0].provider.charAt(0).toUpperCase() + user.accounts[0].provider.slice(1)
        : 'Credentials'
      
      return [
        user.id,
        user.name || 'N/A',
        user.email,
        provider,
        new Date(user.createdAt).toLocaleDateString('en-US'),
      ]
    })

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if needed
            const cellStr = String(cell)
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          })
          .join(',')
      ),
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8;',
        'Content-Disposition': `attachment; filename="users-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    )
  }
}
