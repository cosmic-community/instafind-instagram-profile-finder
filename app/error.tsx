'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-effect rounded-2xl p-8 max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-400">Something went wrong!</h2>
        <p className="text-gray-400">{error.message}</p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}