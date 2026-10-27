import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink } from 'lucide-react'
import type { GalleryFrame } from '@/data/portfolio-data'

interface LightboxProps {
  frames: GalleryFrame[]
  startIndex: number
  onClose: () => void
}

export default function Lightbox({ frames, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)

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

  // Auto-play muted video when frame changes
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.muted = true
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback waiting for user gesture:', err)
        })
      }
    }
  }, [index, isVideo, frame.id])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col h-screen h-[100dvh] w-screen overflow-hidden"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Top bar */}
        <div className="shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 relative z-20">
          <div className="text-white/60 text-sm font-mono">
            {String(index + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
          </div>

          <div className="flex items-center gap-2">
            {!isVideo && (
              <>
                <button
                  onClick={() => setZoom(z => Math.min(z + 0.5, 4))}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => { setZoom(z => { const n = Math.max(z - 0.5, 1); if (n === 1) setPosition({ x: 0, y: 0 }); return n }); }}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
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
              className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div
          className={cn(
            'flex-1 min-h-0 w-full flex items-center justify-center relative overflow-hidden select-none px-4 sm:px-20',
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
              className="w-full h-full max-w-full max-h-full flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
            >
              {isVideo ? (
                <div
                  className="relative flex items-center justify-center max-w-full max-h-full"
                  onPointerDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    ref={videoRef}
                    key={frame.id}
                    poster={frame.thumbnail_url}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-10rem)] w-auto h-auto rounded-lg shadow-2xl object-contain bg-black/60"
                    style={{
                      maxHeight: 'calc(100dvh - 13rem)',
                      maxWidth: 'min(90vw, 1200px)',
                    }}
                  >
                    <source src={frame.media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <img
                  src={frame.media_url}
                  alt={frame.caption || 'Photo by Chintan Rathod'}
                  className="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-10rem)] w-auto h-auto object-contain rounded-lg select-none"
                  style={{
                    maxHeight: 'calc(100dvh - 13rem)',
                    maxWidth: 'min(90vw, 1400px)',
                  }}
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev() }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white/70 hover:bg-black/90 hover:text-white transition-all backdrop-blur-sm z-30 shadow-lg cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext() }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white/70 hover:bg-black/90 hover:text-white transition-all backdrop-blur-sm z-30 shadow-lg cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Caption bar */}
        <div className="shrink-0 py-2 px-4 text-center relative z-10">
          <p className="text-white/80 text-xs sm:text-sm max-w-lg mx-auto truncate sm:whitespace-normal">
            {frame.caption || 'A moment, kept.'}
          </p>
        </div>

        {/* Thumbnail strip */}
        <div className="shrink-0 pb-3 px-4 flex items-center justify-center gap-2 overflow-x-auto relative z-10 max-w-full">
          {frames.map((f, i) => (
            <button
              key={f.id}
              onClick={() => { setIndex(i); setZoom(1); setPosition({ x: 0, y: 0 }) }}
              className={cn(
                'w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer',
                i === index
                  ? 'border-white/80 opacity-100 scale-110 shadow-md'
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
