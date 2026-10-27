/* ------------------------------------------------------------------ */
/*  Centralized portfolio content                                      */
/* ------------------------------------------------------------------ */

export type PortfolioMode = 'hub' | 'developer' | 'visual'

/* ---- Projects ---------------------------------------------------- */
export interface Project {
  name: string
  number: string
  category: string
  description: string
  stack: string[]
  github: string
  host: string
  stars?: number
  language?: string
}

export const projects: Project[] = [
  {
    name: "Let's Stream",
    number: '01',
    category: 'Streaming platform',
    description:
      'A modern entertainment platform for discovering movies, series and live content with PWA support.',
    stack: ['React', 'TypeScript', 'Firebase'],
    github: 'https://github.com/chintan992/letsstream2',
    host: 'letstream',
    stars: 23,
    language: 'HTML',
  },
  {
    name: 'X Player',
    number: '02',
    category: 'Android · Media',
    description:
      'A multi-purpose video player built for a smooth, focused playback experience on Android.',
    stack: ['Android', 'Kotlin'],
    github: 'https://github.com/chintan992/x-player',
    host: 'xplayer',
    language: 'Kotlin',
  },
  {
    name: 'Let\'s Stream Flutter',
    number: '03',
    category: 'Mobile · Cross-platform',
    description:
      'Flutter-based media discovery app integrating TMDB API for movies, TV shows, and anime.',
    stack: ['Flutter', 'Dart', 'Firebase'],
    github: 'https://github.com/chintan992/letsstream-flutter-v2',
    host: 'letsstream-flutter',
    stars: 2,
    language: 'Dart',
  },
  {
    name: 'LinZe',
    number: '04',
    category: 'Anime · Discovery',
    description:
      'An anime discovery experience with a modern interface and personalized recommendations.',
    stack: ['Flutter', 'Dart'],
    github: 'https://github.com/chintan992/LinZe',
    host: 'linze',
    stars: 1,
    language: 'Dart',
  },
  {
    name: 'Assetize',
    number: '05',
    category: 'Developer tools',
    description:
      'A practical asset generator for app icons across mobile and web platforms.',
    stack: ['Web', 'Design tools'],
    github: 'https://github.com/chintan992/Assetize',
    host: 'assetize',
  },
  {
    name: 'CineCull',
    number: '06',
    category: 'Entertainment',
    description:
      'A movie curation and discovery tool for finding the perfect film to watch.',
    stack: ['Web', 'TypeScript'],
    github: 'https://github.com/chintan992/cinecull',
    host: 'cinecull',
  },
]

/* ---- Services ---------------------------------------------------- */
export interface Service {
  title: string
  description: string
  details: string[]
  icon: string
}

export const devServices: Service[] = [
  {
    title: 'Product engineering',
    description:
      'Thoughtful web and mobile products, built to feel clear, responsive and ready for real people.',
    details: ['Web applications', 'Mobile development', 'Prototypes & integrations'],
    icon: '⌘',
  },
  {
    title: 'Data & automation',
    description:
      'Turn scattered information and repetitive work into systems people can actually use.',
    details: ['Process analysis', 'Power BI & reporting', 'AI-assisted workflows'],
    icon: '⚡',
  },
  {
    title: 'Systems thinking',
    description:
      'Bring technical delivery and business context together, from the first question to the final handoff.',
    details: ['Requirements & discovery', 'Quality & documentation', 'Cross-functional delivery'],
    icon: '◈',
  },
]

export const visualServices: Service[] = [
  {
    title: 'Videography',
    description:
      'From concept to final cut — cinematic video production for brands, events, and creative projects.',
    details: ['Commercial promos', 'Event coverage', 'Short films & reels', 'Drone footage'],
    icon: '🎬',
  },
  {
    title: 'Photography',
    description:
      'Capturing authentic moments with natural light and a documentary-influenced eye.',
    details: ['Portrait sessions', 'Product & lifestyle', 'Landscape & travel', 'Editorial work'],
    icon: '📷',
  },
  {
    title: 'Content editing',
    description:
      'Post-production that elevates your raw footage and images into polished, publishable work.',
    details: ['Color grading', 'Video editing', 'Photo retouching', 'Social media optimization'],
    icon: '✂️',
  },
]

/* ---- Timeline ---------------------------------------------------- */
export interface TimelineEntry {
  period: string
  label: string
  title: string
  org: string
  description: string
  achievements?: string[]
  type: 'work' | 'education' | 'certification'
}

export const timeline: TimelineEntry[] = [
  {
    period: 'Present',
    label: 'NOW',
    title: 'Integration Technician',
    org: 'Compugen',
    description: 'System deployments, quality assurance, and clear documentation for enterprise IT solutions.',
    achievements: [
      'Managed system deployments across enterprise clients',
      'Developed comprehensive quality documentation',
      'Streamlined integration processes',
    ],
    type: 'work',
  },
  {
    period: '2023 – 2024',
    label: 'DATA + AI',
    title: 'Analyst & Team Lead',
    org: 'Pryatna Charitable Trust',
    description: 'Led a seven-person team building an education-focused AI/ML solution.',
    achievements: [
      '15% academic performance improvement',
      '28% higher user engagement in pilot',
      'Led team of 7 engineers',
    ],
    type: 'work',
  },
  {
    period: '2022 – 2023',
    label: 'ANALYTICS',
    title: 'Marketing Technology Analyst',
    org: 'Encube Labs',
    description: 'Recommendations, reporting and data-informed process work for marketing campaigns.',
    achievements: [
      '8% retention improvement via segmentation',
      'Built Power BI reporting dashboards',
      'Automated data pipelines',
    ],
    type: 'work',
  },
  {
    period: '2023 – 2024',
    label: 'GRAD',
    title: 'Graduate Certificate — IT Business Analysis',
    org: 'Conestoga College',
    description: 'Specialized in bridging technical solutions with business requirements.',
    type: 'education',
  },
  {
    period: '2018 – 2022',
    label: 'B.ENG',
    title: 'Bachelor of Engineering — Information Technology',
    org: 'Gujarat Technological University',
    description: 'Foundation in software engineering, data structures, and systems design.',
    type: 'education',
  },
  {
    period: 'Certified',
    label: 'ML/DL',
    title: 'Certified Engineer — Machine Learning & Deep Learning',
    org: 'Professional Certification',
    description: 'Advanced study in neural networks, computer vision, and natural language processing.',
    type: 'certification',
  },
]

