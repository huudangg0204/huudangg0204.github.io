import { useState, useEffect } from 'react'
import { playCoinSound, playBlipSound, toggleMute, getMuteState } from '../utils/audio'

export default function RetroHUD({ activeWorld, coins, onCoinClick }) {
  const [muted, setMuted] = useState(getMuteState())
  const [score, setScore] = useState(8450)
  const [mobileProgress, setMobileProgress] = useState(0)
  const [stageToast, setStageToast] = useState(null)

  useEffect(() => {
    // Score increases and mobile progress updates as user scrolls
    const handleScroll = () => {
      const scrollY = window.scrollY
      const extraScore = Math.floor(scrollY / 10)
      setScore(8450 + extraScore)

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setMobileProgress(Math.min(Math.max(scrollY / totalHeight, 0), 1))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Trigger brief retro toast when activeWorld changes
  useEffect(() => {
    if (!activeWorld) return
    const toastLabel = activeWorld.includes('CASTLE')
      ? '★ STAGE 1-4: VICTORY CASTLE ★'
      : activeWorld.includes('BOSS')
      ? '★ STAGE 1-3: WARNING: BOSS ARENA ★'
      : activeWorld.includes('SKILLS')
      ? '★ STAGE 1-2: POWER-UP VAULT ★'
      : '★ STAGE 1-1: CHARACTER & LORE ★'

    setStageToast(toastLabel)
    const timer = setTimeout(() => {
      setStageToast(null)
    }, 2400)
    return () => clearTimeout(timer)
  }, [activeWorld])

  const handleSoundToggle = () => {
    const newState = toggleMute()
    setMuted(newState)
    if (!newState) {
      playBlipSound()
    }
  }

  const handleNavClick = (id) => {
    playBlipSound()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCoin = () => {
    playCoinSound()
    if (onCoinClick) onCoinClick()
  }

  return (
    <header className="retro-hud">
      <div className="hud-container">
        {/* Left: Player Identity & Score */}
        <div className="hud-section hud-player">
          <div className="hud-line">
            <span className="hud-label font-pixel">PLAYER</span>
            <span className="hud-value font-pixel">HUU DANG</span>
          </div>
          <div className="hud-line">
            <span className="hud-label font-pixel">SCORE</span>
            <span className="hud-value font-pixel color-gold">{score.toString().padStart(6, '0')}</span>
          </div>
        </div>

        {/* Center: Current World & Coins */}
        <div className="hud-section hud-center">
          <button 
            className="hud-coin-btn font-pixel" 
            onClick={handleCoin}
            title="Click to collect bonus coin & hear 8-bit chime!"
            aria-label="Collect Coin"
          >
            <span className="retro-coin anim-bob">🪙</span>
            <span>x{coins.toString().padStart(2, '0')}</span>
          </button>
          <div className="hud-world-badge font-pixel">
            <span className="hud-world-label">WORLD</span>
            <span className="hud-world-num">{activeWorld || '1-1'}</span>
          </div>
        </div>

        {/* Right: Quick World Teleports & Sound Toggle */}
        <div className="hud-section hud-actions">
          <nav className="hud-nav" aria-label="World Navigation">
            <button onClick={() => handleNavClick('world-1')} className="hud-nav-btn font-pixel" title="World 1: Origin & Bio">
              W1: BIO
            </button>
            <button onClick={() => handleNavClick('world-2')} className="hud-nav-btn font-pixel" title="World 2: Skills & Inventory">
              W2: SKILL
            </button>
            <button onClick={() => handleNavClick('world-3')} className="hud-nav-btn font-pixel" title="World 3: Defeated Bosses">
              W3: BOSS
            </button>
            <button onClick={() => handleNavClick('world-4')} className="hud-nav-btn font-pixel" title="World 4: Victory Castle & Hire">
              W4: CASTLE
            </button>
          </nav>

          <button 
            onClick={handleSoundToggle} 
            className={`hud-sound-btn font-pixel ${muted ? 'muted' : 'active'}`}
            title={muted ? 'Enable 8-bit Synthesizer Audio' : 'Mute Audio'}
            aria-label="Toggle retro audio"
          >
            {muted ? '🔇 MUTE' : '🔊 SFX ON'}
          </button>
        </div>
      </div>

      {/* Stage Transition Banner Toast */}
      {stageToast && (
        <div className="hud-stage-toast font-pixel">
          <span>{stageToast}</span>
        </div>
      )}

      {/* Mobile-Only Mini Scroll Runner Track (<992px) */}
      <div className="mobile-runner-bar">
        <div 
          className="mobile-runner-fill" 
          style={{ width: `${Math.round(mobileProgress * 100)}%` }}
        />
        <div 
          className="mobile-runner-sprite"
          style={{ left: `calc(${Math.min(Math.max(mobileProgress * 100, 2), 98)}% - 10px)` }}
        >
          🏃
        </div>
      </div>

      <style>{`
        .retro-hud {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: #FAF6EE;
          border-bottom: 3px solid #2A2118;
          box-shadow: 0 4px 0 rgba(42, 33, 24, 0.12);
          padding: 0.5rem 1rem 0.65rem;
        }

        .hud-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .hud-section {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .hud-player {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.2rem;
        }

        .hud-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.65rem;
        }

        .hud-label {
          color: #786C60;
        }

        .hud-value {
          color: #2A2118;
        }

        .color-gold {
          color: #D97706;
        }

        .hud-center {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hud-coin-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #FFFDF8;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          padding: 0.35rem 0.65rem;
          cursor: pointer;
          font-size: 0.7rem;
          color: #2A2118;
          transition: transform 0.05s ease;
        }

        .hud-coin-btn:hover {
          background: #FEF3C7;
          transform: translateY(-1px);
        }

        .hud-coin-btn:active {
          transform: translateY(1px);
        }

        .retro-coin {
          font-size: 0.9rem;
          display: inline-block;
        }

        .hud-world-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #E11D48;
          color: #FFF;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          padding: 0.35rem 0.65rem;
          font-size: 0.68rem;
        }

        .hud-world-label {
          opacity: 0.9;
        }

        .hud-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .hud-nav {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .hud-nav-btn {
          background: #FFFDF8;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          color: #2A2118;
          font-size: 0.58rem;
          padding: 0.35rem 0.5rem;
          cursor: pointer;
          transition: transform 0.08s ease, background 0.08s ease;
        }

        .hud-nav-btn:hover {
          background: #FDE68A;
          transform: translate(-1px, -1px);
        }

        .hud-nav-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #2A2118;
        }

        .hud-sound-btn {
          background: #10B981;
          color: #FFF;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          font-size: 0.58rem;
          padding: 0.35rem 0.6rem;
          cursor: pointer;
          transition: transform 0.08s ease;
        }

        .hud-sound-btn.muted {
          background: #E2E8F0;
          color: #64748B;
        }

        .hud-sound-btn:hover {
          transform: translate(-1px, -1px);
        }

        /* Stage Toast Notification */
        .hud-stage-toast {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 6px;
          background: #2A2118;
          color: #FDE68A;
          border: 2px solid #F59E0B;
          box-shadow: 3px 3px 0px #2A2118;
          padding: 0.4rem 1.1rem;
          font-size: 0.6rem;
          pointer-events: none;
          white-space: nowrap;
          z-index: 1000;
          animation: toastSlideDown 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        @keyframes toastSlideDown {
          0% { opacity: 0; transform: translate(-50%, -10px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Mobile Mini Runner Dock */
        .mobile-runner-bar {
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #E5DCCB;
        }

        .mobile-runner-fill {
          height: 100%;
          background: #10B981;
          transition: width 0.08s linear;
        }

        .mobile-runner-sprite {
          position: absolute;
          top: -14px;
          font-size: 0.85rem;
          line-height: 1;
          transition: left 0.08s linear;
          pointer-events: none;
        }

        @media (max-width: 992px) {
          .mobile-runner-bar {
            display: block;
          }
        }

        @media (max-width: 860px) {
          .hud-nav {
            display: none;
          }
          .hud-player .hud-line:last-child {
            display: none;
          }
          .retro-hud {
            padding: 0.4rem 0.6rem 0.55rem;
          }
        }
      `}</style>
    </header>
  )
}
