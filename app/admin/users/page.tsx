import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import UsersClient from './UsersClient'

export const metadata = {
  title: 'Users - Admin Panel - hApItech',
}

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
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

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export default async function UsersPage() {
  await requireAdmin()
  const users = await getUsers()

  return (
    <div>
      <h1 className="text-4xl font-bold text-charcoal mb-6">Users</h1>
      <UsersClient users={users} />
    </div>
  )
}
