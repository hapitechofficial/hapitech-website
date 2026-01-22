import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, BookOpen, Image as ImageIcon } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard - hApItech',
}

async function getDashboardStats() {
  try {
    const [userCount, blogCount, portfolioCount] = await Promise.all([
      prisma.user.count(),
      (prisma as any).blogPost.count(),
      (prisma as any).portfolioItem.count(),
    ])

    return { userCount, blogCount, portfolioCount }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { userCount: 0, blogCount: 0, portfolioCount: 0 }
  }
}

export default async function AdminDashboard() {
  // This will redirect to login if not authenticated or to forbidden if not admin
  const session = await requireAdmin()
  const stats = await getDashboardStats()

  const cards = [
    {
      title: 'Total Users',
      value: stats.userCount,
      icon: Users,
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Blog Posts',
      value: stats.blogCount,
      icon: BookOpen,
      href: '/admin/blog',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Portfolio Items',
      value: stats.portfolioCount,
      icon: ImageIcon,
      href: '/admin/portfolio',
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold text-charcoal mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {session.user?.name || 'Admin'}!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group"
            >
              <div className={`bg-gradient-to-br ${card.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer h-full`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon size={32} className="text-white" />
                </div>
                <h2 className="text-white text-lg font-semibold mb-2">
                  {card.title}
                </h2>
                <p className="text-white text-4xl font-bold">
                  {card.value}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-charcoal mb-4">Quick Start</h2>
        <ul className="space-y-3 text-charcoal">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-magenta rounded-full mr-3"></span>
            <Link href="/admin/users" className="hover:text-magenta transition-colors">
              View and export all users
            </Link>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-magenta rounded-full mr-3"></span>
            <Link href="/admin/blog" className="hover:text-magenta transition-colors">
              Manage blog posts
            </Link>
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-magenta rounded-full mr-3"></span>
            <Link href="/admin/portfolio" className="hover:text-magenta transition-colors">
              Manage portfolio items
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
