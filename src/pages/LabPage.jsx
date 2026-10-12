import { useEffect } from 'react'
import TerminalEmulator from '../components/TerminalEmulator'

const COMMANDS_GUIDE = [
  { cmd: 'help', desc: 'Danh sách lệnh' },
  { cmd: 'whoami', desc: 'Tiểu sử & định hướng' },
  { cmd: 'skills', desc: 'Ma trận kỹ năng' },
  { cmd: 'projects', desc: '5 dự án tiêu biểu' },
  { cmd: 'run-pipeline speech', desc: 'Giả lập Speech AI' },
  { cmd: 'run-pipeline rag', desc: 'Giả lập RAG pipeline' },
  { cmd: 'contact', desc: 'Thông tin liên hệ' },
]

export default function LabPage() {
  useEffect(() => {
    document.title = 'AI Lab Terminal | Lê Cao Hữu Đăng'
  }, [])

  return (
    <>
      {/* Header */}
      <section className="section grid-bg" style={{ paddingBottom: 'var(--space-10)' }}>
        <div className="container">
          <div className="section-label">Interactive Lab</div>
          <h1 style={{ marginBottom: 'var(--space-4)' }}>
            <span className="gradient-text">AI Interactive</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>Terminal Lab</span>
          </h1>
          <p className="section-desc">
            Giao diện CLI Terminal giả lập — tra cứu năng lực, giả lập pipeline AI, và đặt câu hỏi về kinh nghiệm của Đăng.
          </p>
        </div>
      </section>

      {/* Terminal */}
      <section style={{ paddingBottom: 'var(--space-20)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'start',
          }}>
            {/* Terminal */}
            <div style={{ gridColumn: 'span 2' }}>
              <TerminalEmulator />
            </div>

            {/* Command Guide - shown as sidebar on wide screens, below on mobile */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-5)',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--emerald)',
                  animation: 'pulse-glow 2s infinite',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.05em',
                }}>
                  COMMAND REFERENCE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {COMMANDS_GUIDE.map(({ cmd, desc }) => (
                  <div key={cmd} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid transparent',
                    transition: 'all var(--transition-fast)',
                    cursor: 'default',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--bg-elevated)'
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'transparent'
                    }}
                  >
                    <code style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--cyan)',
                      background: 'rgba(56, 189, 248, 0.08)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {cmd}
                    </code>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <div style={{ marginBottom: 'var(--space-2)', color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                  Keyboard shortcuts:
                </div>
                <div>↑/↓ — lịch sử lệnh</div>
                <div>Tab — auto-complete</div>
                <div>Enter — thực thi</div>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-10)',
          }}>
            {[
              {
                icon: '🎤',
                title: 'Speech Pipeline',
                desc: 'Chạy lệnh run-pipeline speech để xem giả lập hệ thống dịch giọng nói ngoại tuyến VI↔EN/ZH với latency 1.2s.',
              },
              {
                icon: '🏥',
                title: 'Medical RAG',
                desc: 'Chạy run-pipeline rag để xem luồng xử lý RAG y tế với query reformulation và domain guardrail.',
              },
              {
                icon: '🔍',
                title: 'Skills Explorer',
                desc: 'Dùng skills --category llm|vision|backend để khám phá từng nhóm kỹ năng kỹ thuật chuyên sâu.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card">
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-2)' }}>{title}</h3>
                <p style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
