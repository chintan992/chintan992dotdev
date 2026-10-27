interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
  INSTAGRAM_USER_ID?: string
  INSTAGRAM_ACCESS_TOKEN?: string
}

interface Project {
  name: string
  description: string
  repository: string
}

interface InstagramMedia {
  id: string
  caption: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  thumbnail_url?: string
}

const BASE_DOMAIN = 'chintan992.dev'

const projects: Record<string, Project> = {
  letstream: {
    name: "Let's Stream",
    description: 'A modern entertainment discovery platform.',
    repository: 'https://github.com/chintan992/letsstream2',
  },
  xplayer: {
    name: 'X Player',
    description: 'A multi-purpose video player for Android.',
    repository: 'https://github.com/chintan992/x-player',
  },
  forge: {
    name: 'Forge',
    description: 'A cross-platform fitness tracking application.',
    repository: 'https://github.com/chintan992/forge',
  },
  assetize: {
    name: 'Assetize',
    description: 'A tool for generating app assets across platforms.',
    repository: 'https://github.com/chintan992/Assetize',
  },
  linze: {
    name: 'LinZe',
    description: 'An anime discovery and recommendation experience.',
    repository: 'https://github.com/chintan992/LinZe',
  },
}

const allowedServices = new Set([
  'Software development',
  'Business analysis & automation',
  'Photography',
  'Videography',
  'Something else',
])

const responseHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https://images.unsplash.com https://*.cdninstagram.com https://*.fbcdn.net https://avatars.githubusercontent.com https://github.com; media-src 'self' blob: data: https://*.cdninstagram.com https://*.fbcdn.net; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' data:; connect-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(responseHeaders)) {
    headers.set(name, value)
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, {
    status,
    headers: responseHeaders,
  })
}

async function handleInstagram(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Use GET to load the Instagram gallery.' }, 405)
  }

  if (!env.INSTAGRAM_USER_ID || !env.INSTAGRAM_ACCESS_TOKEN) {
    return jsonResponse({ error: 'The Instagram feed is not configured.' }, 503)
  }

  const url = new URL(
    `https://graph.instagram.com/${encodeURIComponent(env.INSTAGRAM_USER_ID)}/media`,
  )
  url.searchParams.set(
    'fields',
    'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
  )
  url.searchParams.set('limit', '8')
  url.searchParams.set('access_token', env.INSTAGRAM_ACCESS_TOKEN)

  let upstream: Response
  try {
    upstream = await fetch(url)
  } catch (error) {
    console.error('Instagram feed request failed:', error)
    return jsonResponse({ error: 'The Instagram feed is temporarily unavailable.' }, 502)
  }

  if (!upstream.ok) {
    console.error('Instagram Graph API returned status:', upstream.status)
    return jsonResponse({ error: 'The Instagram feed is temporarily unavailable.' }, 502)
  }

  let payload: unknown
  try {
    payload = await upstream.json()
  } catch (error) {
    console.error('Instagram Graph API returned invalid JSON:', error)
    return jsonResponse({ error: 'The Instagram feed returned an invalid response.' }, 502)
  }

  if (typeof payload !== 'object' || payload === null || !('data' in payload)) {
    return jsonResponse({ error: 'The Instagram feed response was incomplete.' }, 502)
  }

  const rawMedia = payload.data
  if (!Array.isArray(rawMedia)) {
    return jsonResponse({ error: 'The Instagram feed did not include a media list.' }, 502)
  }

  const media = rawMedia.flatMap((item): InstagramMedia[] => {
    if (typeof item !== 'object' || item === null) return []
    const frame = item as Record<string, unknown>
    if (
      typeof frame.id !== 'string' ||
      typeof frame.media_url !== 'string' ||
      typeof frame.permalink !== 'string' ||
      (frame.media_type !== 'IMAGE' &&
        frame.media_type !== 'VIDEO' &&
        frame.media_type !== 'CAROUSEL_ALBUM')
    ) {
      return []
    }

    return [{
      id: frame.id,
      caption: typeof frame.caption === 'string' ? frame.caption : '',
      media_type: frame.media_type,
      media_url: frame.media_url,
      permalink: frame.permalink,
      ...(typeof frame.thumbnail_url === 'string'
        ? { thumbnail_url: frame.thumbnail_url }
        : {}),
    }]
  })

  return Response.json(
    { media },
    {
      headers: {
        ...responseHeaders,
        'Cache-Control': 'public, max-age=1800',
      },
    },
  )
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

