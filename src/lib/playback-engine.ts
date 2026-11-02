import {
  timelineClips,
  TOTAL_TIMELINE_SECONDS,
  type TimelineClip,
  type TrackType,
} from '@/data/timeline-clips'
import { projects, type Project } from '@/data/portfolio-data'

/**
 * Format raw seconds into standard NLE timecode format (MM:SS:FF at 24fps).
 */
export function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const frames = Math.floor((seconds % 1) * 24)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
}

/**
 * Constrain timeline position within valid sequence boundaries [0, TOTAL_TIMELINE_SECONDS].
 */
export function clampTime(time: number): number {
  if (isNaN(time) || time < 0) return 0
  if (time > TOTAL_TIMELINE_SECONDS) return TOTAL_TIMELINE_SECONDS
  return time
}

export interface PlaybackState {
  currentTime: number
  isPlaying: boolean
  selectedClipId: string
  activeClip: TimelineClip
  isMuted: boolean
  activeTrackFilter: 'all' | TrackType
  correlatedProject: Project | null
}

export type PlaybackAction =
  | { type: 'TICK'; delta?: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'RESET' }
  | { type: 'SEEK'; time: number }
  | { type: 'SELECT_CLIP'; clipId: string }
  | { type: 'NEXT_CLIP' }
  | { type: 'PREV_CLIP' }
  | { type: 'SET_FILTER'; filter: 'all' | TrackType }
  | { type: 'TOGGLE_MUTE' }

/**
 * Resolve the active timeline clip based on playhead position, selection state, and active track filter.
 */
export function resolveActiveClip(
  clips: TimelineClip[],
  currentTime: number,
  isPlaying: boolean,
  selectedClipId: string,
  filter: 'all' | TrackType,
): TimelineClip {
  if (isPlaying) {
    const match = clips.find((c) => {
      if (filter !== 'all' && c.track !== filter) return false
      return currentTime >= c.startTime && currentTime < c.startTime + c.duration
    })
    if (match) return match
  }

  return clips.find((c) => c.id === selectedClipId) ?? clips[0]
}

/**
 * Correlate an active clip to its corresponding project dossier if it belongs to a code discipline.
 */
export function resolveCorrelatedProject(
  activeClip: TimelineClip,
  projectsList: Project[] = projects,
): Project | null {
  if (activeClip.mediaType !== 'code') return null
  return (
    projectsList.find((p) => p.name.toLowerCase() === activeClip.title.toLowerCase()) ?? null
  )
}

/**
 * Create initial state for the playback engine.
 */
export function createInitialPlaybackState(
  initialClipId = 'clip-v1-car',
  clips: TimelineClip[] = timelineClips,
  projectsList: Project[] = projects,
): PlaybackState {
  const activeClip = resolveActiveClip(clips, 0, false, initialClipId, 'all')
  const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)

  return {
    currentTime: 0,
    isPlaying: false,
    selectedClipId: initialClipId,
    activeClip,
    isMuted: true,
    activeTrackFilter: 'all',
    correlatedProject,
  }
}

/**
 * Pure state reducer driving the playback engine state machine for React hooks.
 */
export function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction,
): PlaybackState {
  return executePlaybackAction(state, action, timelineClips, projects)
}

/**
 * Pure transition executor driving the playback engine state machine with explicit dependency injection.
 */
