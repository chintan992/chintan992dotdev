import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { galleryFrames, type GalleryFrame } from '@/data/portfolio-data'
import { ExternalLink } from 'lucide-react'
import { InstagramIcon } from '@/components/Icons'
import Lightbox from './Lightbox'

function GalleryVideo({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotionQuery.matches) {
      video.pause()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Handle browser autoplay policy restrictions gracefully
          })
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [])

  return (
    <div className="relative w-full overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="none"
        width={800}
        height={1000}
        className="w-full h-auto block"
      />
      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-mono text-slate-300">
        FILM
      </div>
    </div>
  )
}

export default function MasonryGallery() {
  const [frames] = useState<GalleryFrame[]>(galleryFrames)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 0.72, 0.18, 1] }}
        className="w-full"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-mono tracking-wider uppercase mb-1.5 text-slate-400">
              Curated Frames & Motion
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium font-display tracking-tight text-white">
              Selected Photography
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/chintan992_2/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@chintan992_2</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {frames.map((frame, i) => (
            <motion.button
              key={frame.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
              className="relative w-full break-inside-avoid rounded-xl overflow-hidden group cursor-pointer bg-neutral-900 block focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              onClick={() => setLightboxIndex(i)}
            >
              {frame.media_type === 'VIDEO' ? (
                <GalleryVideo src={frame.media_url} poster={frame.thumbnail_url} />
              ) : (
                <img
                  src={frame.media_url}
                  alt={frame.caption || `Photography by Chintan Rathod, frame ${i + 1}`}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  width={800}
                  height={1000}
                  className="w-full h-auto block group-hover:opacity-90 transition-opacity duration-200"
                />
              )}
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
