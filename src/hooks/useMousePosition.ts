import { useEffect, useRef, useState } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

export function useMousePosition() {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })
  const frame = useRef(0)

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (frame.current) return
      frame.current = requestAnimationFrame(() => {
        frame.current = 0
        setPosition({
          x: e.clientX,
          y: e.clientY,
          normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
          normalizedY: (e.clientY / window.innerHeight) * 2 - 1,
        })
      })
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return position
}