export function executePlaybackAction(
  state: PlaybackState,
  action: PlaybackAction,
  clips: TimelineClip[] = timelineClips,
  projectsList: Project[] = projects,
): PlaybackState {
  switch (action.type) {
    case 'TICK': {
      const delta = action.delta ?? 0.5
      const next = state.currentTime + delta
      const currentTime = next >= TOTAL_TIMELINE_SECONDS ? 0 : next
      const activeClip = resolveActiveClip(
        clips,
        currentTime,
        state.isPlaying,
        state.selectedClipId,
        state.activeTrackFilter,
      )
      const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)
      return {
        ...state,
        currentTime,
        activeClip,
        correlatedProject,
      }
    }

    case 'PLAY': {
      if (state.isPlaying) return state
      const activeClip = resolveActiveClip(
        clips,
        state.currentTime,
        true,
        state.selectedClipId,
        state.activeTrackFilter,
      )
      const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)
      return {
        ...state,
        isPlaying: true,
        activeClip,
        correlatedProject,
      }
    }

    case 'PAUSE': {
      if (!state.isPlaying) return state
      return {
        ...state,
        isPlaying: false,
      }
    }

    case 'TOGGLE_PLAY': {
      const isPlaying = !state.isPlaying
      const activeClip = resolveActiveClip(
        clips,
        state.currentTime,
        isPlaying,
        state.selectedClipId,
        state.activeTrackFilter,
      )
      const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)
      return {
        ...state,
        isPlaying,
        activeClip,
        correlatedProject,
      }
    }

    case 'RESET': {
      const currentTime = 0
      const isPlaying = false
      const activeClip = resolveActiveClip(
        clips,
        currentTime,
        isPlaying,
        state.selectedClipId,
        state.activeTrackFilter,
      )
      const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)
      return {
        ...state,
        currentTime,
        isPlaying,
        activeClip,
        correlatedProject,
      }
    }

    case 'SEEK': {
      const currentTime = clampTime(action.time)
      const match = clips.find((c) => {
        if (state.activeTrackFilter !== 'all' && c.track !== state.activeTrackFilter) return false
        return currentTime >= c.startTime && currentTime < c.startTime + c.duration
      })
      const selectedClipId = match ? match.id : state.selectedClipId
      const activeClip = resolveActiveClip(
        clips,
        currentTime,
        state.isPlaying,
        selectedClipId,
        state.activeTrackFilter,
      )
      const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)
      return {
        ...state,
        currentTime,
        selectedClipId,
        activeClip,
        correlatedProject,
      }
    }

    case 'SELECT_CLIP': {
      const clip = clips.find((c) => c.id === action.clipId)
      if (!clip) return state
      const currentTime = clampTime(clip.startTime)
      const correlatedProject = resolveCorrelatedProject(clip, projectsList)
      return {
        ...state,
        currentTime,
        selectedClipId: clip.id,
        activeClip: clip,
        isPlaying: false,
        correlatedProject,
      }
    }

    case 'NEXT_CLIP': {
      const list =
        state.activeTrackFilter === 'all'
          ? clips
          : clips.filter((c) => c.track === state.activeTrackFilter)
      if (list.length === 0) return state

      const idx = list.findIndex((c) => c.id === state.activeClip.id)
      const nextClip = list[(idx + 1 + list.length) % list.length]
      const correlatedProject = resolveCorrelatedProject(nextClip, projectsList)
      return {
        ...state,
        currentTime: clampTime(nextClip.startTime),
        selectedClipId: nextClip.id,
        activeClip: nextClip,
        correlatedProject,
      }
    }

    case 'PREV_CLIP': {
      const list =
        state.activeTrackFilter === 'all'
          ? clips
          : clips.filter((c) => c.track === state.activeTrackFilter)
      if (list.length === 0) return state

      const idx = list.findIndex((c) => c.id === state.activeClip.id)
      const prevClip = list[(idx - 1 + list.length) % list.length]
      const correlatedProject = resolveCorrelatedProject(prevClip, projectsList)
      return {
        ...state,
        currentTime: clampTime(prevClip.startTime),
        selectedClipId: prevClip.id,
        activeClip: prevClip,
        correlatedProject,
      }
    }

    case 'SET_FILTER': {
      const activeTrackFilter = action.filter
      const activeClip = resolveActiveClip(
        clips,
        state.currentTime,
        state.isPlaying,
        state.selectedClipId,
        activeTrackFilter,
      )
      const correlatedProject = resolveCorrelatedProject(activeClip, projectsList)
      return {
        ...state,
        activeTrackFilter,
        activeClip,
        correlatedProject,
      }
    }

    case 'TOGGLE_MUTE': {
      return {
        ...state,
        isMuted: !state.isMuted,
      }
    }

    default:
      return state
  }
}
