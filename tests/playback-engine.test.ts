import { describe, it, expect } from 'vitest'
import {
  formatTimecode,
  clampTime,
  createInitialPlaybackState,
  executePlaybackAction,
  resolveActiveClip,
  resolveCorrelatedProject,
  type PlaybackState,
} from '../src/lib/playback-engine'
import type { TimelineClip } from '../src/data/timeline-clips'
import type { Project } from '../src/data/portfolio-data'

const mockClips: TimelineClip[] = [
  {
    id: 'clip-1',
    track: 'v1',
    title: 'Visual Clip 1',
    subtitle: 'Cinema',
    startTime: 0,
    duration: 30,
    color: '#e59846',
    badge: '4K MOTION',
    description: 'First test clip',
    mediaType: 'video',
  },
  {
    id: 'clip-2',
    track: 'v1',
    title: 'Visual Clip 2',
    subtitle: 'Cinema',
    startTime: 30,
    duration: 30,
    color: '#e59846',
    badge: '4K MOTION',
    description: 'Second test clip',
    mediaType: 'video',
  },
  {
    id: 'clip-sys-1',
    track: 'sys',
    title: 'Test Project',
    subtitle: 'Architecture',
    startTime: 60,
    duration: 30,
    color: '#38bdf8',
    badge: 'SYSTEMS',
    description: 'Code test clip',
    mediaType: 'code',
  },
]

const mockProjects: Project[] = [
  {
    name: 'Test Project',
    category: 'Engineering',
    description: 'A mock project for testing',
    stack: ['TypeScript'],
    github: 'https://github.com/test/project',
    host: 'test-project',
  },
]

