'use server'

import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface BlogPostInput {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  readTime: string
  pinned?: boolean
}

export async function createBlogPost(data: BlogPostInput) {
  await requireAdmin()

  try {
    const post = await (prisma as any).blogPost.create({
      data: {
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author || 'hApItech Team',
        readTime: data.readTime || '5 min read',
        pinned: data.pinned ?? false,
      },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    if (error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' }
    }
    return { success: false, error: 'Failed to create post' }
  }
}

export async function updateBlogPost(id: string, data: BlogPostInput) {
  await requireAdmin()

  try {
    const post = await (prisma as any).blogPost.update({
      where: { id },
      data: {
        slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author || 'hApItech Team',
        readTime: data.readTime || '5 min read',
        pinned: data.pinned ?? false,
      },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    return { success: true, data: post }
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    if (error.code === 'P2002') {
      return { success: false, error: 'Slug already exists' }
    }
    return { success: false, error: 'Failed to update post' }
  }
}

export async function deleteBlogPost(id: string) {
  await requireAdmin()

  try {
    await (prisma as any).blogPost.delete({
      where: { id },
    })

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    return { success: true }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, error: 'Failed to delete post' }
  }
}
