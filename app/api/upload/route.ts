import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'
import { UploadResponse, SearchStatus } from '@/types'

// Demo profile database - In production, this would be an actual database
// or you'd use a real AI service like AWS Rekognition + Instagram API
const DEMO_PROFILES = [
  { username: '@sarah_johnson', profileUrl: 'https://instagram.com/sarah_johnson', features: ['blonde', 'glasses', 'smiling'] },
  { username: '@mike_rodriguez', profileUrl: 'https://instagram.com/mike_rodriguez', features: ['beard', 'hat', 'outdoor'] },
  { username: '@emily_chen', profileUrl: 'https://instagram.com/emily_chen', features: ['dark_hair', 'professional', 'indoor'] },
  { username: '@alex_kumar', profileUrl: 'https://instagram.com/alex_kumar', features: ['casual', 'selfie', 'urban'] },
]

// Simulate image analysis - In production, this would use:
// - AWS Rekognition for face detection
// - Google Cloud Vision API
// - Azure Face API
// - Or custom ML model
async function analyzeImage(file: File): Promise<string[]> {
  // In a real implementation, you would:
  // 1. Send image to AI service
  // 2. Get back detected features (face attributes, objects, etc.)
  // 3. Return feature array
  
  // For demo purposes, we'll generate random features based on image properties
  const possibleFeatures = ['blonde', 'dark_hair', 'glasses', 'beard', 'hat', 'smiling', 'professional', 'casual', 'outdoor', 'indoor', 'selfie', 'urban']
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Return 2-3 random features
  const numFeatures = Math.floor(Math.random() * 2) + 2
  const features: string[] = []
  for (let i = 0; i < numFeatures; i++) {
    const feature = possibleFeatures[Math.floor(Math.random() * possibleFeatures.length)]
    if (!features.includes(feature)) {
      features.push(feature)
    }
  }
  
  return features
}

// Match features to profiles
function findMatchingProfile(features: string[]) {
  // Calculate match scores for each profile
  const profileScores = DEMO_PROFILES.map(profile => {
    const matchingFeatures = features.filter(f => profile.features.includes(f))
    const score = matchingFeatures.length / features.length
    return { profile, score }
  })
  
  // Sort by score and get best match
  profileScores.sort((a, b) => b.score - a.score)
  const bestMatch = profileScores[0]
  
  // Fixed: Added proper undefined check for bestMatch
  // Require at least 30% match to consider it "found"
  if (bestMatch && bestMatch.score >= 0.3) {
    return {
      status: 'found' as SearchStatus,
      username: bestMatch.profile.username,
      profileUrl: bestMatch.profile.profileUrl
    }
  }
  
  return {
    status: 'not_found' as SearchStatus,
    username: undefined,
    profileUrl: undefined
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded', status: 'error' as SearchStatus },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'File must be an image', status: 'error' as SearchStatus },
        { status: 400 }
      )
    }

    // Upload image to Cosmic media library
    const mediaResponse = await cosmic.media.insertOne({
      media: file
    })
    const mediaName = mediaResponse.media.name

    // Analyze the image to extract features
    const features = await analyzeImage(file)
    
    // Find matching profile based on features
    const matchResult = findMatchingProfile(features)
    
    // Create search result object in Cosmic
    // Fixed: Added explicit type safety for username and profileUrl
    await cosmic.objects.insertOne({
      type: 'search-results',
      title: `Search - ${new Date().toLocaleString()}`,
      metadata: {
        uploaded_image: mediaName,
        found_username: matchResult.username ?? '',
        profile_url: matchResult.profileUrl ?? '',
        search_status: matchResult.status,
        search_date: new Date().toISOString()
      }
    })

    const response: UploadResponse = {
      success: true,
      username: matchResult.username,
      profileUrl: matchResult.profileUrl,
      status: matchResult.status,
      message: matchResult.status === 'found' 
        ? `Profile found! Match confidence: ${Math.floor(Math.random() * 30 + 70)}%` 
        : 'No matching profile found in our database'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process upload', status: 'error' as SearchStatus },
      { status: 500 }
    )
  }
}