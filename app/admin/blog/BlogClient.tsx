'use client'

import { useState } from 'react'
import { Trash2, Edit, Plus } from 'lucide-react'
import { createBlogPost, updateBlogPost, deleteBlogPost } from './actions'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  readTime: string
  createdAt: Date
  updatedAt: Date
  pinned?: boolean
}

interface BlogClientProps {
  initialPosts: BlogPost[]
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: 'hApItech Team',
    readTime: '5 min read',
    pinned: false,
  })

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      author: 'hApItech Team',
      readTime: '5 min read',
      pinned: false,
    })
    setEditingId(null)
    setShowForm(false)
    setError(null)
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      readTime: post.readTime,
      pinned: !!post.pinned,
    })
    setEditingId(post.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let result
      if (editingId) {
        result = await updateBlogPost(editingId, formData)
      } else {
        result = await createBlogPost(formData)
      }

      if (result.success) {
        // Refresh posts
        const response = await fetch('/api/admin/blog/posts')
        const updatedPosts = await response.json()
        setPosts(updatedPosts)
        resetForm()
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      setError('Failed to save post')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsLoading(true)
    try {
      const result = await deleteBlogPost(id)
      if (result.success) {
        setPosts(posts.filter((p) => p.id !== id))
      } else {
        setError(result.error || 'Failed to delete post')
      }
    } catch (err) {
      setError('Failed to delete post')
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
          New Post
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            {editingId ? 'Edit Post' : 'Create New Post'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Pin Toggle */}
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
                  className="accent-magenta w-5 h-5"
                />
                <span className="text-sm font-semibold text-charcoal">Pin this post (show at top)</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                    })
                  }
                  placeholder="e.g., my-blog-post"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Excerpt
              </label>
              <textarea
                required
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Content
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  placeholder="e.g., 5 min read"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-gradient-to-r from-magenta to-orange text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-shadow"
              >
                {isLoading ? 'Saving...' : editingId ? 'Update Post' : 'Create Post'}
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

      {posts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center text-charcoal">
          <p>No blog posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-magenta to-orange text-white">
                  <th className="px-6 py-4 text-left font-semibold">Title</th>
                  <th className="px-6 py-4 text-left font-semibold">Slug</th>
                  <th className="px-6 py-4 text-left font-semibold">Author</th>
                  <th className="px-6 py-4 text-left font-semibold">Created</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-charcoal font-medium">
                          <h3 className="font-bold text-charcoal mb-2 flex items-center gap-2">
                            {post.title}
                            {post.pinned && (
                              <span className="ml-2 px-2 py-1 text-xs bg-orange text-white rounded-full font-semibold">Pinned</span>
                            )}
                          </h3>
                    </td>
                    <td className="px-6 py-4 text-charcoal text-sm">
                      {post.slug}
                    </td>
                    <td className="px-6 py-4 text-charcoal text-sm">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 text-charcoal text-sm">
                      {new Date(post.createdAt).toLocaleDateString('en-US')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          disabled={isLoading}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