function projectPlaceholder(project: Project): Response {
  const name = escapeHtml(project.name)
  const description = escapeHtml(project.description)
  const repository = escapeHtml(project.repository)
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#183029">
    <title>${name} — coming soon</title>
    <style>
      *{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;color:#f8f7f1;background:#183029;font:16px/1.6 "Segoe UI",sans-serif}.card{width:min(100%,680px);padding:clamp(32px,8vw,76px);border:1px solid #ffffff30;border-radius:8px;background:radial-gradient(circle at 88% 12%,#ed775d 0 4%,transparent 4.5%),linear-gradient(145deg,#21463a,#183029)}.mark{display:grid;width:42px;aspect-ratio:1;place-items:center;border-radius:50%;color:#183029;background:#c5df75;font:28px Georgia,serif}.eyebrow{margin:32px 0 12px;color:#c5df75;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}h1{margin:0;font:500 clamp(48px,10vw,84px)/.95 Georgia,serif;letter-spacing:-.06em}p{max-width:440px;color:#d5ddd4}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}a{display:inline-flex;min-height:44px;align-items:center;padding:0 16px;border:1px solid #ffffff60;border-radius:99px;color:#f8f7f1;text-decoration:none}a:hover{color:#183029;background:#c5df75;border-color:#c5df75}
    </style>
  </head>
  <body>
    <main class="card">
      <span class="mark" aria-hidden="true">c.</span>
      <p class="eyebrow">A project by Chintan Rathod · Preview coming soon</p>
      <h1>${name}</h1>
      <p>${description} This project has its own corner of the internet; its full experience is being prepared.</p>
      <div class="actions">
        <a href="https://chintan992.dev">Visit the portfolio</a>
        <a href="${repository}" rel="noreferrer">View on GitHub ↗</a>
      </div>
    </main>
  </body>
</html>`

  return new Response(html, {
    headers: {
      ...responseHeaders,
      'Content-Security-Policy':
        responseHeaders['Content-Security-Policy'].replace(
          "style-src 'self'",
          "style-src 'self' 'unsafe-inline'",
        ),
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function handleInquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Use POST to send an inquiry.' }, 405)
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return jsonResponse({ error: 'The inquiry must be sent as JSON.' }, 415)
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 12_000) {
    return jsonResponse({ error: 'The inquiry is too large.' }, 413)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'The inquiry could not be read.' }, 400)
  }

  if (typeof payload !== 'object' || payload === null) {
    return jsonResponse({ error: 'Please complete the inquiry form.' }, 400)
  }

  const data = payload as Record<string, unknown>
  if (typeof data.website === 'string' && data.website.trim() !== '') {
    return jsonResponse({ error: 'The inquiry could not be accepted.' }, 400)
  }

  const name = typeof data.name === 'string' ? data.name.trim() : ''
  const email = typeof data.email === 'string' ? data.email.trim() : ''
  const service = typeof data.service === 'string' ? data.service : ''
  const message = typeof data.message === 'string' ? data.message.trim() : ''

  if (name.length < 2 || name.length > 100) {
    return jsonResponse({ error: 'Please enter a name between 2 and 100 characters.' }, 400)
  }
  if (!isEmail(email)) {
    return jsonResponse({ error: 'Please enter a valid email address.' }, 400)
  }
  if (!allowedServices.has(service)) {
    return jsonResponse({ error: 'Please choose one of the listed services.' }, 400)
  }
  if (message.length < 10 || message.length > 3_000) {
    return jsonResponse({ error: 'Please write a message between 10 and 3,000 characters.' }, 400)
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return jsonResponse(
      { error: 'The inquiry service is not configured yet. Please email chintanr21@gmail.com directly.' },
      503,
    )
  }

  if (!isEmail(env.CONTACT_TO_EMAIL) || !isEmail(env.CONTACT_FROM_EMAIL)) {
    console.error('Inquiry email addresses are not valid.')
    return jsonResponse(
      { error: 'The inquiry service is temporarily unavailable. Please email chintanr21@gmail.com directly.' },
      503,
    )
  }

  const emailBody = [
    `New portfolio inquiry from ${name}`,
    '',
    `Reply-to: ${email}`,
    `Service: ${service}`,
    '',
    message,
  ].join('\n')

  let delivery: Response
  try {
    delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Chintan Rathod <${env.CONTACT_FROM_EMAIL}>`,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: 'New portfolio inquiry',
        text: emailBody,
      }),
    })
  } catch (error) {
    console.error('Inquiry delivery request failed:', error)
    return jsonResponse(
      { error: 'The inquiry could not be delivered. Please email chintanr21@gmail.com directly.' },
      502,
    )
  }

  if (!delivery.ok) {
    console.error('Resend rejected an inquiry with status:', delivery.status)
    return jsonResponse(
      { error: 'The inquiry could not be delivered. Please email chintanr21@gmail.com directly.' },
      502,
    )
  }

  return jsonResponse({ message: 'Inquiry sent successfully.' })
}

