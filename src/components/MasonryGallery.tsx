import { useState } from 'react'
import { motion } from 'framer-motion'
import { galleryFrames, type GalleryFrame } from '@/data/portfolio-data'
import { ExternalLink } from 'lucide-react'
import { InstagramIcon } from '@/components/Icons'
import Lightbox from './Lightbox'

export default function MasonryGallery() {
  const [frames] = useState<GalleryFrame[]>(galleryFrames)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

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
            <p className="text-xs font-mono tracking-[0.15em] uppercase mb-2 text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full mr-2 bg-amber-400/80" />
              Curated Frames & Film Motion
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Notes from <span className="serif-italic-accent font-normal text-slate-300">out there</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/chintan992_2/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
              Photo work
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.instagram.com/chintan992/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
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
              className="relative w-full break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer border border-white/[0.08] hover:border-white/[0.25] hover:shadow-[0_12px_30px_rgba(0,0,0,0.6)] transition-all duration-300 bg-white/[0.02]"
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
                    width={800}
                    height={1000}
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
                  decoding="async"
                  width={800}
                  height={1000}
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
