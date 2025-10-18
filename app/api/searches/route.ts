import { NextResponse } from 'next/server'
import { cosmic, hasStatus } from '@/lib/cosmic'
import { SearchResult } from '@/types'

export async function GET() {
  try {
    const response = await cosmic.objects
      .find({ type: 'search-results' })
      .props(['id', 'title', 'slug', 'metadata', 'created_at'])
      .depth(1)

    // Sort by created_at date (newest first)
    const searches = (response.objects as SearchResult[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })

    return NextResponse.json({ searches })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return NextResponse.json({ searches: [] })
    }
    
    console.error('Error fetching searches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch searches' },
      { status: 500 }
    )
  }
}