import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { terminalCommands } from '@/data/portfolio-data'
import { Terminal as TerminalIcon, Minus, X, Square } from 'lucide-react'

interface TerminalLine {
  type: 'input' | 'output' | 'system'
  content: string
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: '╭─────────────────────────────────────────────╮' },
    { type: 'system', content: '│  Welcome to chintan992.dev terminal v2.0    │' },
    { type: 'system', content: '│  Type "help" to see available commands.     │' },
    { type: 'system', content: '╰─────────────────────────────────────────────╯' },
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 0.72, 0.18, 1] }}
      className={cn(
        'relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden',
        'border border-[#00ff9d]/20 bg-[#0a0f0d]',
        'shadow-[0_0_60px_rgba(0,255,157,0.08)]',
        'font-mono text-sm',
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0d1210] border-b border-[#00ff9d]/10">
        <div className="flex items-center gap-1.5">
          <button className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center group" aria-label="Close">
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors flex items-center justify-center group" aria-label="Minimize">
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors flex items-center justify-center group" aria-label="Maximize">
            <Square className="w-1.5 h-1.5 text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center text-gray-500 text-xs">
          <TerminalIcon className="w-3.5 h-3.5" />
          <span>chintan@portfolio:~</span>
        </div>
        <div className="w-[52px]" />
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="h-[380px] overflow-y-auto p-4 space-y-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#00ff9d]/20"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={cn(
              'whitespace-pre-wrap leading-relaxed',
              line.type === 'input' && 'text-[#00ff9d]',
              line.type === 'output' && 'text-gray-300',
              line.type === 'system' && 'text-[#3857ef]',
            )}
          >
            {line.content || '\u00A0'}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center gap-2">
          <span className="text-[#00ff9d] shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className={cn(
              'flex-1 bg-transparent text-white outline-none',
              'caret-[#00ff9d] selection:bg-[#00ff9d]/30',
              'placeholder:text-gray-600',
            )}
            placeholder={isTyping ? '' : 'Type a command...'}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
          <span className={cn(
            'w-2 h-5 bg-[#00ff9d]',
            isTyping ? 'opacity-0' : 'animate-pulse',
          )} />
        </div>
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,157,0.015)_2px,rgba(0,255,157,0.015)_4px)] pointer-events-none" />
    </motion.div>
  )
}
