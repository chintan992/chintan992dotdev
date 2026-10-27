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
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-slate-400 text-xs font-mono tracking-wider uppercase mb-1.5 flex items-center gap-2">
            <span
              className={cn(
                'inline-block w-2 h-2 rounded-full',
                status === 'live' ? 'bg-emerald-400' : 'bg-slate-500',
              )}
            />
            {status === 'live' ? 'Live GitHub Sync' : status === 'loading' ? 'Connecting to GitHub...' : 'Project Index'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight font-display">
            Systems & Open Source
          </h2>
        </div>
        <a
          href="https://github.com/chintan992"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          <span>Full GitHub Profile</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>

      {/* Filter tags */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 sm:flex-wrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {filterTags.map((tag: FilterTag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border cursor-pointer shrink-0',
              activeFilter === tag
                ? 'bg-white text-black font-semibold border-white'
                : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white hover:border-white/[0.2]',
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
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.25) }}
              className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.18] transition-colors group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                  <span className="font-semibold text-slate-300">{project.number}</span>
                  <div className="flex items-center gap-3">
                    {project.liveStars !== undefined && project.liveStars > 0 && (
                      <span className="flex items-center gap-1 text-slate-300 font-mono text-xs">
                        <Star className="w-3 h-3 fill-slate-300" />
                        {project.liveStars}
                      </span>
                    )}
                    {project.liveForks !== undefined && project.liveForks > 0 && (
                      <span className="flex items-center gap-1 text-slate-400 font-mono text-xs">
                        <GitFork className="w-3 h-3" />
                        {project.liveForks}
                      </span>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                      aria-label={`${project.name} on GitHub`}
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                  {project.category}
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-slate-200 transition-colors font-display">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {project.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  {(project.liveLanguage ?? project.language) && (
                    <span className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            languageColors[project.liveLanguage ?? project.language ?? ''] ?? '#94a3b8',
                        }}
                      />
                      {project.liveLanguage ?? project.language}
                    </span>
                  )}
                  {project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.stack.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.08]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
