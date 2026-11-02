import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { projects, filterTags, type FilterTag, type Project } from '@/data/portfolio-data'
import { Star, GitFork, ExternalLink, Cpu } from 'lucide-react'
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

interface GitHubGridProps {
  onSelectProject?: (project: Project) => void
}

export default function GitHubGrid({ onSelectProject }: GitHubGridProps = {}) {
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
    <section className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
            <span
              className={cn(
                'inline-block w-1.5 h-1.5 rounded-full',
                status === 'live' ? 'bg-[#e2a868]' : 'bg-zinc-600',
              )}
            />
            <span>{status === 'live' ? 'Live GitHub Sync' : status === 'loading' ? 'Connecting to GitHub' : 'Project Index'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-tight font-display">
            Systems & Open Source
          </h2>
        </div>
        <a
          href="https://github.com/chintan992"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          <span>github.com/chintan992</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>
      </div>

      {/* Filter tags */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 sm:flex-wrap scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {filterTags.map((tag: FilterTag) => (
          <button
            key={tag}
            onClick={() => setActiveFilter(tag)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer shrink-0',
              activeFilter === tag
                ? 'bg-[#f4f5f6] text-[#0c0d0e] font-medium border-transparent'
                : 'bg-white/[0.03] text-zinc-400 border-white/[0.08] hover:text-white hover:border-white/[0.2]',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Technical Dossiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#141618] border border-white/[0.08] hover:border-white/[0.18] transition-colors group relative flex flex-col justify-between p-6 rounded-xl"
            >
              <div>
                {/* Meta Bar */}
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                  <span className="text-[11px] font-medium text-zinc-400 tracking-wide">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-3">
                    {project.liveStars !== undefined && project.liveStars > 0 && (
                      <span className="flex items-center gap-1 text-zinc-300 text-xs">
                        <Star className="w-3 h-3 fill-zinc-300" />
                        {project.liveStars}
                      </span>
                    )}
                    {project.liveForks !== undefined && project.liveForks > 0 && (
                      <span className="flex items-center gap-1 text-zinc-400 text-xs">
                        <GitFork className="w-3 h-3" />
                        {project.liveForks}
                      </span>
                    )}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-white transition-colors"
                      aria-label={`${project.name} on GitHub`}
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-medium text-white group-hover:text-[#e2a868] transition-colors font-display">
                  {project.name}
                </h3>
                <p className="text-sm text-zinc-300 mt-2.5 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Architectural highlights snippet if available */}
                {project.architecture && (
                  <div className="mt-3.5 pt-3 border-t border-white/[0.06] text-xs text-zinc-400 flex items-start gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-relaxed">{project.architecture}</span>
                  </div>
                )}
              </div>

              {/* Footer specs & actions */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  {(project.liveLanguage ?? project.language) && (
                    <span className="flex items-center gap-1.5 text-zinc-300 text-xs font-mono">
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
                  <button
                    onClick={() => onSelectProject?.(project)}
                    className="text-xs font-medium text-[#e2a868] hover:text-[#f4f5f6] transition-colors cursor-pointer"
                  >
                    Architecture case study
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.03] text-zinc-300 border border-white/[0.06]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors shrink-0"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
