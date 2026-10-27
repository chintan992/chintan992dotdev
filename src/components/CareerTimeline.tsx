import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { timeline, type TimelineEntry } from '@/data/portfolio-data'
import { Briefcase, GraduationCap, Award, ChevronDown } from 'lucide-react'

function TimelineIcon({ type }: { type: TimelineEntry['type'] }) {
  const cls = 'w-4 h-4'
  switch (type) {
    case 'work':
      return <Briefcase className={cls} />
    case 'education':
      return <GraduationCap className={cls} />
    case 'certification':
      return <Award className={cls} />
  }
}

function TimelineCard({ entry, index }: { entry: TimelineEntry; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 0.72, 0.18, 1] }}
      className="relative flex gap-6 group"
    >
      {/* Timeline line + node */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300',
            'bg-[#0a0f0d]',
            entry.type === 'work' &&
              'border-[#00ff9d]/40 text-[#00ff9d] group-hover:border-[#00ff9d] group-hover:shadow-[0_0_15px_rgba(0,255,157,0.3)]',
            entry.type === 'education' &&
              'border-[#3857ef]/40 text-[#3857ef] group-hover:border-[#3857ef] group-hover:shadow-[0_0_15px_rgba(56,87,239,0.3)]',
            entry.type === 'certification' &&
              'border-[#c8a45c]/40 text-[#c8a45c] group-hover:border-[#c8a45c] group-hover:shadow-[0_0_15px_rgba(200,164,92,0.3)]',
          )}
        >
          <TimelineIcon type={entry.type} />
        </div>
        {index < timeline.length - 1 && (
          <div className="w-px flex-1 bg-gradient-to-b from-gray-700/50 to-transparent min-h-[40px]" />
        )}
      </div>

      {/* Card content */}
      <div
        className={cn(
          'flex-1 p-5 rounded-xl border mb-6 transition-all duration-300 cursor-pointer',
          'bg-[#111513]/50 border-gray-800/60',
          'hover:border-gray-700 hover:bg-[#111513]',
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-800/80 text-gray-400">
                {entry.period}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#00ff9d]/70 uppercase">
                {entry.label}
              </span>
            </div>
            <h3 className="text-base font-semibold text-white font-display">{entry.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{entry.org}</p>
          </div>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-500 transition-transform duration-300 shrink-0 mt-1',
              expanded && 'rotate-180 text-white',
            )}
          />
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-gray-800/50 mt-4">
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">{entry.description}</p>
                {entry.achievements && (
                  <ul className="space-y-2">
                    {entry.achievements.map((achievement: string) => (
                      <li key={achievement} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d]/60 mt-1.5 shrink-0" />
                        <span className="text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function CareerTimeline() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 0.72, 0.18, 1] }}
      className="w-full"
    >
      <div className="relative">
        {timeline.map((entry: TimelineEntry, i: number) => (
          <TimelineCard key={entry.label + entry.org} entry={entry} index={i} />
        ))}
      </div>

      {/* Impact metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 p-6 rounded-2xl border border-gray-800/60 bg-[#111513]/50">
        <div className="text-center p-2">
          <p className="text-3xl md:text-4xl font-bold text-[#00ff9d] font-display">15%</p>
          <p className="text-xs text-gray-400 mt-1">Academic performance improvement</p>
        </div>
        <div className="text-center p-2 sm:border-x border-gray-800/60">
          <p className="text-3xl md:text-4xl font-bold text-[#3857ef] font-display">28%</p>
          <p className="text-xs text-gray-400 mt-1">Higher user engagement in pilot</p>
        </div>
        <div className="text-center p-2">
          <p className="text-3xl md:text-4xl font-bold text-[#c8a45c] font-display">8%</p>
          <p className="text-xs text-gray-400 mt-1">Customer retention improvement</p>
        </div>
      </div>
    </motion.section>
  )
}
