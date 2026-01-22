import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import PortfolioClient from './PortfolioClient'

export const metadata = {
  title: 'Portfolio Management - Admin Panel - hApItech',
}

async function getPortfolioItems() {
  try {
    const items = await (prisma as any).portfolioItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return items
  } catch (error) {
    console.error('Error fetching portfolio items:', error)
    return []
  }
}

export default async function PortfolioPage() {
  await requireAdmin()
  const items = await getPortfolioItems()

  return (
    <div>
      <h1 className="text-4xl font-bold text-charcoal mb-6">Portfolio Management</h1>
      <PortfolioClient initialItems={items} />
    </div>
  )
}
