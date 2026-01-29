'use client'

import { useState, useRef } from 'react'
import { Trash2, Edit, Plus, Play, Image as ImageIcon, Music, Upload } from 'lucide-react'
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
  pinned?: boolean
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
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragZoneRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    type: 'Photo',
    media: '',
    mediaFile: null as File | null,
    mediaPreview: '',
    pinned: false,
  })

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'Photo',
      media: '',
      mediaFile: null,
      mediaPreview: '',
      pinned: false,
    })
    setEditingId(null)
    setShowForm(false)
    setError(null)
    setUploadError(null)
  }

  const getAcceptedFileTypes = (mediaType: string) => {
    switch (mediaType.toLowerCase()) {
      case 'photo':
        return '.jpg,.jpeg,.png,.gif,.webp'
      case 'video':
        return '.mp4,.webm,.mov,.avi'
      case 'song':
        return '.mp3,.wav,.flac,.m4a'
      default:
        return ''
    }
  }

  const handleFileSelect = (file: File, mediaType: string) => {
    const acceptedTypes = {
      'Photo': ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      'Video': ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
      'Song': ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4'],
    }

    if (!acceptedTypes[mediaType as keyof typeof acceptedTypes]?.includes(file.type)) {
      setUploadError(`Invalid file type for ${mediaType}. Please upload a valid ${mediaType.toLowerCase()} file.`)
      return
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB limit
      setUploadError('File size must be less than 500MB')
      return
    }

    setUploadError(null)
    setFormData((prev) => ({
      ...prev,
      mediaFile: file,
      mediaPreview: URL.createObjectURL(file),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFileSelect(files[0], formData.type)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragZoneRef.current) {
      dragZoneRef.current.classList.add('border-magenta', 'bg-magenta/5')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragZoneRef.current) {
      dragZoneRef.current.classList.remove('border-magenta', 'bg-magenta/5')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragZoneRef.current) {
      dragZoneRef.current.classList.remove('border-magenta', 'bg-magenta/5')
    }

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileSelect(files[0], formData.type)
    }
  }

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      type: item.type,
      media: item.media,
      mediaFile: null,
      mediaPreview: item.type.toLowerCase() === 'video' ? '' : item.media,
      pinned: !!item.pinned,
    })
    setEditingId(item.id)
    setShowForm(true)
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // Generate a simple URL-safe filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomStr}-${file.name}`
    
    // Create a mock URL or use blob URL for local testing
    // In production, you would upload to Cloudinary or your own server
    // For now, we'll use a relative path convention
    const mediaUrl = `/uploads/${filename}`
    
    // Log the file info for debugging
    console.log('File would be uploaded:', { 
      originalName: file.name,
      size: file.size,
      type: file.type,
      generatedUrl: mediaUrl 
    })
    
    // Return the generated media URL
    // Note: In production, actually upload the file to Cloudinary or your server
    return mediaUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let mediaUrl = formData.media

      // Upload file if new file is selected
      if (formData.mediaFile) {
        try {
          mediaUrl = await uploadToCloudinary(formData.mediaFile)
        } catch (err) {
          setError('Failed to upload media. Please try again.')
          setIsLoading(false)
          return
        }
      }

      const submitData = {
        title: formData.title,
        type: formData.type,
        category: `${formData.type} Content`, // Auto-generate category
        media: mediaUrl,
        pinned: formData.pinned,
      }

      let result
      if (editingId) {
        result = await updatePortfolioItem(editingId, submitData)
      } else {
        result = await createPortfolioItem(submitData)
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
            {editingId ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Field */}
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
                placeholder="Portfolio item title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta"
              />
            </div>

            {/* Media Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Media Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Photo', 'Video', 'Song'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type, mediaFile: null, mediaPreview: '' })
                      setUploadError(null)
                    }}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                      formData.type === type
                        ? 'border-magenta bg-magenta/10 text-magenta'
                        : 'border-gray-300 text-charcoal hover:border-magenta'
                    }`}
                  >
                    {type === 'Photo' && <ImageIcon size={20} />}
                    {type === 'Video' && <Play size={20} />}
                    {type === 'Song' && <Music size={20} />}
                    <span className="text-xs font-semibold">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">
                Upload Media
              </label>

              {uploadError && (
                <div className="mb-3 p-3 bg-yellow-100 text-yellow-700 rounded text-sm">
                  {uploadError}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept={getAcceptedFileTypes(formData.type)}
                className="hidden"
              />

              <div
                ref={dragZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-magenta transition-colors"
              >
                {formData.mediaPreview ? (
                  <div className="space-y-2">
                    {formData.type === 'Song' ? (
                      <div className="flex justify-center">
                        <Music size={48} className="text-magenta" />
                      </div>
                    ) : formData.type === 'Video' ? (
                      <div className="flex justify-center">
                        <Play size={48} className="text-magenta" />
                      </div>
                    ) : (
                      <img
                        src={formData.mediaPreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded"
                      />
                    )}
                    <p className="text-sm text-charcoal font-semibold">
                      File selected: {formData.mediaFile?.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          mediaFile: null,
                          mediaPreview: '',
                        }))
                      }}
                      className="text-xs text-magenta hover:underline"
                    >
                      Change file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <p className="text-charcoal font-semibold">
                      Drag and drop your {formData.type.toLowerCase()} here
                    </p>
                    <p className="text-sm text-gray-600">
                      or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Max file size: 500MB
                    </p>
                  </div>
                )}
              </div>

              {/* Fallback: Manual URL Input */}
              <div className="mt-4 border-t pt-4">
                <label className="block text-sm font-semibold text-charcoal mb-2">
                  Or Enter Media URL (for existing items)
                </label>
                <input
                  type="text"
                  value={formData.media}
                  onChange={(e) =>
                    setFormData({ ...formData, media: e.target.value })
                  }
                  placeholder="e.g., /assets/image.png or https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta text-sm"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Use this if you already have a media URL or are editing an existing item
                </p>
              </div>
            </div>

            {/* Pin Toggle */}
            <div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={e => setFormData({ ...formData, pinned: e.target.checked })}
                  className="accent-magenta w-5 h-5"
                />
                <span className="text-sm font-semibold text-charcoal">Pin this item (show at top)</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || (!editingId && !formData.mediaFile)}
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
                {item.type.toLowerCase() === 'video' ? (
                  <>
                    <video
                      src={item.media}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all">
                      <Play size={48} className="text-white" />
                    </div>
                  </>
                ) : item.type.toLowerCase() === 'song' ? (
                  <>
                    <div className="flex items-center justify-center bg-gradient-to-br from-magenta to-orange w-full h-full">
                      <Music size={48} className="text-white" />
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
                <h3 className="font-bold text-charcoal mb-2 flex items-center gap-2">
                  {item.title}
                  {item.pinned && (
                    <span className="ml-2 px-2 py-1 text-xs bg-orange text-white rounded-full font-semibold">Pinned</span>
                  )}
                </h3>
                <p className="text-xs text-gray-600 mb-3 bg-gray-100 inline-block px-2 py-1 rounded">
                  {item.type}
                </p>
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
