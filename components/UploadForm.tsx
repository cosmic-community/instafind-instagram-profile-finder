'use client'

import { useState, useRef } from 'react'
import { UploadResponse } from '@/types'

export default function UploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<UploadResponse | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setSelectedFile(file)
    setResult(null)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      alert('Please select an image first')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data: UploadResponse = await response.json()
      setResult(data)

      if (data.success) {
        // Reset form after successful upload
        setTimeout(() => {
          setSelectedFile(null)
          setPreview(null)
          setResult(null)
          // Refresh the page to show new search in history
          window.location.reload()
        }, 3000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setResult({
        success: false,
        status: 'error',
        message: 'Failed to upload image'
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="space-y-4">
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null)
                setPreview(null)
                setResult(null)
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Change image
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Click to browse
              </button>
              <span className="text-gray-400"> or drag and drop</span>
            </div>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {selectedFile && !result && (
        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </span>
          ) : (
            'Find Instagram ID'
          )}
        </button>
      )}

      {/* Result Display */}
      {result && (
        <div
          className={`p-6 rounded-xl ${
            result.status === 'found'
              ? 'bg-green-500/20 border border-green-500'
              : result.status === 'not_found'
              ? 'bg-yellow-500/20 border border-yellow-500'
              : 'bg-red-500/20 border border-red-500'
          }`}
        >
          <div className="text-center space-y-3">
            <p className="text-lg font-semibold">{result.message}</p>
            {result.username && (
              <div className="space-y-2">
                <p className="text-2xl font-bold">{result.username}</p>
                {result.profileUrl && (
                  <a
                    href={result.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-primary hover:text-primary-dark transition-colors"
                  >
                    View Profile →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  )
}