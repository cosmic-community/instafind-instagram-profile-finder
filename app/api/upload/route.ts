import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { UploadResponse, SearchStatus } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Upload image to Cosmic media library
    const uploadFormData = new FormData()
    uploadFormData.append('media', file)

    const mediaResponse = await cosmic.media.insertOne(uploadFormData)
    const mediaName = mediaResponse.media.name

    // Simulate search process (in reality, this would call an Instagram API or image recognition service)
    // For demonstration, we'll randomly assign a status
    const statuses: SearchStatus[] = ['found', 'not_found', 'error']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    
    let username: string | undefined
    let profileUrl: string | undefined
    
    if (randomStatus === 'found') {
      // Simulate finding a username
      username = '@demo_user_' + Math.floor(Math.random() * 1000)
      profileUrl = `https://instagram.com/${username.slice(1)}`
    }

    // Create search result object in Cosmic
    const searchResult = await cosmic.objects.insertOne({
      type: 'search-results',
      title: `Search - ${new Date().toLocaleString()}`,
      metadata: {
        uploaded_image: mediaName,
        found_username: username || '',
        profile_url: profileUrl || '',
        search_status: randomStatus,
        search_date: new Date().toISOString()
      }
    })

    const response: UploadResponse = {
      success: true,
      username,
      profileUrl,
      status: randomStatus,
      message: randomStatus === 'found' 
        ? 'Profile found!' 
        : randomStatus === 'not_found'
        ? 'No matching profile found'
        : 'Error processing image'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process upload' },
      { status: 500 }
    )
  }
}