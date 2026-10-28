import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { visualServices, type Service } from '@/data/portfolio-data'
import { Camera, Film, Aperture, CheckCircle2 } from 'lucide-react'

const gearList = [
  { category: 'Bodies', items: ['Sony Alpha Mirrorless Series', 'Secondary 4K B-Cam'] },
  { category: 'Glass', items: ['24-70mm f/2.8 G-Master', '35mm f/1.4 Prime', '85mm f/1.8 Portrait Prime'] },
  { category: 'Movement', items: ['DJI RS3 Pro Gimbal', 'DJI Mini 4 Pro Drone (4K 24fps HDR)'] },
  { category: 'Audio & Light', items: ['Rode Wireless PRO (32-bit float)', 'Aputure Bi-Color LED Panels'] },
]

export default function VisualServices() {
  const [activeTab, setActiveTab] = useState<'services' | 'gear' | 'approach'>('services')

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Category Toggle Tabs */}
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 p-1 rounded-2xl sm:rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md w-full sm:w-auto">
          {[
            { id: 'services', label: 'Offerings', icon: Film },
            { id: 'approach', label: 'Philosophy', icon: Aperture },
            { id: 'gear', label: 'Gear Locker', icon: Camera },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-2 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-mono font-medium whitespace-nowrap transition-all duration-300 cursor-pointer',
                  isActive
                    ? 'bg-white text-black font-semibold'
                    : 'text-slate-400 hover:text-white',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab 1: Services */}
      {activeTab === 'services' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {visualServices.map((service: Service, index: number) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-colors p-8 rounded-2xl flex flex-col justify-between group"
            >
              <div>
                <div className="text-3xl mb-4 p-3 rounded-xl bg-white/[0.04] w-fit border border-white/[0.08]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">{service.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">{service.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.08]">
                {service.details.map((detail: string) => (
                  <div key={detail} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tab 2: Approach & Philosophy */}
      {activeTab === 'approach' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-white/[0.02] border border-white/[0.08] p-8 sm:p-12 rounded-3xl"
        >
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Documentary Rhythm · Intentional Light
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
              Capturing quiet clarity before fast spectacle.
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every frame should tell a grounded story. Whether framing natural landscapes in the Canadian Rockies or filming brand stories, my methodology blends natural light, deliberate color grading, and patient composition.
            </p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400 mb-1 font-medium">01. PRE-PRODUCTION</div>
                <div className="text-sm font-medium text-white mb-1">Pacing & Moodboards</div>
                <div className="text-xs text-slate-400">Story arcs, location scouting and visual tone mapping.</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400 mb-1 font-medium">02. PRODUCTION</div>
                <div className="text-sm font-medium text-white mb-1">Cinematic Precision</div>
                <div className="text-xs text-slate-400">4K HDR capture, gimbal glide and intentional framing.</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                <div className="text-xs font-mono text-slate-400 mb-1 font-medium">03. POST-GRADES</div>
                <div className="text-sm font-medium text-white mb-1">Color & Rhythm</div>
                <div className="text-xs text-slate-400">Bespoke film-inspired color grades and sound design.</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 3: Gear Locker */}
      {activeTab === 'gear' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {gearList.map((g) => (
            <div
              key={g.category}
              className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                  {g.category}
                </span>
                <ul className="mt-3 space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
