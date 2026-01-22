import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-magenta mb-4">403</h1>
        <p className="text-2xl text-charcoal mb-6">Access Denied</p>
        <p className="text-charcoal mb-8">You don't have permission to access the admin panel.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-magenta to-orange text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
