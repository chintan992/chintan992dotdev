import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Code2,
  Cpu,
  Film,
  Camera,
  Layers,
} from 'lucide-react'
import type { PortfolioMode } from '@/data/portfolio-data'

interface InquiryWizardProps {
  mode: PortfolioMode
  defaultService?: string
}

const serviceOptions = [
  {
    id: 'Software development',
    label: 'Software Engineering',
    icon: Code2,
    desc: 'Web applications, Kotlin Android runtimes & systems architecture',
  },
  {
    id: 'Business analysis & automation',
    label: 'Systems Analysis & Automation',
    icon: Cpu,
    desc: 'Process automation, data pipelines & operational integrations',
  },
  {
    id: 'Videography',
    label: 'Cinematic Videography',
    icon: Film,
    desc: 'Commercial brand films, documentary narratives & color grading',
  },
  {
    id: 'Photography',
    label: 'Editorial Photography',
    icon: Camera,
    desc: 'Portraits, documentary wilderness & architectural assignments',
  },
  {
    id: 'Something else',
    label: 'Collaborative Assignment',
    icon: Layers,
    desc: 'Cross-discipline project, advisory, or custom inquiry',
  },
]

const budgetRanges = [
  'Under $2,500',
  '$2,500 – $5,000',
  '$5,000 – $10,000',
  '$10,000+',
  'Flexible / To discuss',
]

const timelineOptions = [
  'Within 2 weeks',
  'Within 1–2 months',
  'Flexible timeline',
]

export default function InquiryWizard({ mode, defaultService }: InquiryWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedService, setSelectedService] = useState(
    defaultService || (mode === 'visual' ? 'Videography' : 'Software development'),
  )
  const [budget, setBudget] = useState(budgetRanges[1])
  const [timeline, setTimeline] = useState(timelineOptions[1])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Please provide your name and a valid email.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const fullMessage = [
      `Budget range: ${budget}`,
      `Timeline: ${timeline}`,
      '',
      'Project Details:',
      message.trim() || '(No additional details provided)',
    ].join('\n')

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          service: selectedService,
          message: fullMessage,
        }),
      })

      const data = (await res.json()) as { error?: string; message?: string }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.')
      }

      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please reach out to chintanr21@gmail.com directly.',
      )
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.08] -translate-y-1/2 -z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 transition-all duration-300 bg-[#e2a868] -z-0"
          style={{
            width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
          }}
        />

        {[
          { num: 1, label: 'Service' },
          { num: 2, label: 'Scope' },
          { num: 3, label: 'Contact' },
        ].map((item) => (
          <div key={item.num} className="relative z-10 flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                if (status !== 'submitting' && status !== 'success') {
                  if (item.num === 1 || (item.num === 2 && selectedService) || (item.num === 3 && name)) {
                    setStep(item.num as 1 | 2 | 3)
                  }
                }
              }}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 border cursor-pointer',
                step >= item.num
                  ? 'bg-white text-[#0c0d0e] border-white font-semibold'
                  : 'bg-[#141618] text-zinc-400 border-white/[0.1]',
              )}
              aria-label={`Step ${item.num}: ${item.label}`}
              aria-current={step === item.num ? 'step' : undefined}
            >
              {item.num}
            </button>
            <span className="text-[11px] font-medium text-zinc-400 mt-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div className="bg-[#141618] border border-white/[0.08] p-5 sm:p-8 rounded-xl">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[#e2a868]/10 text-[#e2a868] border border-[#e2a868]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2 font-display">
                Message Dispatched
              </h3>
              <p className="text-zinc-300 max-w-md mx-auto text-sm leading-relaxed mb-6">
                Thank you, <span className="text-white font-medium">{name}</span>. Your inquiry has arrived in my primary inbox. I typically respond within 24–48 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setStep(1)
                  setMessage('')
                }}
                className="px-5 py-2 rounded-full text-xs font-medium border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="mb-5">
                    <h3 className="text-lg font-medium font-display text-white mb-1">
                      Select Practice Area
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Choose the primary domain for this engagement or technical requirement.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-label="Select service">
                    {serviceOptions.map((opt) => {
                      const Icon = opt.icon
                      const isSelected = selectedService === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedService(opt.id)}
                          className={cn(
                            'w-full flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-colors cursor-pointer',
                            isSelected
                              ? 'bg-white/[0.05] border-[#e2a868]/60 text-white'
                              : 'bg-white/[0.02] border-white/[0.06] text-zinc-300 hover:border-white/[0.16] hover:bg-white/[0.03]',
                          )}
                        >
                          <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-300 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white">{opt.label}</div>
                            <div className="text-xs text-zinc-400 truncate mt-0.5">{opt.desc}</div>
                          </div>
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0',
                              isSelected ? 'border-[#e2a868] bg-[#e2a868]' : 'border-zinc-600',
                            )}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0c0d0e]" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-[#0c0d0e] bg-white hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                      <span>Continue to Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Context / Timeline / Budget */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-medium font-display text-white mb-1">
                      Scope & Timeline
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Approximate parameters for project planning and scheduling.
                    </p>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Estimated Budget Range
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Estimated budget">
                      {budgetRanges.map((b) => (
                        <button
                          key={b}
                          type="button"
                          role="radio"
                          aria-checked={budget === b}
                          onClick={() => setBudget(b)}
                          className={cn(
                            'p-2.5 sm:p-3 rounded-lg border text-xs text-center transition-colors cursor-pointer',
                            budget === b
                              ? 'bg-white text-[#0c0d0e] font-medium border-white'
                              : 'bg-white/[0.02] border-white/[0.08] text-zinc-300 hover:border-white/[0.2]',
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-2">
                      Target Schedule
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Target timeline">
                      {timelineOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={timeline === t}
                          onClick={() => setTimeline(t)}
                          className={cn(
                            'p-2.5 sm:p-3 rounded-lg border text-xs text-center transition-colors cursor-pointer',
                            timeline === t
                              ? 'bg-white text-[#0c0d0e] font-medium border-white'
                              : 'bg-white/[0.02] border-white/[0.08] text-zinc-300 hover:border-white/[0.2]',
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-[#0c0d0e] bg-white hover:bg-zinc-200 transition-all cursor-pointer"
                    >
                      <span>Continue to Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Info & Message */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-medium font-display text-white mb-1">
                      Direct Details
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Provide your contact coordinates and project summary.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d0e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#e2a868] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d0e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#e2a868] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Project Specifications or Note
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Outline your systems architecture challenges, timeline goals, or visual brief..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0d0e] border border-white/[0.1] text-white text-sm focus:outline-none focus:border-[#e2a868] transition-colors resize-none"
                    />
                  </div>

                  {/* Summary preview */}
                  <div className="p-3 rounded-lg bg-[#0c0d0e] border border-white/[0.06] text-xs text-zinc-400">
                    Domain: <span className="text-zinc-200">{selectedService}</span> · Scope: <span className="text-zinc-200">{budget}</span> · Schedule: <span className="text-zinc-200">{timeline}</span>
                  </div>

                  {status === 'error' && errorMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={status === 'submitting'}
                      onClick={() => setStep(2)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white cursor-pointer font-medium"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium text-[#0c0d0e] bg-white hover:bg-zinc-200 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
