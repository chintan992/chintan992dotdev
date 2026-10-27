import { useEffect, useState } from 'react'

interface DeviceOrientation {
  alpha: number
  beta: number
  gamma: number
  supported: boolean
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: 0,
    beta: 0,
    gamma: 0,
    supported: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return

    function handleOrientation(e: DeviceOrientationEvent) {
      setOrientation({
        alpha: e.alpha ?? 0,
        beta: Math.max(-45, Math.min(45, e.beta ?? 0)),
        gamma: Math.max(-45, Math.min(45, e.gamma ?? 0)),
        supported: true,
      })
    }

    window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])

  return orientation
}
