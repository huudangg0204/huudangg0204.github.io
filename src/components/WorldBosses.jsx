import { useState, useEffect } from 'react'
import projectsData from '../data/projects.json'
import { playBlipSound, playCoinSound } from '../utils/audio'
import { useScrollReveal } from '../hooks/useScrollReveal'

function BossCard({ project, onOpenModal }) {
  const [cardRef, isRevealed] = useScrollReveal({ threshold: 0.25 })
  const [hpPercent, setHpPercent] = useState(100)
  const [isKoStamp, setIsKoStamp] = useState(false)
  const [isShaking, setIsShaking] = useState(false)

  const boss = project.boss || {}

  // Scroll-triggered HP drain and KO slam sequence
  useEffect(() => {
    if (!isRevealed) return

    // 1. Brief pause, then drain HP to 0%
    const drainTimer = setTimeout(() => {
      setHpPercent(0)
    }, 150)

    // 2. Once HP reaches 0, slam down S-Rank Defeated stamp & shake card
    const koTimer = setTimeout(() => {
      setIsKoStamp(true)
      setIsShaking(true)
    }, 750)

    const shakeTimer = setTimeout(() => {
      setIsShaking(false)
    }, 1100)

    return () => {
      clearTimeout(drainTimer)
      clearTimeout(koTimer)
      clearTimeout(shakeTimer)
    }
  }, [isRevealed])

  return (
    <div 
      ref={cardRef} 
      className={`pixel-card boss-card pixel-card-hover retro-reveal ${isRevealed ? 'is-revealed' : ''} ${isShaking ? 'anim-shake' : ''}`}
    >
      {/* Boss Header Banner */}
      <div className="boss-header-bar">
        <div className="boss-skull-tag font-pixel">
          <span>👾</span>
          <span>{boss.name || project.shortTitle}</span>
        </div>
        {isKoStamp ? (
          <div className="boss-rank-badge font-pixel anim-ko-slam">
            🏆 S-RANK DEFEATED
          </div>
        ) : (
          <div className="boss-rank-badge font-pixel" style={{ background: '#FCA5A5' }}>
            ⚔️ ENGAGING BOSS...
          </div>
        )}
      </div>

      {/* Boss HP Bar with Dynamic Scroll Drain */}
      <div className="boss-hp-section">
        <div className="boss-hp-meta">
          <span className="boss-hp-label font-pixel">BOSS HP:</span>
          <span className="boss-hp-val font-pixel">
            {hpPercent === 0 
              ? `0 / ${(boss.maxHp || 10000).toLocaleString()} (K.O.)`
              : `${((hpPercent / 100) * (boss.maxHp || 10000)).toFixed(0)} / ${(boss.maxHp || 10000).toLocaleString()}`
            }
          </span>
        </div>
        <div className="boss-hp-track">
          <div 
            className="boss-hp-fill"
            style={{ 
              width: `${hpPercent}%`,
              transition: isRevealed ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Project Title & Problem Encounter */}
      <div className="boss-story-block">
        <h3 className="project-title font-pixel">
          {project.emoji} {project.title}
        </h3>
        <div className="boss-threat-box">
          <span className="threat-label font-pixel">⚡ CORE BOTTLENECK / THREAT:</span>
          <p className="threat-text">{boss.threat || project.summary}</p>
        </div>
      </div>

      {/* Weapon Used & Victory Loot */}
      <div className="boss-solution-box">
        <div className="solution-line">
          <span className="sol-label font-pixel">⚔️ DEFEAT WEAPON:</span>
          <span className="sol-val">{boss.weapon || project.techStack.slice(0, 3).join(', ')}</span>
        </div>
        <div className="solution-line">
          <span className="sol-label font-pixel">🎁 VICTORY LOOT:</span>
          <span className="sol-val color-gold">{boss.loot || 'Production Codebase'}</span>
        </div>
      </div>

      {/* Metrics Showcase */}
      <div className="boss-metrics-grid">
        {project.metrics.map((m, idx) => (
          <div key={idx} className="metric-chip">
            <span className="metric-icon">{m.icon}</span>
            <div className="metric-details">
              <span className="metric-label font-pixel">{m.label}</span>
              <strong className="metric-value font-mono">{m.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Tech Badges */}
      <div className="boss-tech-tags">
        {project.tags.map((t, idx) => (
          <span 
            key={idx} 
            className="tech-badge font-pixel"
            style={{ borderColor: project.tagColors[t] || '#2A2118' }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Boss Action Buttons */}
      <div className="boss-actions">
        <button 
          onClick={() => onOpenModal(project)}
          className="pixel-btn pixel-btn-primary"
        >
          ⚔️ VIEW STRATEGY & DEMO
        </button>
        <a 
          href={project.github} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="pixel-btn pixel-btn-white"
          onClick={() => playCoinSound()}
        >
          📦 GITHUB
        </a>
      </div>
    </div>
  )
}

export default function WorldBosses({ onSelectProject }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [bannerRef, isBannerRevealed] = useScrollReveal({ threshold: 0.15 })

  const filterTags = [
    { key: 'all', label: 'ALL BOSSES (5)' },
    { key: 'ASR', label: 'SPEECH & AUDIO' },
    { key: 'PyTorch', label: 'VISION & VQA' },
    { key: 'ChromaDB', label: 'RAG & LLM' },
    { key: 'FAISS', label: 'MULTIMODAL' },
    { key: 'Socket.IO', label: 'STREAMING' }
  ]

  const filteredBosses = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase()))

  const handleOpenBossModal = (project) => {
    playBlipSound()
    if (onSelectProject) onSelectProject(project)
  }

  return (
    <section id="world-3" className="world-section world-3-container">
      {/* World Banner */}
      <div ref={bannerRef} className={`world-banner retro-reveal ${isBannerRevealed ? 'is-revealed' : ''}`}>
        <span className="world-tag font-pixel">★ WORLD 1-3 ★</span>
        <h2 className="world-title font-pixel">BOSS BATTLE: DEFEATED PRODUCTION CHALLENGES</h2>
        <p className="world-subtitle">
          Every major project represents a formidable boss (High Latency, LLM Hallucinations, 100GB Datasets) conquered through production-grade engineering.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className={`boss-filter-toolbar retro-reveal delay-1 ${isBannerRevealed ? 'is-revealed' : ''}`}>
        {filterTags.map(f => (
          <button
            key={f.key}
            onClick={() => {
              playBlipSound()
              setActiveFilter(f.key)
            }}
            className={`pixel-btn ${activeFilter === f.key ? 'pixel-btn-red' : 'pixel-btn-white'} font-pixel`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Boss Cards Grid */}
      <div className="boss-cards-grid">
        {filteredBosses.map((project) => (
          <BossCard 
            key={project.id} 
            project={project} 
            onOpenModal={handleOpenBossModal} 
          />
        ))}
      </div>

      <style>{`
        .world-3-container {
          padding-top: 1.5rem;
          margin-bottom: 5rem;
        }

        .boss-filter-toolbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 2.2rem;
        }

        .boss-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
          gap: 1.75rem;
        }

        .boss-card {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          background: #FFFDF9;
          border: 3px solid #2A2118;
          box-shadow: 4px 4px 0px #2A2118;
          position: relative;
        }

        .boss-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          padding-bottom: 0.6rem;
          border-bottom: 2px dashed #2A2118;
        }

        .boss-skull-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: #DC2626;
        }

        .boss-rank-badge {
          font-size: 0.55rem;
          background: #FEF08A;
          border: 2px solid #2A2118;
          padding: 2px 6px;
          color: #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          white-space: nowrap;
        }

        .boss-hp-section {
          background: #F4EDE0;
          border: 2px solid #2A2118;
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .boss-hp-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.55rem;
        }

        .boss-hp-label {
          color: #DC2626;
        }

        .boss-hp-val {
          color: #786C60;
        }

        .boss-hp-track {
          height: 10px;
          background: #2A2118;
          border: 2px solid #2A2118;
          position: relative;
          overflow: hidden;
        }

        .boss-hp-fill {
          height: 100%;
          background: #EF4444;
        }

        .boss-story-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .project-title {
          font-size: 0.85rem;
          color: #2A2118;
          line-height: 1.4;
        }

        .boss-threat-box {
          background: #FFF9EE;
          border-left: 4px solid #DC2626;
          padding: 0.6rem 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .threat-label {
          font-size: 0.52rem;
          color: #DC2626;
        }

        .threat-text {
          font-size: 0.84rem;
          color: #4A3E33;
          line-height: 1.4;
        }

        .boss-solution-box {
          background: #F4EDE0;
          border: 2px solid #2A2118;
          padding: 0.65rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .solution-line {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          font-size: 0.82rem;
        }

        .sol-label {
          font-size: 0.52rem;
          color: #2A2118;
          flex-shrink: 0;
        }

        .sol-val {
          color: #2A2118;
        }

        .boss-metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }

        .metric-chip {
          background: #FFFDF8;
          border: 2px solid #2A2118;
          padding: 0.5rem 0.65rem;
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .metric-icon {
          font-size: 1.2rem;
          line-height: 1;
        }

        .metric-details {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .metric-label {
          font-size: 0.48rem;
          color: #786C60;
        }

        .metric-value {
          font-size: 0.78rem;
          color: #2A2118;
        }

        .boss-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tech-badge {
          font-size: 0.52rem;
          background: #FAF6EE;
          border: 2px solid #2A2118;
          padding: 0.25rem 0.5rem;
          color: #2A2118;
        }

        .boss-actions {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 0.6rem;
          margin-top: 0.25rem;
        }

        @media (max-width: 600px) {
          .boss-cards-grid {
            grid-template-columns: 1fr;
          }
          .boss-metrics-grid {
            grid-template-columns: 1fr;
          }
          .boss-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
