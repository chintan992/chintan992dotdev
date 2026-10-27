import { useEffect, useRef } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation'
import type { PortfolioMode } from '@/data/portfolio-data'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  hue: number
}

interface CursorCanvasProps {
  mode?: PortfolioMode
}

export default function CursorCanvas({ mode = 'hub' }: CursorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useMousePosition()
  const orientation = useDeviceOrientation()
  const mouseRef = useRef({ x: 0, y: 0 })
  const orientationRef = useRef({ beta: 0, gamma: 0, supported: false })
  const modeRef = useRef<PortfolioMode>(mode)
  const particlesRef = useRef<Particle[]>([])
  const animRef = useRef(0)

  useEffect(() => {
    mouseRef.current = { x: mouse.x, y: mouse.y }
  }, [mouse.x, mouse.y])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    orientationRef.current = {
      beta: orientation.beta,
      gamma: orientation.gamma,
      supported: orientation.supported,
    }
  }, [orientation.beta, orientation.gamma, orientation.supported])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = `${window.innerWidth}px`
      canvas!.style.height = `${window.innerHeight}px`
      ctx!.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 18000))
    particlesRef.current = Array.from({ length: count }, () => {
      const currentMode = modeRef.current
      const isWarm = currentMode === 'visual' || (currentMode === 'hub' && Math.random() > 0.7)
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.25 + 0.08,
        hue: isWarm ? 38 : 215, // warm titanium gold or cool titanium silver
      }
    })

    function draw() {
      const w = window.innerWidth
      const h = window.innerHeight
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const currentMode = modeRef.current

      ctx!.clearRect(0, 0, w, h)

      // Draw subtle radial titanium glow following cursor
      if (mx > 0 || my > 0) {
        const grad = ctx!.createRadialGradient(mx, my, 0, mx, my, 320)
        if (currentMode === 'visual') {
          grad.addColorStop(0, 'rgba(212, 175, 55, 0.05)')
          grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.015)')
          grad.addColorStop(1, 'transparent')
        } else {
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.04)')
          grad.addColorStop(0.5, 'rgba(148, 163, 184, 0.015)')
          grad.addColorStop(1, 'transparent')
        }
        ctx!.fillStyle = grad
        ctx!.fillRect(0, 0, w, h)
      }

      const particles = particlesRef.current
      const strokeColor =
        currentMode === 'visual'
          ? '212, 175, 55'
          : '203, 213, 225'

      for (const p of particles) {
        // Attract toward mouse
        const dx = mx - p.x
        const dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 0.008
          p.vx += dx / dist * force
          p.vy += dy / dist * force
        }

        // Apply device tilt if supported
        if (orientationRef.current.supported) {
          p.vx += orientationRef.current.gamma * 0.0004
          p.vy += orientationRef.current.beta * 0.0004
        }

        // Apply velocity
        p.x += p.vx
        p.y += p.vy

        // Dampen
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap around
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        // Draw particle
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`
        ctx!.fill()

        // Draw connections to nearby particles
        for (const other of particles) {
          if (other === p) continue
          const ddx = other.x - p.x
          const ddy = other.y - p.y
          const d = ddx * ddx + ddy * ddy
          if (d < 12000) {
            const lineAlpha = (1 - d / 12000) * 0.12
            ctx!.beginPath()
            ctx!.moveTo(p.x, p.y)
            ctx!.lineTo(other.x, other.y)
            ctx!.strokeStyle = `rgba(${strokeColor}, ${lineAlpha})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    // Check for prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animRef.current = requestAnimationFrame(draw)
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}
