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

  const isDev = mode === 'developer'
  const accentColor = isDev ? '#00ff9d' : '#c8a45c'

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
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/10 -translate-y-1/2 -z-0" />
        <div
          className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 transition-all duration-500 -z-0"
          style={{
            width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
            backgroundColor: accentColor,
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
                  ? isDev
                    ? 'bg-[#00ff9d] text-black border-[#00ff9d] shadow-[0_0_15px_rgba(0,255,157,0.4)]'
                    : 'bg-[#c8a45c] text-black border-[#c8a45c] shadow-[0_0_15px_rgba(200,164,92,0.4)]'
                  : 'bg-[#151515] text-gray-400 border-white/10',
              )}
            >
              {item.num}
            </button>
            <span className="text-[11px] uppercase tracking-wider text-gray-400 mt-2 font-mono">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Form Container */}
      <div
        className={cn(
          'p-6 sm:p-8 rounded-2xl backdrop-blur-xl border transition-all duration-500',
          isDev
            ? 'bg-[#0a0f0d]/90 border-[#00ff9d]/20 shadow-[0_0_50px_rgba(0,255,157,0.06)]'
            : 'bg-[#181614]/90 border-[#c8a45c]/20 shadow-[0_0_50px_rgba(200,164,92,0.06)]',
        )}
      >
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center flex flex-col items-center"
            >
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center mb-6',
                  isDev ? 'bg-[#00ff9d]/20 text-[#00ff9d]' : 'bg-[#c8a45c]/20 text-[#c8a45c]',
                )}
              >
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">Inquiry Transmitted</h3>
              <p className="text-gray-300 max-w-md mx-auto text-sm leading-relaxed mb-6">
                Thank you, <span className="text-white font-medium">{name}</span>. Your message has reached my primary inbox. I typically respond within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setStatus('idle')
                  setStep(1)
                  setMessage('')
                }}
                className={cn(
                  'px-6 py-2.5 rounded-full text-xs font-mono font-medium border transition-colors',
                  isDev
                    ? 'border-[#00ff9d]/40 text-[#00ff9d] hover:bg-[#00ff9d]/10'
                    : 'border-[#c8a45c]/40 text-[#c8a45c] hover:bg-[#c8a45c]/10',
                )}
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
                    <h3 className="text-lg font-semibold text-white mb-1">Select Engagement Domain</h3>
                    <p className="text-xs text-gray-400">Choose the primary area of focus for this collaboration.</p>
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
                            'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300',
                            isSelected
                              ? isDev
                                ? 'bg-[#00ff9d]/10 border-[#00ff9d] text-white shadow-[0_0_20px_rgba(0,255,157,0.15)]'
                                : 'bg-[#c8a45c]/10 border-[#c8a45c] text-white shadow-[0_0_20px_rgba(200,164,92,0.15)]'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/[0.07]',
                          )}
                        >
                          <span className="text-2xl p-2 rounded-lg bg-black/40">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-white">{opt.label}</div>
                            <div className="text-xs text-gray-400 truncate">{opt.desc}</div>
                          </div>
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                              isSelected
                                ? isDev
                                  ? 'border-[#00ff9d] bg-[#00ff9d]'
                                  : 'border-[#c8a45c] bg-[#c8a45c]'
                                : 'border-gray-500',
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
                      className={cn(
                        'flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black transition-all duration-300',
                        isDev
                          ? 'bg-[#00ff9d] hover:bg-[#33ffb0] shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                          : 'bg-[#c8a45c] hover:bg-[#dfba70] shadow-[0_0_20px_rgba(200,164,92,0.3)]',
                      )}
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
                    <h3 className="text-lg font-semibold text-white mb-1">Target Timeline & Scale</h3>
                    <p className="text-xs text-gray-400">Help frame the scope and anticipated schedule.</p>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                      Estimated Investment Scale
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {budgetRanges.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={cn(
                            'p-2.5 rounded-lg border text-xs font-mono text-center transition-all',
                            budget === b
                              ? isDev
                                ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d]'
                                : 'bg-[#c8a45c]/15 border-[#c8a45c] text-[#c8a45c]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white',
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                      Delivery Window
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {timelineOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeline(t)}
                          className={cn(
                            'p-2.5 rounded-lg border text-xs font-mono text-center transition-all',
                            timeline === t
                              ? isDev
                                ? 'bg-[#00ff9d]/15 border-[#00ff9d] text-[#00ff9d]'
                                : 'bg-[#c8a45c]/15 border-[#c8a45c] text-[#c8a45c]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white',
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
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className={cn(
                        'flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black transition-all duration-300',
                        isDev
                          ? 'bg-[#00ff9d] hover:bg-[#33ffb0] shadow-[0_0_20px_rgba(0,255,157,0.3)]'
                          : 'bg-[#c8a45c] hover:bg-[#dfba70] shadow-[0_0_20px_rgba(200,164,92,0.3)]',
                      )}
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
                    <h3 className="text-lg font-semibold text-white mb-1">Your Details</h3>
                    <p className="text-xs text-gray-400">Where should I send proposal details and next steps?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none transition-all',
                          isDev ? 'focus:border-[#00ff9d]' : 'focus:border-[#c8a45c]',
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@studio.com"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none transition-all',
                          isDev ? 'focus:border-[#00ff9d]' : 'focus:border-[#c8a45c]',
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1">
                      Brief Brief or Project Overview
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me a bit about what you have in mind, specific requirements, or ideas..."
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none transition-all resize-none',
                        isDev ? 'focus:border-[#00ff9d]' : 'focus:border-[#c8a45c]',
                      )}
                    />
                  </div>

                  {/* Summary preview */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-gray-400 flex items-center justify-between">
                    <span>
                      Service: <span className="text-white">{selectedService}</span> · Budget: <span className="text-white">{budget}</span>
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-gray-400" />
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
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-mono"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className={cn(
                        'flex items-center gap-2 px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black transition-all duration-300 disabled:opacity-50 cursor-pointer',
                        isDev
                          ? 'bg-[#00ff9d] hover:bg-[#33ffb0] shadow-[0_0_25px_rgba(0,255,157,0.35)]'
                          : 'bg-[#c8a45c] hover:bg-[#dfba70] shadow-[0_0_25px_rgba(200,164,92,0.35)]',
                      )}
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Inquiry <Send className="w-4 h-4" />
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
