import { SearchResult } from '@/types'

interface SearchCardProps {
  search: SearchResult
}

export default function SearchCard({ search }: SearchCardProps) {
  const status = search.metadata?.search_status?.key || 'error'
  const username = search.metadata?.found_username
  const profileUrl = search.metadata?.profile_url
  const imageUrl = search.metadata?.uploaded_image?.imgix_url
  const searchDate = search.metadata?.search_date
    ? new Date(search.metadata.search_date).toLocaleDateString()
    : 'Unknown date'

  const statusConfig = {
    found: {
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      text: 'text-green-400',
      label: 'Found',
    },
    not_found: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      label: 'Not Found',
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-500',
      text: 'text-red-400',
      label: 'Error',
    },
  }

  const config = statusConfig[status] || statusConfig.error

  return (
    <div className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-transform">
      {/* Image */}
      {imageUrl && (
        <div className="w-full h-48 bg-gray-800">
          <img
            src={`${imageUrl}?w=600&h=400&fit=crop&auto=format,compress`}
            alt="Search result"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status Badge */}
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.border} ${config.text} border`}>
          {config.label}
        </div>

        {/* Username */}
        {username && status === 'found' ? (
          <div className="space-y-1">
            <p className="text-lg font-bold">{username}</p>
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark text-sm transition-colors inline-flex items-center gap-1"
              >
                View Profile
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        ) : (
          <p className="text-gray-400">
            {status === 'not_found' ? 'No match found' : 'Search failed'}
          </p>
        )}

        {/* Date */}
        <p className="text-xs text-gray-500">{searchDate}</p>
      </div>
    </div>
  )
}