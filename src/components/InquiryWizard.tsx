import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Send, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import type { PortfolioMode } from '@/data/portfolio-data'

interface InquiryWizardProps {
  mode: PortfolioMode
  defaultService?: string
}

const serviceOptions = [
  { id: 'Software development', label: 'Software Development', icon: '💻', desc: 'Web apps, mobile solutions & systems architecture' },
  { id: 'Business analysis & automation', label: 'Systems & Automation', icon: '⚡', desc: 'Process automation, Power BI & intelligent workflows' },
  { id: 'Videography', label: 'Cinematic Videography', icon: '🎬', desc: 'Commercial films, event storytelling & color grading' },
  { id: 'Photography', label: 'Editorial Photography', icon: '📷', desc: 'Portraits, documentary, travel & brand visuals' },
  { id: 'Something else', label: 'Collaborative Project', icon: '✨', desc: 'Bespoke ideas, advisory or cross-discipline work' },
]

const budgetRanges = [
  'Under $2,500',
  '$2,500 – $5,000',
  '$5,000 – $10,000',
  '$10,000+',
  'Flexible / To be discussed',
]

const timelineOptions = [
  'Immediately (< 2 weeks)',
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

      const data = await res.json() as { error?: string; message?: string }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send inquiry.')
      }

      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please reach out to chintanr21@gmail.com directly.',
      )
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.1] -translate-y-1/2 -z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 transition-all duration-500 bg-white -z-0 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
          style={{
            width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
          }}
        />

        {[
          { num: 1, label: 'Scope' },
          { num: 2, label: 'Context' },
          { num: 3, label: 'Connect' },
        ].map((item) => (
          <div key={item.num} className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => {
                if (status !== 'submitting' && status !== 'success') {
                  if (item.num === 1 || (item.num === 2 && selectedService) || (item.num === 3 && name)) {
                    setStep(item.num as 1 | 2 | 3)
                  }
                }
              }}
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 border',
                step >= item.num
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'bg-[#12141a] text-slate-400 border-white/[0.1]',
              )}
            >
              {item.num}
            </button>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 mt-2 font-mono">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div className="titanium-card p-5 sm:p-9 rounded-2xl sm:rounded-3xl">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">Inquiry Transmitted</h3>
              <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed mb-6">
                Thank you, <span className="text-white font-medium">{name}</span>. Your message has reached my primary inbox. I typically respond within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setStatus('idle')
                  setStep(1)
                  setMessage('')
                }}
                className="px-6 py-2.5 rounded-full text-xs font-mono font-medium border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Scope */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="mb-6">
                    <h3 className="text-xl font-bold font-display text-white mb-1">Select Engagement Domain</h3>
                    <p className="text-xs text-slate-400">Choose the primary area of focus for this collaboration.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {serviceOptions.map((opt) => {
                      const isSelected = selectedService === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedService(opt.id)}
                          className={cn(
                            'w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer',
                            isSelected
                              ? 'bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                              : 'bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.05]',
                          )}
                        >
                          <span className="text-2xl p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-white">{opt.label}</div>
                            <div className="text-xs text-slate-400 truncate mt-0.5">{opt.desc}</div>
                          </div>
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                              isSelected
                                ? 'border-white bg-white'
                                : 'border-slate-600',
                            )}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                    >
                      Next: Parameters <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Context / Timeline / Budget */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-display text-white mb-1">Target Timeline & Scale</h3>
                    <p className="text-xs text-slate-400">Help frame the scope and anticipated schedule.</p>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Estimated Investment Scale
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {budgetRanges.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={cn(
                            'p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-mono text-center transition-all cursor-pointer',
                            budget === b
                              ? 'bg-white text-black font-semibold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                              : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-white/[0.2]',
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                      Delivery Window
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {timelineOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          className={cn(
                            'p-2.5 sm:p-3 rounded-xl border text-[11px] sm:text-xs font-mono text-center transition-all cursor-pointer',
                            timeline === t
                              ? 'bg-white text-black font-semibold border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                              : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:border-white/[0.2]',
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
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                    >
                      Next: Contact <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Contact Info & Message */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-display text-white mb-1">Your Details</h3>
                    <p className="text-xs text-slate-400">Where should I send proposal details and next steps?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-base sm:text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@studio.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-base sm:text-sm focus:outline-none focus:border-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      Brief Brief or Project Overview
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me a bit about what you have in mind, specific requirements, or ideas..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-base sm:text-sm focus:outline-none focus:border-white transition-all resize-none"
                    />
                  </div>

                  {/* Summary preview */}
                  <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>
                      Domain: <span className="text-white">{selectedService}</span> · Scale: <span className="text-white">{budget}</span>
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-slate-400" />
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
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="flex items-center gap-2 px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-white hover:bg-slate-200 transition-all shadow-[0_0_25px_rgba(255,255,255,0.25)] disabled:opacity-50 cursor-pointer"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Transmit Inquiry <Send className="w-4 h-4" />
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
