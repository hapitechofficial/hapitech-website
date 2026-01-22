'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  accounts: Array<{ provider: string }>
}

interface UsersClientProps {
  users: User[]
}

export default function UsersClient({ users }: UsersClientProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/admin/users/export-csv')
      if (!response.ok) {
        throw new Error('Failed to export CSV')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export CSV')
    } finally {
      setIsExporting(false)
    }
  }

  const getProvider = (user: User) => {
    if (user.accounts.length > 0) {
      return user.accounts[0].provider.charAt(0).toUpperCase() + user.accounts[0].provider.slice(1)
    }
    return 'Credentials'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-charcoal">
          Total Users: <span className="font-bold text-lg">{users.length}</span>
        </p>
        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-magenta to-orange text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-shadow"
        >
          <Download size={20} />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-magenta to-orange text-white">
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Provider</th>
              <th className="px-6 py-4 text-left font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-charcoal">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-charcoal font-medium">
                    {user.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-charcoal text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-charcoal text-sm">
                    {getProvider(user)}
                  </td>
                  <td className="px-6 py-4 text-charcoal text-sm">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
