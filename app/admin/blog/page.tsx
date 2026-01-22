import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog Management - Admin Panel - hApItech',
}

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export default async function BlogPage() {
  await requireAdmin()
  const posts = await getBlogPosts()

  return (
    <div>
      <h1 className="text-4xl font-bold text-charcoal mb-6">Blog Management</h1>
      <BlogClient initialPosts={posts} />
    </div>
  )
}
