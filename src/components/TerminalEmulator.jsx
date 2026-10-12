import { useState, useRef, useEffect, useCallback } from 'react'
import terminalData from '../data/terminalCommands.json'
import profile from '../data/profile.json'

const PROMPT = 'huudang@ai-lab:~$'

function TerminalLine({ type, content }) {
  const styles = {
    prompt: { color: 'var(--emerald)', fontWeight: 600 },
    command: { color: 'var(--cyan)' },
    output: { color: 'var(--text-secondary)' },
    success: { color: 'var(--emerald)' },
    error: { color: 'var(--rose)' },
    system: { color: 'var(--text-muted)', fontStyle: 'italic' },
  }

  if (type === 'input') {
    return (
      <div style={{ display: 'flex', gap: 'var(--space-2)', lineHeight: 1.8 }}>
        <span style={styles.prompt}>{PROMPT}</span>
        <span style={styles.command}>{content}</span>
      </div>
    )
  }

  return (
    <div style={{ lineHeight: 1.8, ...(styles[type] || styles.output), whiteSpace: 'pre' }}>
      {content}
    </div>
  )
}

function PipelineAnimation({ pipelineKey, onDone }) {
  const [visibleSteps, setVisibleSteps] = useState([])
  const pipeline = terminalData.pipelines[pipelineKey]

  useEffect(() => {
    if (!pipeline) return
    let timeout = 0
    pipeline.steps.forEach((step, i) => {
      timeout += step.delay
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, step])
        if (i === pipeline.steps.length - 1) {
          setTimeout(onDone, 400)
        }
      }, timeout)
    })
  }, [pipelineKey])

  if (!pipeline) return null

  return (
    <div style={{ padding: 'var(--space-2) 0' }}>
      <div style={{ color: 'var(--violet)', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
        {pipeline.title}
      </div>
      {visibleSteps.map((step, i) => (
        <div key={i} style={{
          display: 'flex',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-1)',
          animation: 'fadeInUp 0.3s ease both',
          alignItems: 'flex-start',
        }}>
          <span style={{ color: 'var(--emerald)', flexShrink: 0, fontWeight: 600 }}>
            [{step.status}]
          </span>
          <span style={{ color: 'var(--cyan)', flexShrink: 0 }}>
            {step.node}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8em' }}>
            — {step.detail}
          </span>
        </div>
      ))}
      {visibleSteps.length < pipeline.steps.length && (
        <div style={{ color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
          <span style={{ animation: 'typing-dots 1.2s infinite' }}>●</span>
          <span style={{ animation: 'typing-dots 1.2s 0.2s infinite' }}>●</span>
          <span style={{ animation: 'typing-dots 1.2s 0.4s infinite' }}>●</span>
        </div>
      )}
    </div>
  )
}

export default function TerminalEmulator() {
  const [history, setHistory] = useState([
    { type: 'system', content: `Welcome to the AI Lab Terminal — type 'help' to get started` },
    { type: 'system', content: `Powered by Lê Cao Hữu Đăng's portfolio system v1.0.0` },
    { type: 'output', content: '' },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [runningPipeline, setRunningPipeline] = useState(null)
  const [isLocked, setIsLocked] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, runningPipeline])

  const addLines = useCallback((lines) => {
    const entries = lines.map(l => {
      if (typeof l === 'string') {
        return { type: 'output', content: l }
      }
      return l
    })
    setHistory(prev => [...prev, ...entries, { type: 'output', content: '' }])
  }, [])

  const executeCommand = useCallback((cmd) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    setCmdHistory(prev => [trimmed, ...prev])
    setHistoryIdx(-1)
    setHistory(prev => [...prev, { type: 'input', content: trimmed }])

    if (trimmed === 'clear') {
      setHistory([])
      return
    }

    // Handle run-pipeline
    if (trimmed.startsWith('run-pipeline')) {
      const parts = trimmed.split(' ')
      const pipelineKey = parts[1]
      if (pipelineKey === 'speech' || pipelineKey === 'rag') {
        setIsLocked(true)
        setRunningPipeline(pipelineKey)
        return
      } else {
        addLines([
          { type: 'error', content: `Pipeline '${pipelineKey}' không tồn tại.` },
          { type: 'output', content: "Thử: run-pipeline speech | run-pipeline rag" },
        ])
        return
      }
    }

    // Handle skills --category
    if (trimmed.startsWith('skills --category')) {
      const key = trimmed.replace('skills --category ', '').trim()
      const found = terminalData.commands[`skills --category ${key}`]
      if (found) {
        addLines(found.output)
      } else {
        addLines([
          { type: 'error', content: `Danh mục '${key}' không tồn tại.` },
          { type: 'output', content: "Danh mục hợp lệ: llm | vision | backend" },
        ])
      }
      return
    }

    // Handle known commands
    const cmdData = terminalData.commands[trimmed]
    if (cmdData) {
      addLines(cmdData.output)
    } else {
      addLines([
        { type: 'error', content: `Command not found: ${trimmed}` },
        { type: 'output', content: "Gõ 'help' để xem danh sách lệnh." },
      ])
    }
  }, [addLines])

  const handlePipelineDone = useCallback((pipelineKey) => {
    setRunningPipeline(null)
    setIsLocked(false)
    setHistory(prev => [...prev, { type: 'output', content: '' }])
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = (e) => {
    if (isLocked) return
    if (e.key === 'Enter') {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIdx = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(newIdx)
      setInput(cmdHistory[newIdx] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newIdx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(newIdx)
      setInput(newIdx === -1 ? '' : cmdHistory[newIdx] || '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = Object.keys(terminalData.commands)
      const match = cmds.find(c => c.startsWith(input))
      if (match) setInput(match)
    }
  }

  const handleChip = (chip) => {
    if (isLocked) return
    if (chip.action === 'downloadCV') {
      setHistory(prev => [...prev,
        { type: 'input', content: chip.label },
        { type: 'output', content: '' },
      ])
      addLines(terminalData.commands['contact'].output)
      // Trigger download
      const a = document.createElement('a')
      a.href = profile.cvPath
      a.download = 'LeCaoHuuDang_CV.pdf'
      a.click()
      return
    }
    const cmdToRun = chip.command
    if (chip.command.startsWith('run-pipeline')) {
      setHistory(prev => [...prev, { type: 'input', content: chip.label }])
      executeCommand(chip.command)
    } else {
      setHistory(prev => [...prev, { type: 'input', content: chip.label }])
      const cmdData = terminalData.commands[cmdToRun]
      if (cmdData) {
        const allLines = [...cmdData.output, ...(chip.followUp || [])]
        addLines(allLines)
      }
    }
  }

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.82rem',
      boxShadow: '0 0 60px rgba(56, 189, 248, 0.06), 0 24px 80px rgba(0,0,0,0.4)',
    }}>
      {/* Title Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-5)',
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
        <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', display: 'block' }} />
        <span style={{ flex: 1, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          AI Lab Terminal — huudang@ai-lab
        </span>
      </div>

      {/* Output Area */}
      <div
        id="terminal-output"
        style={{
          height: '400px',
          overflowY: 'auto',
          padding: 'var(--space-5)',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {history.map((line, i) => (
          <TerminalLine key={i} type={line.type} content={line.content} />
        ))}
        {runningPipeline && (
          <PipelineAnimation
            key={runningPipeline + Date.now()}
            pipelineKey={runningPipeline}
            onDone={() => handlePipelineDone(runningPipeline)}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-5)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
      }}>
        <span style={{ color: 'var(--emerald)', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLocked}
          placeholder={isLocked ? 'Đang chạy pipeline...' : 'Nhập lệnh... (Tab để auto-complete)'}
          aria-label="Terminal input"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            caretColor: 'var(--cyan)',
          }}
        />
        {!isLocked && input && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>↵ Enter</span>
        )}
      </div>

      {/* Quick Chips */}
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(5, 10, 24, 0.5)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '100%', marginBottom: 'var(--space-1)' }}>
          💡 Quick Ask:
        </span>
        {terminalData.quickChips.map((chip, i) => (
          <button
            key={i}
            id={`quick-chip-${i}`}
            onClick={() => handleChip(chip)}
            disabled={isLocked}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: '999px',
              color: isLocked ? 'var(--text-muted)' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              padding: 'var(--space-1) var(--space-3)',
              cursor: isLocked ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-mono)',
              transition: 'all var(--transition-fast)',
              opacity: isLocked ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!isLocked) {
                e.currentTarget.style.borderColor = 'var(--cyan)'
                e.currentTarget.style.color = 'var(--cyan)'
                e.currentTarget.style.background = 'var(--cyan-glow)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color = isLocked ? 'var(--text-muted)' : 'var(--text-secondary)'
              e.currentTarget.style.background = 'var(--bg-elevated)'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  )
}
