import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { projects, filterTags, type FilterTag, type Project } from '@/data/portfolio-data'
import { Star, GitFork, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/Icons'

interface GitHubRepo {
  name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  fork: boolean
  topics: string[]
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Dart: '#00b4ab',
  Kotlin: '#A97BFF',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
}

export default function GitHubGrid() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [status, setStatus] = useState<'loading' | 'live' | 'fallback'>('loading')
  const [activeFilter, setActiveFilter] = useState<FilterTag>('All')

  useEffect(() => {
    const controller = new AbortController()

    async function fetchRepos() {
      try {
        const res = await fetch('/api/github', { signal: controller.signal })
        if (!res.ok) throw new Error('GitHub API error')
        const data = (await res.json()) as { repos: GitHubRepo[] }
        setRepos(data.repos ?? [])
        setStatus('live')
      } catch (err) {
        if (controller.signal.aborted) return
        console.info('GitHub API unavailable, using project data', err)
        setStatus('fallback')
      }
    }

    void fetchRepos()
    return () => controller.abort()
  }, [])

  // Merge live repos with static project data
  const mergedProjects: (Project & { liveStars?: number; liveForks?: number; liveLanguage?: string })[] =
    projects.map((p: Project) => {
      const repoSlug = p.github.split('/').pop()?.toLowerCase()
      const liveRepo = repos.find((r: GitHubRepo) => r.name.toLowerCase() === repoSlug)
      return {
        ...p,
        liveStars: liveRepo?.stargazers_count,
        liveForks: liveRepo?.forks_count,
        liveLanguage: liveRepo?.language ?? undefined,
      }
    })

  const filteredProjects =
    activeFilter === 'All'
      ? mergedProjects
      : mergedProjects.filter(
          (p) =>
            p.stack.some((tag: string) =>
              tag.toLowerCase().includes(activeFilter.toLowerCase()),
            ) || p.liveLanguage?.toLowerCase() === activeFilter.toLowerCase(),
        )

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 0.72, 0.18, 1] }}
      className="w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#00ff9d]/70 text-xs font-mono tracking-[0.15em] uppercase mb-2 flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full bg-[#00ff9d]"
              style={{ boxShadow: status === 'live' ? '0 0 8px rgba(0,255,157,0.6)' : 'none' }}
            />
            {status === 'live' ? 'Live from GitHub' : status === 'loading' ? 'Connecting...' : 'Project showcase'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-display">
            Open Source <span className="text-[#00ff9d]">& Projects</span>
          </h2>
        </div>
        <a
          href="https://github.com/chintan992"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-[#00ff9d] transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          View all on GitHub
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Filter tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filterTags.map((tag: FilterTag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer',
              activeFilter === tag
                ? 'bg-[#00ff9d]/15 text-[#00ff9d] border-[#00ff9d]/30 shadow-[0_0_12px_rgba(0,255,157,0.15)]'
                : 'bg-transparent text-gray-500 border-gray-800 hover:text-gray-300 hover:border-gray-600',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.article
              key={project.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={cn(
                'group relative flex flex-col justify-between p-6 rounded-xl',
                'bg-[#0a0f0d] border border-gray-800/80 hover:border-[#00ff9d]/40',
                'transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,255,157,0.06)]',
              )}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-3">
                  <span>{project.number}</span>
                  <div className="flex items-center gap-3">
                    {project.liveStars !== undefined && project.liveStars > 0 && (
                      <span className="flex items-center gap-1 text-amber-400/80">
                        <Star className="w-3 h-3 fill-amber-400/80" />
                        {project.liveStars}
                      </span>
                    )}
                    {project.liveForks !== undefined && project.liveForks > 0 && (
                      <span className="flex items-center gap-1 text-gray-400">
                        <GitFork className="w-3 h-3" />
                        {project.liveForks}
                      </span>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-[#00ff9d] transition-colors"
                      aria-label={`${project.name} on GitHub`}
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="text-xs text-[#00ff9d] font-mono mb-1">{project.category}</div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[#00ff9d] transition-colors font-display">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs">
                {(project.liveLanguage ?? project.language) && (
                  <span className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          languageColors[project.liveLanguage ?? project.language ?? ''] ?? '#6b7280',
                      }}
                    />
                    {project.liveLanguage ?? project.language}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.stack.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800/60 text-gray-400 border border-gray-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Subdomain preview link */}
              <a
                href={`https://${project.host}.chintan992.dev`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-gray-500 hover:text-[#00ff9d] transition-colors"
              >
                {project.host}.chintan992.dev
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
