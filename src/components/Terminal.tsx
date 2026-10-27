import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { terminalCommands } from '@/data/portfolio-data'
import { Terminal as TerminalIcon } from 'lucide-react'

interface TerminalLine {
  type: 'input' | 'output' | 'system'
  content: string
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: '┌── chintan992.dev terminal ────┐' },
    { type: 'system', content: '│ Type "help" for commands      │' },
    { type: 'system', content: '└───────────────────────────────┘' },
    { type: 'system', content: '' },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  async function typeOutput(text: string) {
    setIsTyping(true)
    const outputLines = text.split('\n')

    for (let i = 0; i < outputLines.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      setLines(prev => [...prev, { type: 'output', content: outputLines[i] }])
    }

    setIsTyping(false)
  }

  async function handleCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase()

    setLines(prev => [...prev, { type: 'input', content: `$ ${cmd}` }])
    setHistory(prev => [cmd, ...prev])
    setHistoryIndex(-1)
    setInput('')

    if (trimmed === '') return

    if (trimmed === 'clear') {
      setLines([])
      return
    }

    if (trimmed === 'resume') {
      await typeOutput(terminalCommands.resume)
      if (typeof window !== 'undefined') {
        window.open('/chintan-rathod.pdf', '_blank')
      }
      return
    }

    const output = terminalCommands[trimmed]
    if (output) {
      await typeOutput(output)
    } else {
      await typeOutput(`Command not found: "${trimmed}". Type "help" for available commands.`)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !isTyping) {
      handleCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: [0.22, 0.72, 0.18, 1] }}
      className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden titanium-card font-mono text-xs sm:text-sm"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 sm:py-3 bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center text-slate-400 text-xs font-mono">
          <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>chintan@portfolio:~</span>
        </div>
        <div className="w-8" />
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="h-[260px] sm:h-[380px] overflow-y-auto p-3.5 sm:p-5 space-y-1 font-mono text-xs sm:text-sm scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'whitespace-pre-wrap leading-relaxed',
              line.type === 'input' && 'text-emerald-400 font-semibold',
              line.type === 'output' && 'text-slate-300',
              line.type === 'system' && 'text-sky-300',
            )}
          >
            {line.content || '\u00A0'}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-emerald-400 shrink-0 font-bold">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="flex-1 bg-transparent text-white outline-none caret-emerald-400 placeholder:text-slate-600 text-xs sm:text-sm"
            placeholder={isTyping ? '' : 'Type a command (try "help")...'}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span className={cn(
            'w-1.5 h-4 bg-emerald-400',
            isTyping ? 'opacity-0' : 'animate-pulse',
          )} />
        </div>
      </div>
    </motion.div>
  )
}
