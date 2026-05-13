import { useState } from 'react'

/**
 * ProductImage Component
 * Handles local and remote images with fallback to placeholder
 * Features:
 * - Lazy loading
 * - Error fallback to placeholder
 * - Hover zoom effect (controlled by parent)
 * - Optimized for performance
 */
export function ProductImage({ src, alt = 'Product image', className = '' }) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Use local image first, fall back to placeholder if error
  const imageSrc = imageError ? getPlaceholderSvg() : src

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}>
      {isLoading && !imageError && (
        <div className="absolute inset-0 animate-pulse bg-slate-300" />
      )}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={handleError}
          onLoad={handleLoad}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
          <svg
            className="h-16 w-16 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

/**
 * Generate a simple SVG placeholder
 * Returns a data URI for instant display without network request
 */
function getPlaceholderSvg() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#grad)" />
      <g opacity="0.3">
        <rect x="100" y="80" width="200" height="250" fill="none" stroke="#94a3b8" stroke-width="2" />
        <circle cx="200" cy="150" r="30" fill="none" stroke="#94a3b8" stroke-width="2" />
        <path d="M 100 330 L 150 280 L 250 330 L 300 230 L 300 330" fill="none" stroke="#94a3b8" stroke-width="2" />
      </g>
      <text x="200" y="450" font-size="14" fill="#94a3b8" text-anchor="middle" font-family="system-ui">
        Image not available
      </text>
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}
