import SearchHistory from '@/components/SearchHistory'
import UploadForm from '@/components/UploadForm'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            InstaFind
          </h1>
          <p className="text-xl text-gray-300">
            Upload a profile picture to find the Instagram username
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Upload Section */}
          <section className="glass-effect rounded-2xl p-8 shadow-2xl">
            <UploadForm />
          </section>

          {/* Search History */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Search History
            </h2>
            <SearchHistory />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 text-center text-gray-400">
        <p className="text-sm">
          Note: This is a demonstration app. Actual Instagram profile matching requires specialized APIs.
        </p>
      </footer>
    </main>
  )
}