interface GitHubRepoResponse {
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  fork: boolean
  topics?: string[]
}

async function handleGitHub(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Use GET to load GitHub repos.' }, 405)
  }

  try {
    const upstream = await fetch(
      'https://api.github.com/users/chintan992/repos?sort=updated&per_page=12',
      {
        headers: {
          'User-Agent': 'chintan992-portfolio',
          Accept: 'application/vnd.github.v3+json',
        },
      },
    )

    if (!upstream.ok) {
      console.warn('GitHub API returned status:', upstream.status)
      return jsonResponse({ error: 'GitHub upstream unavailable.' }, upstream.status)
    }

    const data = (await upstream.json()) as GitHubRepoResponse[]
    if (!Array.isArray(data)) {
      return jsonResponse({ error: 'Invalid response from GitHub.' }, 502)
    }

    const repos = data.map((r) => ({
      name: r.name,
      description: r.description || '',
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      updated_at: r.updated_at,
      fork: r.fork,
      topics: r.topics || [],
    }))

    return Response.json(
      { repos },
      {
        headers: {
          ...responseHeaders,
          'Cache-Control': 'public, max-age=3600',
        },
      },
    )
  } catch (error) {
    console.error('Failed to fetch GitHub repos:', error)
    return jsonResponse({ error: 'Failed to fetch GitHub repositories.' }, 502)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const hostname = url.hostname.toLowerCase()

    if (url.pathname === '/api/inquiry') {
      return withSecurityHeaders(await handleInquiry(request, env))
    }

    if (url.pathname === '/api/instagram') {
      return withSecurityHeaders(await handleInstagram(request, env))
    }

    if (url.pathname === '/api/github') {
      return withSecurityHeaders(await handleGitHub(request))
    }

    const isPortfolioHost =
      hostname === BASE_DOMAIN ||
      hostname === `www.${BASE_DOMAIN}` ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.workers.dev')

    if (isPortfolioHost) {
      return withSecurityHeaders(await env.ASSETS.fetch(request))
    }

    if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
      const slug = hostname.slice(0, -BASE_DOMAIN.length - 1)
      const project = projects[slug]
      if (project) {
        return projectPlaceholder(project)
      }
      return new Response('Project preview not found.', {
        status: 404,
        headers: responseHeaders,
      })
    }

    return new Response('Not found.', {
      status: 404,
      headers: responseHeaders,
    })
  },
}
