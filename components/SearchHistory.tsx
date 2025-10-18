'use client'

import { useEffect, useState } from 'react'
import { SearchResult } from '@/types'
import SearchCard from './SearchCard'

export default function SearchHistory() {
  const [searches, setSearches] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSearches()
  }, [])

  const fetchSearches = async () => {
    try {
      const response = await fetch('/api/searches')
      const data = await response.json()
      setSearches(data.searches || [])
    } catch (error) {
      console.error('Error fetching searches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!searches || searches.length === 0) {
    return (
      <div className="glass-effect rounded-2xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-lg">No search history yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Upload an image to start searching
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {searches.map((search) => (
        <SearchCard key={search.id} search={search} />
      ))}
    </div>
  )
}