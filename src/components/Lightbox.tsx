import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink } from 'lucide-react'
import type { InstagramFrame } from '@/data/portfolio-data'

interface LightboxProps {
  frames: InstagramFrame[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ frames, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const frame = frames[index]
  const isVideo = frame.media_type === 'VIDEO'

  const goNext = useCallback(() => {
    setIndex(prev => (prev + 1) % frames.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [frames.length])

  const goPrev = useCallback(() => {
    setIndex(prev => (prev - 1 + frames.length) % frames.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [frames.length])

  const toggleZoom = useCallback(() => {
    if (zoom > 1) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setZoom(2)
    }
  }, [zoom])

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape': onClose(); break
        case 'ArrowRight': goNext(); break
        case 'ArrowLeft': goPrev(); break
        case '+':
        case '=': setZoom(z => Math.min(z + 0.5, 4)); break
        case '-': setZoom(z => { const next = Math.max(z - 0.5, 1); if (next === 1) setPosition({ x: 0, y: 0 }); return next }); break
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose, goNext, goPrev])

  // Mouse drag for panning when zoomed
  function handlePointerDown(e: React.PointerEvent) {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  function handlePointerUp() {
    setIsDragging(false)
  }

  // Touch swipe for navigation
  const [touchStart, setTouchStart] = useState<number | null>(null)

  function handleTouchStart(e: React.TouchEvent) {
    if (zoom > 1) return
    setTouchStart(e.touches[0].clientX)
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null || zoom > 1) return
    const diff = e.changedTouches[0].clientX - touchStart
    if (Math.abs(diff) > 60) {
      if (diff > 0) goPrev()
      else goNext()
    }
    setTouchStart(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 relative z-10">
          <div className="text-white/60 text-sm font-mono">
            {String(index + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-2">
            {!isVideo && (
              <>
                <button
                  onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setZoom(z => { const n = Math.max(z - 0.5, 1); if (n === 1) setPosition({ x: 0, y: 0 }); return n }); }}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
              </>
            )}
            <a
              href={frame.permalink}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Open on Instagram"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div
          className={cn(
            'flex-1 flex items-center justify-center relative overflow-hidden select-none',
            zoom > 1 ? 'cursor-grab' : 'cursor-default',
            isDragging && 'cursor-grabbing',
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={toggleZoom}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={frame.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[80vh]"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
            >
              {isVideo ? (
                <video
                  src={frame.media_url}
                  poster={frame.thumbnail_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] rounded-lg"
                  playsInline
                />
              ) : (
                <img
                  src={frame.media_url}
                  alt={frame.caption || 'Photo by Chintan Rathod'}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Caption bar */}
        <div className="p-4 text-center">
          <p className="text-white/80 text-sm max-w-lg mx-auto">
            {frame.caption || 'A moment, kept.'}
          </p>
        </div>

        {/* Thumbnail strip */}
        <div className="flex items-center justify-center gap-2 px-4 pb-4 overflow-x-auto">
          {frames.map((f, i) => (
            <button
              key={f.id}
              onClick={() => { setIndex(i); setZoom(1); setPosition({ x: 0, y: 0 }) }}
              className={cn(
                'w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 shrink-0',
                i === index
                  ? 'border-white/80 opacity-100 scale-110'
                  : 'border-transparent opacity-40 hover:opacity-70',
              )}
            >
              <img
                src={f.media_type === 'VIDEO' ? (f.thumbnail_url ?? f.media_url) : f.media_url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