describe('PlaybackEngine Domain & State Machine', () => {
  it('formats timecode correctly at 24fps', () => {
    expect(formatTimecode(0)).toBe('00:00:00')
    expect(formatTimecode(15.5)).toBe('00:15:12')
    expect(formatTimecode(65)).toBe('01:05:00')
    expect(formatTimecode(120)).toBe('02:00:00')
  })

  it('clamps time within boundaries [0, 120]', () => {
    expect(clampTime(-10)).toBe(0)
    expect(clampTime(45)).toBe(45)
    expect(clampTime(150)).toBe(120)
    expect(clampTime(NaN)).toBe(0)
  })

  it('initializes to a paused state at time 0', () => {
    const state = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    expect(state.currentTime).toBe(0)
    expect(state.isPlaying).toBe(false)
    expect(state.selectedClipId).toBe('clip-1')
    expect(state.activeClip.id).toBe('clip-1')
    expect(state.activeTrackFilter).toBe('all')
    expect(state.isMuted).toBe(true)
  })

  it('handles TICK action to advance playhead and loop at boundary', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    const playingState: PlaybackState = { ...initial, isPlaying: true }

    const ticked = executePlaybackAction(playingState, { type: 'TICK', delta: 0.5 }, mockClips, mockProjects)
    expect(ticked.currentTime).toBe(0.5)

    const nearEndState: PlaybackState = { ...playingState, currentTime: 119.8 }
    const looped = executePlaybackAction(nearEndState, { type: 'TICK', delta: 0.5 }, mockClips, mockProjects)
    expect(looped.currentTime).toBe(0)
  })

  it('handles PLAY, PAUSE, and TOGGLE_PLAY transitions', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    expect(initial.isPlaying).toBe(false)

    const played = executePlaybackAction(initial, { type: 'PLAY' }, mockClips, mockProjects)
    expect(played.isPlaying).toBe(true)

    const paused = executePlaybackAction(played, { type: 'PAUSE' }, mockClips, mockProjects)
    expect(paused.isPlaying).toBe(false)

    const toggled1 = executePlaybackAction(paused, { type: 'TOGGLE_PLAY' }, mockClips, mockProjects)
    expect(toggled1.isPlaying).toBe(true)

    const toggled2 = executePlaybackAction(toggled1, { type: 'TOGGLE_PLAY' }, mockClips, mockProjects)
    expect(toggled2.isPlaying).toBe(false)
  })

  it('handles SEEK action and resolves the clip at seeked position', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    const seeked = executePlaybackAction(initial, { type: 'SEEK', time: 35 }, mockClips, mockProjects)

    expect(seeked.currentTime).toBe(35)
    expect(seeked.selectedClipId).toBe('clip-2')
    expect(seeked.activeClip.id).toBe('clip-2')
  })

  it('handles SELECT_CLIP action, positioning timecode and pausing playback', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    const playing: PlaybackState = { ...initial, isPlaying: true }

    const selected = executePlaybackAction(playing, { type: 'SELECT_CLIP', clipId: 'clip-2' }, mockClips, mockProjects)
    expect(selected.selectedClipId).toBe('clip-2')
    expect(selected.currentTime).toBe(30)
    expect(selected.isPlaying).toBe(false)
    expect(selected.activeClip.id).toBe('clip-2')
  })

  it('handles NEXT_CLIP and PREV_CLIP navigation and wrapping', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)

    const next1 = executePlaybackAction(initial, { type: 'NEXT_CLIP' }, mockClips, mockProjects)
    expect(next1.activeClip.id).toBe('clip-2')

    const next2 = executePlaybackAction(next1, { type: 'NEXT_CLIP' }, mockClips, mockProjects)
    expect(next2.activeClip.id).toBe('clip-sys-1')

    // Wraps back to first clip
    const next3 = executePlaybackAction(next2, { type: 'NEXT_CLIP' }, mockClips, mockProjects)
    expect(next3.activeClip.id).toBe('clip-1')

    // Previous clip wraps to end
    const prev = executePlaybackAction(initial, { type: 'PREV_CLIP' }, mockClips, mockProjects)
    expect(prev.activeClip.id).toBe('clip-sys-1')
  })

  it('respects track filtering during clip navigation', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    const filtered: PlaybackState = { ...initial, activeTrackFilter: 'v1' }

    const next1 = executePlaybackAction(filtered, { type: 'NEXT_CLIP' }, mockClips, mockProjects)
    expect(next1.activeClip.id).toBe('clip-2')

    // Should wrap back to clip-1 because clip-sys-1 is on 'sys' track
    const next2 = executePlaybackAction(next1, { type: 'NEXT_CLIP' }, mockClips, mockProjects)
    expect(next2.activeClip.id).toBe('clip-1')
  })

  it('correlates code clips with project dossiers', () => {
    const codeClip = mockClips[2]
    const correlated = resolveCorrelatedProject(codeClip, mockProjects)
    expect(correlated).not.toBeNull()
    expect(correlated?.name).toBe('Test Project')

    const videoClip = mockClips[0]
    expect(resolveCorrelatedProject(videoClip, mockProjects)).toBeNull()
  })

  it('resolves active clip by playhead during playback and by selection when paused', () => {
    // When playing, derive clip matching playhead timestamp
    const activeWhenPlaying = resolveActiveClip(mockClips, 35, true, 'clip-1', 'all')
    expect(activeWhenPlaying.id).toBe('clip-2')

    // When paused, maintain selected clip
    const activeWhenPaused = resolveActiveClip(mockClips, 35, false, 'clip-1', 'all')
    expect(activeWhenPaused.id).toBe('clip-1')
  })

  it('toggles audio mute status', () => {
    const initial = createInitialPlaybackState('clip-1', mockClips, mockProjects)
    expect(initial.isMuted).toBe(true)

    const unmuted = executePlaybackAction(initial, { type: 'TOGGLE_MUTE' }, mockClips, mockProjects)
    expect(unmuted.isMuted).toBe(false)

    const remuted = executePlaybackAction(unmuted, { type: 'TOGGLE_MUTE' }, mockClips, mockProjects)
    expect(remuted.isMuted).toBe(true)
  })
})
