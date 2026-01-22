'use client'

import { useState } from 'react'
import { Trash2, Edit, Plus, Play, Image as ImageIcon } from 'lucide-react'
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from './actions'

interface PortfolioItem {
  id: string
  title: string
  category: string
  type: string
  media: string
  createdAt: Date
  updatedAt: Date
}

interface PortfolioClientProps {
  initialItems: PortfolioItem[]
}

export default function PortfolioClient({ initialItems }: PortfolioClientProps) {
  const [items, setItems] = useState<PortfolioItem[]>(initialItems)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    type: 'poster',
    media: '',
  })

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      type: 'poster',
      media: '',
    })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      category: item.category,
      type: item.type,
      media: item.media,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let result
      if (editingId) {
        result = await updatePortfolioItem(editingId, formData)
      } else {
        result = await createPortfolioItem(formData)
      }

      if (result.success) {
        // Refresh items
        const response = await fetch('/api/admin/portfolio/items')
        const updatedItems = await response.json()
        setItems(updatedItems)
        resetForm()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('Failed to save item')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    setIsLoading(true)
    try {
      const result = await deletePortfolioItem(id)
      if (result.success) {
        setItems(items.filter((i) => i.id !== id))
      } else {
        setError(result.error || 'Failed to delete item')
      }
    } catch (err) {
      setError('Failed to delete item')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-magenta to-orange text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          New Item
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            {editingId ? 'Edit Item' : 'Create New Portfolio Item'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Festival Content"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Type
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
                >
                  <option value="poster">Poster</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Media URL
              </label>
              <input
                type="text"
                required
                value={formData.media}
                onChange={(e) =>
                  setFormData({ ...formData, media: e.target.value })
                }
                placeholder="e.g., /assets/my-image.png or /assets/my-video.mp4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
              />
              <p className="text-xs text-gray-600 mt-2">
                Ensure the file exists in the public/assets folder
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-magenta to-orange text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-shadow"
              >
                {isLoading
                  ? 'Saving...'
                  : editingId
                    ? 'Update Item'
                    : 'Create Item'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-charcoal text-charcoal rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {items.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center text-charcoal">
          <p>No portfolio items yet. Create your first item!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden">
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.media}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                      <Play size={48} className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.media}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                      <ImageIcon size={48} className="text-white" />
                    </div>
                  </>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    disabled={isLoading}
                  >
                    <Edit size={18} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    disabled={isLoading}
                  >
                    <Trash2 size={18} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
