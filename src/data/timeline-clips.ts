export type TrackType = 'v1' | 'v2' | 'sys' | 'ops'

export interface TimelineClip {
  id: string
  track: TrackType
  title: string
  subtitle: string
  startTime: number // in seconds, total timeline 120s
  duration: number
  color: string
  badge: string
  description: string
  mediaType: 'video' | 'photo' | 'code' | 'ops'
  mediaUrl?: string
  thumbnailUrl?: string
  linkUrl?: string
  githubUrl?: string
  techStack?: string[]
  metrics?: { label: string; value: string }[]
  architecture?: string
  highlights?: string[]
}

export const TOTAL_TIMELINE_SECONDS = 120

// Curated timeline clips across all four discipline tracks
export const timelineClips: TimelineClip[] = [
  // --- V1: 4K Motion Reel ---
  {
    id: 'clip-v1-car',
    track: 'v1',
    title: 'Automotive Silhouettes',
    subtitle: 'Sony Alpha · 4K HDR 24fps',
    startTime: 0,
    duration: 30,
    color: '#e59846',
    badge: '4K MOTION',
    description: 'Automotive silhouettes and reflective surfaces captured under dynamic dusk lighting in Calgary.',
    mediaType: 'video',
    mediaUrl: '/media/videos/model-car.mp4',
    thumbnailUrl: '/media/thumbnails/model-car.jpg',
    metrics: [
      { label: 'Resolution', value: '3840×2160' },
      { label: 'Framerate', value: '23.976 fps' },
      { label: 'Optics', value: '24-70mm G-Master' },
    ],
  },
  {
    id: 'clip-v1-street',
    track: 'v1',
    title: 'Street Narratives',
    subtitle: 'Downtown Calgary · Documentary',
    startTime: 30,
    duration: 30,
    color: '#e59846',
    badge: '4K MOTION',
    description: 'Fleeting street encounters and pedestrian rhythms framed through natural ambient contrast.',
    mediaType: 'video',
    mediaUrl: '/media/videos/street1.mp4',
    thumbnailUrl: '/media/thumbnails/street1.jpg',
    metrics: [
      { label: 'Resolution', value: '3840×2160' },
      { label: 'Color Space', value: 'S-Log3 / S-Gamut3' },
      { label: 'Optics', value: '35mm f/1.4 Prime' },
    ],
  },
  {
    id: 'clip-v1-tower',
    track: 'v1',
    title: 'Monolith in Motion',
    subtitle: 'Telus Sky & Calgary Core',
    startTime: 60,
    duration: 30,
    color: '#e59846',
    badge: '4K MOTION',
    description: 'Architectural geometry and vertical kinetic sweeps across high-altitude glass and steel.',
    mediaType: 'video',
    mediaUrl: '/media/videos/tower1.mp4',
    thumbnailUrl: '/media/thumbnails/tower1.jpg',
    metrics: [
      { label: 'Motion', value: 'DJI RS3 Pro Gimbal' },
      { label: 'Framerate', value: '23.976 fps' },
      { label: 'Location', value: 'Calgary, AB' },
    ],
  },
  {
    id: 'clip-v1-train',
    track: 'v1',
    title: 'Transit Rhythms',
    subtitle: 'Rail & Rail Reflections',
    startTime: 90,
    duration: 30,
    color: '#e59846',
    badge: '4K MOTION',
    description: 'Sub-zero rail transit cadence with metallic reflections at golden hour.',
    mediaType: 'video',
    mediaUrl: '/media/videos/train1.mp4',
    thumbnailUrl: '/media/thumbnails/train1.jpg',
    metrics: [
      { label: 'Audio', value: '32-bit Float' },
      { label: 'Lighting', value: 'Natural Dusk' },
      { label: 'Optics', value: '85mm f/1.8' },
    ],
  },

  // --- V2: Stills & Plates ---
  {
    id: 'clip-v2-skyline',
    track: 'v2',
    title: 'Calgary Skyline Twilight',
    subtitle: 'Bow Valley Escarpment',
    startTime: 0,
    duration: 40,
    color: '#94a3b8',
    badge: 'STILL PLATE',
    description: 'The transition between prairie twilight and high alpine nightfall over downtown Calgary.',
    mediaType: 'photo',
    mediaUrl: '/media/photos/CHR07389.jpg',
    metrics: [
      { label: 'Aperture', value: 'f/2.8' },
      { label: 'Shutter', value: '1/125s' },
      { label: 'Sensor', value: '35mm Full-Frame' },
    ],
  },
  {
    id: 'clip-v2-corridor',
    track: 'v2',
    title: 'Corridors at Golden Hour',
    subtitle: 'Architectural Framing',
    startTime: 40,
    duration: 40,
    color: '#94a3b8',
    badge: 'STILL PLATE',
    description: 'Quiet concrete passages washed with low-angled sun and geometric shadows.',
    mediaType: 'photo',
    mediaUrl: '/media/photos/CHR07399.jpg',
    metrics: [
      { label: 'Aperture', value: 'f/1.8' },
      { label: 'ISO', value: '100' },
      { label: 'Focal Length', value: '35mm' },
    ],
  },
  {
    id: 'clip-v2-foothills',
    track: 'v2',
    title: 'Dawn across Foothills',
    subtitle: 'Canadian Rockies Basin',
    startTime: 80,
    duration: 40,
    color: '#94a3b8',
    badge: 'STILL PLATE',
    description: 'First light breaking across the mist and limestone ridges of the Alberta foothills.',
    mediaType: 'photo',
    mediaUrl: '/media/photos/CHR07533.jpg',
    metrics: [
      { label: 'Elevation', value: '1,320m' },
      { label: 'Optics', value: '24-70mm GM' },
      { label: 'Condition', value: 'Dawn Fog' },
    ],
  },

  // --- SYS: Code Runtimes ---
  {
    id: 'clip-sys-letstream',
    track: 'sys',
    title: "Let's Stream",
    subtitle: 'PWA Media Platform · React 19',
    startTime: 0,
    duration: 35,
    color: '#38bdf8',
    badge: 'RUNTIME',
    description: 'Progressive entertainment platform with client-side cache stores, TMDB API sync, and offline playback metadata.',
    mediaType: 'code',
    mediaUrl: '/media/photos/CHR07391.jpg',
    githubUrl: 'https://github.com/chintan992/letsstream2',
    techStack: ['React 19', 'TypeScript', 'PWA', 'Firebase'],
    highlights: [
      'PWA offline playback metadata sync',
      'Zero-latency client-side cache store',
      'Dynamic streaming provider mapping',
    ],
    architecture: 'Architected around progressive web standards with client-side cache stores, TMDB streaming metadata synchronization, and responsive player interfaces.',
    metrics: [
      { label: 'Stars', value: '23' },
      { label: 'Stack', value: 'TypeScript' },
      { label: 'PWA', value: 'Service Worker' },
    ],
  },
  {
    id: 'clip-sys-xplayer',
    track: 'sys',
    title: 'X Player',
    subtitle: 'Android Media3 / ExoPlayer Core',
    startTime: 35,
    duration: 35,
    color: '#38bdf8',
    badge: 'RUNTIME',
    description: 'Hardware-accelerated Android video playback engine utilizing ExoPlayer under Android Jetpack and low battery background pipelines.',
    mediaType: 'code',
    mediaUrl: '/media/photos/CHR07404.jpg',
    githubUrl: 'https://github.com/chintan992/x-player',
    techStack: ['Android', 'Kotlin', 'ExoPlayer / Media3', 'Jetpack'],
    highlights: [
      'ExoPlayer / Media3 hardware rendering core',
      'Surface texture buffer optimization',
      'Low battery footprint background processing',
    ],
    architecture: 'Engineered in Kotlin leveraging ExoPlayer/Media3 under Android Jetpack, utilizing surface texture optimization and background audio pipelines.',
    metrics: [
      { label: 'Engine', value: 'ExoPlayer' },
      { label: 'Language', value: 'Kotlin' },
      { label: 'Codec', value: 'Adaptive HW' },
    ],
  },
  {
    id: 'clip-sys-assetize',
    track: 'sys',
    title: 'Assetize',
    subtitle: 'In-Browser Canvas Rasterizer',
    startTime: 70,
    duration: 25,
    color: '#38bdf8',
    badge: 'DEV TOOL',
    description: 'Client-side asset matrix generator producing pixel-perfect mobile and web app icon bundles with zero server compute.',
    mediaType: 'code',
    mediaUrl: '/media/photos/CHR07457.jpg',
    githubUrl: 'https://github.com/chintan992/Assetize',
    techStack: ['TypeScript', 'HTML5 Canvas', 'JSZip'],
    highlights: [
      'Instant client-side canvas rasterization',
      'Batch zip generation in-browser',
      'Zero server dependencies or latency',
    ],
    architecture: 'Web-based asset processing engine utilizing canvas manipulation to export pixel-perfect icon matrices for Android and iOS.',
    metrics: [
      { label: 'Compute', value: '0ms Cloud' },
      { label: 'Export', value: 'Android/iOS' },
      { label: 'Runtime', value: 'Client Canvas' },
    ],
  },
  {
    id: 'clip-sys-cinecull',
    track: 'sys',
    title: 'CineCull',
    subtitle: 'Algorithmic Film Curation',
    startTime: 95,
    duration: 25,
    color: '#38bdf8',
    badge: 'RUNTIME',
    description: 'TypeScript-driven recommendation platform built for zero-friction film exploration with client-side algorithmic preference scoring.',
    mediaType: 'code',
    mediaUrl: '/media/photos/CHR07521.jpg',
    githubUrl: 'https://github.com/chintan992/cinecull',
    techStack: ['TypeScript', 'React', 'Tailwind'],
    highlights: [
      'Rapid client-side filtering matrix',
      'Ultra-lightweight bundle footprint',
      'Zero external tracking or bloat',
    ],
    architecture: 'TypeScript-driven film recommendation platform built for zero-friction exploration with client-side algorithmic preference scoring.',
    metrics: [
      { label: 'Bundle', value: '< 45kb' },
      { label: 'Filtering', value: 'Sub-millisecond' },
      { label: 'State', value: 'Local Store' },
    ],
  },

  // --- OPS: Milestones & Experience ---
  {
    id: 'clip-ops-compugen',
    track: 'ops',
    title: 'Compugen Systems',
    subtitle: 'Integration Technician · Present',
    startTime: 0,
    duration: 45,
    color: '#a78bfa',
    badge: 'ENTERPRISE',
    description: 'Enterprise IT solutions, quality assurance protocols, and automated client systems integration.',
    mediaType: 'ops',
    metrics: [
      { label: 'Role', value: 'Integration' },
      { label: 'Focus', value: 'Systems QA' },
      { label: 'Status', value: 'Current' },
    ],
    highlights: [
      'System deployments across enterprise infrastructure',
      'Quality documentation and validation pipelines',
      'Streamlined staging and deployment verification',
    ],
  },
  {
    id: 'clip-ops-pryatna',
    track: 'ops',
    title: 'Pryatna Charitable Trust',
    subtitle: 'Lead AI/ML Engineer · 2023–2024',
    startTime: 45,
    duration: 45,
    color: '#a78bfa',
    badge: 'LEADERSHIP',
    description: 'Led a seven-engineer team architecting an AI/ML educational analytics platform.',
    mediaType: 'ops',
    metrics: [
      { label: 'Team', value: '7 Engineers' },
      { label: 'Impact', value: '+15% Perf' },
      { label: 'Engagement', value: '+28% Pilot' },
    ],
    highlights: [
      'Directed model training and edge scoring pipelines',
      'Delivered +15% academic outcome improvement',
      'Orchestrated cross-functional technical sprints',
    ],
  },
  {
    id: 'clip-ops-encube',
    track: 'ops',
    title: 'Encube Labs & Conestoga',
    subtitle: 'Analytics & Systems Engineering',
    startTime: 90,
    duration: 30,
    color: '#a78bfa',
    badge: 'CREDENTIALS',
    description: 'Marketing technology pipelines, Conestoga IT Business Analysis, and B.Eng in Information Technology.',
    mediaType: 'ops',
    metrics: [
      { label: 'Degree', value: 'B.Eng IT' },
      { label: 'Grad Cert', value: 'Business Analysis' },
      { label: 'Specialty', value: 'Deep Learning' },
    ],
    highlights: [
      'Power BI operational dashboards & automated flows',
      'Graduate Certificate in IT Business Analysis',
      'Certified Machine Learning & Deep Learning Engineer',
    ],
  },
]
