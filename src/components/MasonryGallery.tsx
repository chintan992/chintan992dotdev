import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { galleryFrames, type GalleryFrame } from '@/data/portfolio-data'
import { ExternalLink } from 'lucide-react'
import { InstagramIcon } from '@/components/Icons'
import Lightbox from './Lightbox'

interface MasonryGalleryProps {
  visualTone?: 'day' | 'night'
}

export default function MasonryGallery({ visualTone = 'night' }: MasonryGalleryProps) {
  const [frames] = useState<GalleryFrame[]>(galleryFrames)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const isDark = visualTone === 'night'

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 0.72, 0.18, 1] }}
        className="w-full"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p
              className={cn(
                'text-xs font-mono tracking-[0.15em] uppercase mb-2',
                isDark ? 'text-[#c8a45c]/70' : 'text-[#8b6914]/70',
              )}
            >
              <span
                className={cn(
                  'inline-block w-2 h-2 rounded-full mr-2',
                  isDark ? 'bg-[#c8a45c]' : 'bg-[#8b6914]',
                )}
              />
              Selected frames
            </p>
            <h2
              className={cn(
                'text-3xl md:text-4xl font-bold tracking-tight font-display',
                isDark ? 'text-white' : 'text-[#2a2520]',
              )}
            >
              Notes from <em className={isDark ? 'text-[#c8a45c]' : 'text-[#8b6914]'}>out there</em>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/chintan992_2/"
              target="_blank"
              rel="noreferrer"
              className={cn(
                'flex items-center gap-2 text-xs font-mono transition-colors',
                isDark ? 'text-gray-400 hover:text-[#c8a45c]' : 'text-gray-600 hover:text-[#8b6914]',
              )}
            >
              <InstagramIcon className="w-4 h-4" />
              Photo work
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.instagram.com/chintan992/"
              target="_blank"
              rel="noreferrer"
              className={cn(
                'flex items-center gap-2 text-xs font-mono transition-colors',
                isDark ? 'text-gray-400 hover:text-[#c8a45c]' : 'text-gray-600 hover:text-[#8b6914]',
              )}
            >
              <InstagramIcon className="w-4 h-4" />
              Main
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {frames.map((frame, i) => (
            <motion.button
              key={frame.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={cn(
                'relative w-full break-inside-avoid rounded-xl overflow-hidden group cursor-pointer',
                'border transition-all duration-300',
                isDark
                  ? 'border-gray-800/40 hover:border-[#c8a45c]/40 hover:shadow-[0_0_20px_rgba(200,164,92,0.1)]'
                  : 'border-gray-200 hover:border-[#8b6914]/30 hover:shadow-lg',
              )}
              onClick={() => setLightboxIndex(i)}
            >
              {frame.media_type === 'VIDEO' ? (
                <div className="relative w-full overflow-hidden">
                  <video
                    src={frame.media_url}
                    poster={frame.thumbnail_url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                    <span className="text-white text-[10px]">▶</span>
                  </div>
                </div>
              ) : (
                <img
                  src={frame.media_url}
                  alt={frame.caption || `Photography by Chintan Rathod, frame ${i + 1}`}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left pointer-events-none">
                <p className="text-white text-xs line-clamp-2 leading-relaxed">
                  {frame.caption || 'A moment, kept.'}
                </p>
                <span className="text-white/60 text-[10px] font-mono mt-1">
                  {String(i + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox frames={frames} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}
