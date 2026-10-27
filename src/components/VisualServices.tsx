import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { visualServices, type Service } from '@/data/portfolio-data'
import { Camera, Film, Aperture, Sliders, CheckCircle2 } from 'lucide-react'

const gearList = [
  { category: 'Bodies', items: ['Sony Alpha Mirrorless Series', 'Secondary 4K B-Cam'] },
  { category: 'Glass', items: ['24-70mm f/2.8 G-Master', '35mm f/1.4 Prime', '85mm f/1.8 Portrait Prime'] },
  { category: 'Movement', items: ['DJI RS3 Pro Gimbal', 'DJI Mini 4 Pro Drone (4K 60fps HDR)'] },
  { category: 'Audio & Light', items: ['Rode Wireless PRO (32-bit float)', 'Aputure Bi-Color LED Panels'] },
]

export default function VisualServices() {
  const [activeTab, setActiveTab] = useState<'services' | 'gear' | 'approach'>('services')

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Category Toggle Tabs */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
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
                  'flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 cursor-pointer',
                  isActive
                    ? 'bg-[#c8a45c] text-black shadow-[0_0_20px_rgba(200,164,92,0.35)]'
                    : 'text-gray-400 hover:text-white',
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
              className={cn(
                'group relative p-8 rounded-2xl border transition-all duration-500 flex flex-col justify-between',
                'bg-gradient-to-b from-[#181614] to-[#12100e]',
                'border-[#c8a45c]/20 hover:border-[#c8a45c]/50',
                'hover:shadow-[0_10px_35px_rgba(200,164,92,0.1)]',
              )}
            >
              <div>
                <div className="text-3xl mb-4 p-3 rounded-xl bg-black/40 w-fit border border-white/5">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                {service.details.map((detail: string) => (
                  <div key={detail} className="flex items-center gap-2 text-xs text-gray-300 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c8a45c] shrink-0" />
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
          className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#181614] via-[#141210] to-[#0d0c0b] border border-[#c8a45c]/25 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#c8a45c]">
              Documentary Rhythm · Intentional Light
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
              Capturing quiet clarity before fast spectacle.
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Every frame should tell a grounded story. Whether framing natural landscapes in the Canadian Rockies or filming brand stories, my methodology blends natural light, deliberate color grading, and patient composition.
            </p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs font-mono text-[#c8a45c] mb-1">01. PRE-PRODUCTION</div>
                <div className="text-sm font-semibold text-white mb-1">Pacing & Moodboards</div>
                <div className="text-xs text-gray-400">Story arcs, location scouting and visual tone mapping.</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs font-mono text-[#c8a45c] mb-1">02. PRODUCTION</div>
                <div className="text-sm font-semibold text-white mb-1">Cinematic Precision</div>
                <div className="text-xs text-gray-400">4K HDR capture, gimbal glide and intentional framing.</div>
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs font-mono text-[#c8a45c] mb-1">03. POST-GRADES</div>
                <div className="text-sm font-semibold text-white mb-1">Color & Rhythm</div>
                <div className="text-xs text-gray-400">Bespoke film-inspired color grades and sound design.</div>
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
              className="p-6 rounded-2xl bg-[#181614] border border-[#c8a45c]/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-[#c8a45c]" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#c8a45c]">
                    {g.category}
                  </span>
                </div>
                <ul className="space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="text-xs text-gray-300 leading-relaxed flex items-start gap-2">
                      <span className="text-white/30">•</span>
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
