import { useReducer, useEffect, useCallback } from 'react'
import {
  playbackReducer,
  createInitialPlaybackState,
  formatTimecode,
} from '@/lib/playback-engine'
import type { TrackType, TimelineClip } from '@/data/timeline-clips'

export interface UsePlaybackEngineOptions {
  initialClipId?: string
  tickIntervalMs?: number
  enableKeyboardShortcuts?: boolean
}

export function usePlaybackEngine({
  initialClipId = 'clip-v1-car',
  tickIntervalMs = 500,
  enableKeyboardShortcuts = true,
}: UsePlaybackEngineOptions = {}) {
  const [state, dispatch] = useReducer(
    playbackReducer,
    initialClipId,
    createInitialPlaybackState,
  )

  // Timer scheduling loop
  useEffect(() => {
    if (!state.isPlaying) return

    const interval = setInterval(() => {
      dispatch({ type: 'TICK', delta: 0.5 })
    }, tickIntervalMs)

    return () => clearInterval(interval)
  }, [state.isPlaying, tickIntervalMs])

  // Explicit transport action dispatchers
  const play = useCallback(() => dispatch({ type: 'PLAY' }), [])
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [])
  const togglePlay = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])
  const seek = useCallback((time: number) => dispatch({ type: 'SEEK', time }), [])
  const selectClip = useCallback((clip: TimelineClip) => dispatch({ type: 'SELECT_CLIP', clipId: clip.id }), [])
  const nextClip = useCallback(() => dispatch({ type: 'NEXT_CLIP' }), [])
  const prevClip = useCallback(() => dispatch({ type: 'PREV_CLIP' }), [])
  const setTrackFilter = useCallback((filter: 'all' | TrackType) => dispatch({ type: 'SET_FILTER', filter }), [])
  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), [])

  // Global keyboard transport controls
  useEffect(() => {
    if (!enableKeyboardShortcuts) return

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('button, a, input, textarea, select, [contenteditable="true"], [role="button"], [role="tab"], [role="slider"]'))
      ) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        nextClip()
      } else if (e.code === 'ArrowLeft' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        prevClip()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardShortcuts, togglePlay, nextClip, prevClip])

  return {
    state,
    dispatch,
    play,
    pause,
    togglePlay,
    reset,
    seek,
    selectClip,
    nextClip,
    prevClip,
    setTrackFilter,
    toggleMute,
    formatTimecode,
  }
}

export type PlaybackEngine = ReturnType<typeof usePlaybackEngine>
