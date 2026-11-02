import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { visualServices, type Service } from '@/data/portfolio-data'
import { Camera, Film, Aperture } from 'lucide-react'

const gearList = [
  { category: 'Camera Bodies', items: ['Sony Alpha Full-Frame Series', 'Secondary 4K B-Cam'] },
  { category: 'Optics & Lenses', items: ['24-70mm f/2.8 G-Master', '35mm f/1.4 Prime', '85mm f/1.8 Portrait Prime'] },
  { category: 'Movement & Aerial', items: ['DJI RS3 Pro Gimbal', 'DJI Mini 4 Pro Drone (4K 24fps HDR)'] },
  { category: 'Sound & Illumination', items: ['Rode Wireless PRO (32-bit float)', 'Aputure Bi-Color LED Arrays'] },
]

export default function VisualServices() {
  const [activeTab, setActiveTab] = useState<'services' | 'gear' | 'approach'>('services')

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Category Toggle Tabs */}
      <div className="flex justify-center mb-10">
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md w-full sm:w-auto">
          {[
            { id: 'services', label: 'Production Offerings', icon: Film },
            { id: 'approach', label: 'Cinematic Approach', icon: Aperture },
            { id: 'gear', label: 'Gear Locker', icon: Camera },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-[#f4f5f6] text-[#0c0d0e] font-medium'
                    : 'text-zinc-400 hover:text-white',
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Services */}
        {activeTab === 'services' && (
          <motion.div
            key="services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {visualServices.map((service: Service) => (
              <div
                key={service.title}
                className="bg-[#141618] border border-white/[0.08] hover:border-white/[0.18] transition-colors p-7 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-medium text-white mb-2 font-display">{service.title}</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">{service.description}</p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                  {service.details.map((detail: string) => (
                    <div key={detail} className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 2: Approach & Philosophy */}
        {activeTab === 'approach' && (
          <motion.div
            key="approach"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#141618] border border-white/[0.08] p-8 sm:p-10 rounded-2xl"
          >
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868]" />
                <span>Documentary Rhythm · Intentional Light</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
                Capturing quiet clarity before fast spectacle.
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Every frame should tell a grounded story. Whether framing natural landscapes in the Canadian Rockies or filming brand stories, my methodology blends natural light, deliberate color grading, and patient composition.
              </p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs text-zinc-400 mb-1 font-medium">Pre-Production</div>
                  <div className="text-sm font-medium text-white mb-1">Pacing & Moodboards</div>
                  <div className="text-xs text-zinc-400">Story arcs, location scouting and visual tone mapping.</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs text-zinc-400 mb-1 font-medium">Production</div>
                  <div className="text-sm font-medium text-white mb-1">Cinematic Precision</div>
                  <div className="text-xs text-zinc-400">4K HDR capture, gimbal glide and intentional framing.</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="text-xs text-zinc-400 mb-1 font-medium">Post-Production</div>
                  <div className="text-sm font-medium text-white mb-1">Color & Rhythm</div>
                  <div className="text-xs text-zinc-400">Bespoke film-inspired color grades and sound design.</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Gear Locker */}
        {activeTab === 'gear' && (
          <motion.div
            key="gear"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {gearList.map((g) => (
              <div
                key={g.category}
                className="bg-[#141618] border border-white/[0.08] p-6 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-medium text-zinc-400 tracking-wide">
                    {g.category}
                  </div>
                  <ul className="mt-3.5 space-y-2">
                    {g.items.map((item) => (
                      <li key={item} className="text-xs text-zinc-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e2a868] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
