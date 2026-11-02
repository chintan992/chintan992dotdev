import { useState, useRef, useEffect } from 'react'
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
            // Browser autoplay restrictions handled gracefully
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
    <div className="relative w-full overflow-hidden bg-neutral-950">
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
      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-mono text-zinc-300 border border-white/10">
        MOTION
      </div>
    </div>
  )
}

export default function MasonryGallery() {
  const [frames] = useState<GalleryFrame[]>(galleryFrames)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <>
      <section className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
              <span>Documentary Chronicle · Canadian Rockies</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-medium font-display tracking-tight text-white">
              Selected Photography & Motion
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/chintan992_2/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@chintan992_2</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
          </div>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {frames.map((frame, i) => (
            <button
              key={frame.id}
              className="relative w-full break-inside-avoid rounded-xl overflow-hidden group cursor-pointer bg-[#141618] border border-white/[0.06] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a868]"
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
                  className="w-full h-auto block group-hover:opacity-90 transition-opacity duration-300"
                />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox frames={frames} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </>
  )
}