/* ---- Terminal commands ------------------------------------------- */
export const terminalCommands: Record<string, string> = {
  help: `Available commands:
  help       — Show this help message
  skills     — View my technical skills
  projects   — Browse featured projects
  about      — Learn about me
  contact    — Get in touch
  resume     — Download my resume
  social     — Find me online
  clear      — Clear the terminal`,

  skills: `┌─── Technical Skills ───────────────────────┐
│                                             │
│  Languages    TypeScript · Kotlin · Dart    │
│               Python · JavaScript · SQL     │
│                                             │
│  Frontend     React · Flutter · HTML/CSS    │
│               Tailwind · Framer Motion      │
│                                             │
│  Backend      Node.js · Firebase · REST     │
│               Cloudflare Workers            │
│                                             │
│  Mobile       Android (Kotlin) · Flutter    │
│               Cross-platform               │
│                                             │
│  Data & AI    Power BI · ML/DL · Python     │
│               Data Analysis · Automation    │
│                                             │
│  Tools        Git · Docker · Figma          │
│               VS Code · Android Studio      │
│                                             │
└─────────────────────────────────────────────┘`,

  about: `╭──────────────────────────────────────────╮
│  Chintan Rathod                          │
│  Calgary, Alberta, Canada                │
│                                          │
│  Software Engineer · Visual Storyteller  │
│                                          │
│  I turn complex ideas into useful        │
│  products, clear systems, and            │
│  thoughtful details.                     │
│                                          │
│  When I'm not coding, you'll find me     │
│  behind a camera capturing landscapes    │
│  and the quiet moments between them.     │
╰──────────────────────────────────────────╯`,

  contact: `📧  chintanr21@gmail.com
🔗  linkedin.com/in/chintan992
🐙  github.com/chintan992
📷  instagram.com/chintan992

Type 'social' for quick links.`,

  resume: `📄 Resume: chintan-rathod.pdf
   Opening resume download...
   (Visit chintan992.dev for the latest version)`,

  social: `→  github.com/chintan992
→  instagram.com/chintan992
→  instagram.com/chintan992_2  (photo work)
→  linkedin.com/in/chintan992`,

  projects: `Loading projects from GitHub...

  01  Let's Stream         React · TypeScript · Firebase    ★ 23
  02  X Player             Android · Kotlin
  03  Stream Flutter       Flutter · Dart · Firebase        ★ 2
  04  LinZe                Flutter · Dart                   ★ 1
  05  Assetize             Web · Design tools
  06  CineCull             Web · TypeScript

Type a project number for details, or visit github.com/chintan992`,
}

/* ---- Instagram fallback frames ---------------------------------- */
export interface InstagramFrame {
  id: string
  caption: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  thumbnail_url?: string
}

export const fallbackFrames: InstagramFrame[] = [
  {
    id: 'field-notes-01',
    caption: 'Blue hour, just before the city wakes.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1100&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-02',
    caption: 'A quieter kind of distance.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-03',
    caption: 'Last light over the water.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-04',
    caption: 'The long way home.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1100&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-05',
    caption: 'Where the road meets the sky.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-06',
    caption: 'Morning mist settling into the valley.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-07',
    caption: 'Silhouettes at the edge of golden hour.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=900&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
  {
    id: 'field-notes-08',
    caption: 'Reflections in still water.',
    media_type: 'IMAGE',
    media_url:
      'https://images.unsplash.com/photo-1439853949127-fa647821eba0?auto=format&fit=crop&w=900&q=85',
    permalink: 'https://www.instagram.com/chintan992_2/',
  },
]

/* ---- Social links ----------------------------------------------- */
export const socials = [
  { name: 'GitHub', href: 'https://github.com/chintan992', icon: 'github' },
  { name: 'Instagram', href: 'https://www.instagram.com/chintan992/', icon: 'instagram' },
  { name: 'Photo work', href: 'https://www.instagram.com/chintan992_2/', icon: 'camera' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/chintan992/', icon: 'linkedin' },
]

/* ---- Filter tags for GitHub grid -------------------------------- */
export const filterTags = ['All', 'React', 'TypeScript', 'Flutter', 'Kotlin', 'Python', 'Web', 'Dart'] as const
export type FilterTag = (typeof filterTags)[number]

export function isInstagramFrame(value: unknown): value is InstagramFrame {
  if (typeof value !== 'object' || value === null) return false
  const frame = value as Record<string, unknown>
  return (
    typeof frame.id === 'string' &&
    typeof frame.caption === 'string' &&
    (frame.media_type === 'IMAGE' ||
      frame.media_type === 'VIDEO' ||
      frame.media_type === 'CAROUSEL_ALBUM') &&
    typeof frame.media_url === 'string' &&
    typeof frame.permalink === 'string' &&
    (frame.thumbnail_url === undefined || typeof frame.thumbnail_url === 'string')
  )
}
