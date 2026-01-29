'use server'

import { requireAdmin } from '@/lib/adminGuard'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

interface PortfolioItemInput {
  title: string
  category: string
  type: string
  media: string
  pinned?: boolean
}

export async function createPortfolioItem(data: PortfolioItemInput) {
  await requireAdmin()

  try {
    const item = await (prisma as any).portfolioItem.create({
      data: {
        title: data.title,
        category: data.category,
        type: data.type,
        media: data.media,
        pinned: data.pinned ?? false,
      },
    })

    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    return { success: true, data: item }
  } catch (error) {
    console.error('Error creating portfolio item:', error)
    return { success: false, error: 'Failed to create portfolio item' }
  }
}

export async function updatePortfolioItem(
  id: string,
  data: PortfolioItemInput
) {
  await requireAdmin()

  try {
    const item = await (prisma as any).portfolioItem.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        type: data.type,
        media: data.media,
        pinned: data.pinned ?? false,
      },
    })

    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    return { success: true, data: item }
  } catch (error) {
    console.error('Error updating portfolio item:', error)
    return { success: false, error: 'Failed to update portfolio item' }
  }
}

export async function deletePortfolioItem(id: string) {
  await requireAdmin()

  try {
    await (prisma as any).portfolioItem.delete({
      where: { id },
    })

    revalidatePath('/admin/portfolio')
    revalidatePath('/portfolio')
    return { success: true }
  } catch (error) {
    console.error('Error deleting portfolio item:', error)
    return { success: false, error: 'Failed to delete portfolio item' }
  }
}
