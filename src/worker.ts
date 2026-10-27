import { AwsClient } from 'aws4fetch'

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>
  }
  RESEND_API_KEY?: string
  CONTACT_TO_EMAIL?: string
  CONTACT_FROM_EMAIL?: string
  B2_APPLICATION_KEY_ID?: string
  B2_APPLICATION_KEY?: string
  B2_BUCKET_NAME?: string
  B2_ENDPOINT?: string
  B2_REGION?: string
}

interface Project {
  name: string
  description: string
  repository: string
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
  'letsstream-flutter': {
    name: "Let's Stream Flutter",
    description: 'Flutter-based media discovery app integrating TMDB API.',
    repository: 'https://github.com/chintan992/letsstream-flutter-v2',
  },
  cinecull: {
    name: 'CineCull',
    description: 'A movie curation and discovery tool for finding films.',
    repository: 'https://github.com/chintan992/cinecull',
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
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https://media.chintan992.dev https://images.unsplash.com https://avatars.githubusercontent.com https://github.com; media-src 'self' blob: data: https://media.chintan992.dev; style-src 'self' 'unsafe-inline'; script-src 'self' https://static.cloudflareinsights.com; font-src 'self' data:; connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com",
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
    <meta name="robots" content="noindex, nofollow">
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

function notFoundResponse(message = 'The page you are looking for does not exist or has been moved.'): Response {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>404 — Page Not Found | Chintan Rathod</title>
    <style>
      *{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:24px;color:#f8f7f1;background:#111513;font:16px/1.6 "Segoe UI",sans-serif}.card{width:min(100%,520px);padding:clamp(32px,6vw,48px);border:1px solid #ffffff15;border-radius:12px;background:#161c18;text-align:center}.code{display:inline-block;padding:4px 12px;border-radius:99px;background:#c5df7520;color:#c5df75;font:700 13px/1.4 monospace;margin-bottom:16px}h1{margin:0 0 12px;font:500 clamp(28px,5vw,36px) Georgia,serif;letter-spacing:-.03em}p{margin:0 0 24px;color:#94a3b8;font-size:15px}a{display:inline-flex;align-items:center;padding:10px 24px;border-radius:99px;background:#c5df75;color:#111513;text-decoration:none;font-weight:600;font-size:14px;transition:opacity .2s}a:hover{opacity:.9}
    </style>
  </head>
  <body>
    <main class="card">
      <span class="code">HTTP 404</span>
      <h1>Page Not Found</h1>
      <p>${escapeHtml(message)}</p>
      <a href="/">Return to Homepage</a>
    </main>
  </body>
</html>`

  return new Response(html, {
    status: 404,
    headers: {
      ...responseHeaders,
      'Content-Security-Policy': responseHeaders['Content-Security-Policy'].replace(
        "style-src 'self'",
        "style-src 'self' 'unsafe-inline'",
      ),
      'Content-Type': 'text/html; charset=utf-8',
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

async function handleMedia(request: Request, env: Env, rawKey: string): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: responseHeaders })
  }

  const key = decodeURIComponent(rawKey).replace(/^\/+/, '')
  if (key.includes('..') || key.includes('\0')) {
    return new Response('Invalid path', { status: 400, headers: responseHeaders })
  }

  if (!key) {
    return new Response('File not specified', { status: 400, headers: responseHeaders })
  }

  const bucket = env.B2_BUCKET_NAME || 'chintan992-content'
  const endpoint = env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com'
  const region = env.B2_REGION || 'us-east-005'
  const keyId = env.B2_APPLICATION_KEY_ID
  const appKey = env.B2_APPLICATION_KEY

  if (!keyId || !appKey) {
    console.warn('B2 storage credentials missing in worker environment')
    return new Response('Media storage service unconfigured', { status: 503, headers: responseHeaders })
  }

  const s3Url = `https://${bucket}.${endpoint}/${encodeURI(key)}`

  const aws = new AwsClient({
    accessKeyId: keyId,
    secretAccessKey: appKey,
    service: 's3',
    region,
  })

  const upstreamHeaders = new Headers()
  const rangeHeader = request.headers.get('range')
  if (rangeHeader) {
    upstreamHeaders.set('range', rangeHeader)
  }
  const ifNoneMatch = request.headers.get('if-none-match')
  if (ifNoneMatch) {
    upstreamHeaders.set('if-none-match', ifNoneMatch)
  }
  const ifModifiedSince = request.headers.get('if-modified-since')
  if (ifModifiedSince) {
    upstreamHeaders.set('if-modified-since', ifModifiedSince)
  }

  try {
    const upstream = await aws.fetch(s3Url, {
      method: request.method,
      headers: upstreamHeaders,
      cf: {
        cacheEverything: true,
        cacheTtl: 31536000,
      },
    } as unknown as RequestInit)

    if (upstream.status === 404) {
      return new Response('Asset not found', { status: 404, headers: responseHeaders })
    }

    const outHeaders = new Headers(upstream.headers)
    outHeaders.set('Access-Control-Allow-Origin', '*')
    outHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    outHeaders.set('Accept-Ranges', 'bytes')
    outHeaders.set('X-Content-Type-Options', 'nosniff')

    if (upstream.status === 200 || upstream.status === 206) {
      outHeaders.set('Cache-Control', 'public, max-age=31536000, immutable')
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: outHeaders,
    })
  } catch (error) {
    console.error('Failed to fetch from B2:', error)
    return new Response('Failed to retrieve media asset.', { status: 502, headers: responseHeaders })
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const hostname = url.hostname.toLowerCase()

    // 1. Direct media subdomain: media.chintan992.dev/*
    if (hostname === `media.${BASE_DOMAIN}`) {
      return handleMedia(request, env, url.pathname)
    }

    // 2. Direct media route on current domain: /media/*
    if (url.pathname.startsWith('/media/')) {
      return handleMedia(request, env, url.pathname.slice('/media/'.length))
    }

    if (url.pathname === '/api/inquiry') {
      return withSecurityHeaders(await handleInquiry(request, env))
    }

    if (url.pathname === '/api/github') {
      return withSecurityHeaders(await handleGitHub(request))
    }

    if (hostname === `www.${BASE_DOMAIN}`) {
      const redirectUrl = new URL(request.url)
      redirectUrl.hostname = BASE_DOMAIN
      return Response.redirect(redirectUrl.toString(), 301)
    }

    const isPortfolioHost =
      hostname === BASE_DOMAIN ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.endsWith('.workers.dev')

    const validPortfolioRoutes = new Set([
      '/',
      '/developer',
      '/dev',
      '/engineering',
      '/visual',
      '/photography',
    ])

    if (isPortfolioHost) {
      if (validPortfolioRoutes.has(url.pathname)) {
        const homeRequest = new Request(new URL('/', request.url).toString(), request)
        const assetResponse = await env.ASSETS.fetch(homeRequest)
        return withSecurityHeaders(assetResponse)
      }

      const assetResponse = await env.ASSETS.fetch(request)
      if (assetResponse.status === 404) {
        return notFoundResponse()
      }
      return withSecurityHeaders(assetResponse)
    }

    if (hostname.endsWith(`.${BASE_DOMAIN}`)) {
      const slug = hostname.slice(0, -BASE_DOMAIN.length - 1)
      const project = projects[slug]
      if (project) {
        return projectPlaceholder(project)
      }
      return notFoundResponse('Project preview not found.')
    }

    return notFoundResponse()
  },
}
