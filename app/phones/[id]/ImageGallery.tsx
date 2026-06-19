'use client'

import { useState } from 'react'

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const selectedImage = images[selectedIndex]

  return (
    <div>
      <div
        style={{ overflow: 'hidden', marginBottom: '10px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', position: 'relative' }}
        onClick={() => setLightboxOpen(true)}
      >
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={alt}
            style={{ width: '100%', height: '340px', objectFit: 'contain', padding: '20px', transition: 'transform 0.2s' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '340px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
            }}
          >
            📱
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '8px',
          padding: '4px 12px', fontSize: '12px', opacity: 0.7,
        }}>
          🔍 بزرگ‌نمایی
        </div>
      </div>

      {images.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, 1fr)`, gap: '10px' }}>
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => { e.stopPropagation(); setSelectedIndex(index) }}
              style={{
                background: index === selectedIndex ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.03)',
                border: 'none',
                borderRadius: '18px',
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                boxShadow: index === selectedIndex ? '0 6px 18px rgba(59, 130, 246, 0.18)' : '0 1px 4px rgba(15, 23, 42, 0.06)',
                transform: index === selectedIndex ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
              }}
            >
              <img
                src={img}
                alt={`${alt} ${index + 1}`}
                style={{ width: '100%', height: '80px', objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && selectedImage && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '20px',
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: '44px', height: '44px',
              color: '#fff', fontSize: '24px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
          <img
            src={selectedImage}
            alt={alt}
            style={{
              maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain',
              borderRadius: '8px',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
