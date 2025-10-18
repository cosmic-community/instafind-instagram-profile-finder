# InstaFind - Instagram Profile Finder

![App Preview](https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=300&fit=crop&auto=format)

A modern web application for uploading profile pictures and searching for Instagram usernames. Built with Next.js 15, TypeScript, and Cosmic CMS.

## Features

- 🖼️ **Drag & Drop Image Upload** - Intuitive interface with visual feedback
- 📊 **Search History Dashboard** - View all past searches with status indicators
- 🔍 **Real-time Search Status** - Track whether profiles were found, not found, or encountered errors
- 💾 **Cosmic CMS Integration** - All search results stored and managed through Cosmic
- 📱 **Fully Responsive** - Optimized for all device sizes
- 🎨 **Modern UI/UX** - Clean design with smooth animations and transitions
- 🔒 **TypeScript** - Full type safety throughout the application

## Clone this Project

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68f28beee46ebb182f06894d&clone_repository=68f326c3a8c41dcd668710ba)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Prompt for the 'Instagram Profile Finder' App Idea
App Name: InstaFind (or similar)
>
> Goal: Create a simple web application where a user can upload a photo believed to be an Instagram profile picture, and the application will attempt to identify and display the corresponding Instagram username.
>
> User Interface (UI):
>
> A clean, central area for image upload (supporting click-to-browse or drag-and-drop).
>
> A button labeled 'Find Instagram ID'.
>
> A display area to show the resulting Instagram username (if found) or an appropriate message (e.g., 'User not found' or 'Unable to identify').
>
> Workflow (How it would ideally work):
>
> User uploads an image file.
>
> User clicks the 'Find Instagram ID' button.
>
> The application sends the image to a backend system or API.
>
> Crucial (and Impossible) Step: The backend searches a database or uses an API that can match the uploaded profile picture to a known Instagram username.
>
> The backend returns the identified username.
>
> The application displays the username to the user."

### Code Generation Prompt

> "Prompt for the 'Instagram Profile Finder' App Idea
App Name: InstaFind (or similar)
>
> Goal: Create a simple web application where a user can upload a photo believed to be an Instagram profile picture, and the application will attempt to identify and display the corresponding Instagram username.
>
> User Interface (UI):
>
> A clean, central area for image upload (supporting click-to-browse or drag-and-drop).
>
> A button labeled 'Find Instagram ID'.
>
> A display area to show the resulting Instagram username (if found) or an appropriate message (e.g., 'User not found' or 'Unable to identify').
>
> Workflow (How it would ideally work):
>
> User uploads an image file.
>
> User clicks the 'Find Instagram ID' button.
>
> The application sends the image to a backend system or API.
>
> Crucial (and Impossible) Step: The backend searches a database or uses an API that can match the uploaded profile picture to a known Instagram username.
>
> The backend returns the identified username.
>
> The application displays the username to the user."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cosmic CMS** - Headless CMS for content management
- **Cosmic SDK** - JavaScript SDK for Cosmic API integration

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- A Cosmic account with a bucket
- Cosmic API credentials (bucket slug, read key, write key)

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   ```

4. Run the development server:
   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Cosmic SDK Examples

### Fetching Search Results

```typescript
import { cosmic } from '@/lib/cosmic'

// Get all search results
const { objects } = await cosmic.objects
  .find({ type: 'search-results' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

// Get a single search result by slug
const { object } = await cosmic.objects.findOne({
  type: 'search-results',
  slug: 'search-profile-1'
}).props(['id', 'title', 'slug', 'metadata']).depth(1)
```

### Creating a New Search Result

```typescript
// Upload image first
const formData = new FormData()
formData.append('media', imageFile)

const mediaResponse = await cosmic.media.insertOne(formData)
const mediaName = mediaResponse.media.name

// Create search result object
const { object } = await cosmic.objects.insertOne({
  type: 'search-results',
  title: `Search - ${new Date().toLocaleString()}`,
  metadata: {
    uploaded_image: mediaName,
    found_username: '@instagram_user',
    profile_url: 'https://instagram.com/instagram_user',
    search_status: 'found', // 'found' | 'not_found' | 'error'
    search_date: new Date().toISOString()
  }
})
```

### Updating Search Status

```typescript
await cosmic.objects.updateOne(objectId, {
  metadata: {
    search_status: 'found',
    found_username: '@discovered_username',
    profile_url: 'https://instagram.com/discovered_username'
  }
})
```

## Cosmic CMS Integration

This application uses Cosmic CMS to store search results with the following structure:

- **uploaded_image** (file) - The profile picture uploaded by the user
- **found_username** (text) - The discovered Instagram username
- **profile_url** (text) - Direct link to the Instagram profile
- **search_status** (select-dropdown) - Status of the search (Found/Not Found/Error)
- **search_date** (date) - Timestamp of when the search was performed

All search attempts are stored in your Cosmic bucket under the "search-results" object type, allowing you to track history and analytics.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `COSMIC_BUCKET_SLUG`
   - `COSMIC_READ_KEY`
   - `COSMIC_WRITE_KEY`
4. Deploy!

### Deploy to Netlify

1. Push your code to GitHub
2. Create a new site in Netlify
3. Connect your repository
4. Add environment variables in Netlify dashboard
5. Set build command: `bun run build`
6. Set publish directory: `.next`
7. Deploy!

**Note:** This application demonstrates the UI/UX workflow for Instagram profile searching. Actual profile matching would require access to Instagram's API or a specialized image recognition service, which are not included in this implementation. The app simulates search results and stores them in Cosmic CMS for demonstration purposes.

<!-- README_END -->