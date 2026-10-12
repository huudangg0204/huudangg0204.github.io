import { useState, useEffect } from 'react'
import { playJumpSound, playCoinSound } from '../utils/audio'

export default function SideRunnerTrack({ onCollectCoin }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [collectedMilestones, setCollectedMilestones] = useState({
    w1: true,
    w2: false,
    w3: false,
    w4: false
  })

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight <= 0) return
      const currentScroll = window.scrollY
      const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1)
      setScrollProgress(progress)

      // Milestone trigger detection
      if (progress > 0.25 && !collectedMilestones.w2) {
        setCollectedMilestones(prev => ({ ...prev, w2: true }))
        playCoinSound()
        if (onCollectCoin) onCollectCoin()
      }
      if (progress > 0.55 && !collectedMilestones.w3) {
        setCollectedMilestones(prev => ({ ...prev, w3: true }))
        playCoinSound()
        if (onCollectCoin) onCollectCoin()
      }
      if (progress > 0.88 && !collectedMilestones.w4) {
        setCollectedMilestones(prev => ({ ...prev, w4: true }))
        playCoinSound()
        if (onCollectCoin) onCollectCoin()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [collectedMilestones, onCollectCoin])

  const handleJump = () => {
    if (isJumping) return
    setIsJumping(true)
    playJumpSound()
    setTimeout(() => {
      setIsJumping(false)
    }, 450)
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Calculate runner position along the track (clamped between 8% and 88%)
  const runnerTopPercent = 8 + scrollProgress * 78

  return (
    <aside className="side-runner-dock" aria-label="Game Scroll Adventure Tracker">
      <div className="track-container pixel-card">
        <div className="track-header font-pixel">
          <span>PROGRESS</span>
          <span className="progress-percent">{Math.round(scrollProgress * 100)}%</span>
        </div>

        {/* Vertical Rail / Bean Vine */}
        <div className="track-rail">
          {/* Ground / Vine fill line */}
          <div 
            className="rail-fill"
            style={{ height: `${scrollProgress * 100}%` }}
          />

          {/* Milestone 1: Start */}
          <button 
            className={`milestone-node node-1 ${collectedMilestones.w1 ? 'active' : ''}`}
            onClick={() => scrollToSection('world-1')}
            title="World 1: Origin & Bio"
          >
            <span className="node-icon">🚩</span>
            <span className="node-label font-pixel">W1</span>
          </button>

          {/* Milestone 2: Skills */}
          <button 
            className={`milestone-node node-2 ${collectedMilestones.w2 ? 'active' : ''}`}
            onClick={() => scrollToSection('world-2')}
            title="World 2: Skills & Power-ups"
          >
            <span className="node-icon">🍄</span>
            <span className="node-label font-pixel">W2</span>
          </button>

          {/* Milestone 3: Bosses */}
          <button 
            className={`milestone-node node-3 ${collectedMilestones.w3 ? 'active' : ''}`}
            onClick={() => scrollToSection('world-3')}
            title="World 3: Defeated Boss Projects"
          >
            <span className="node-icon">👾</span>
            <span className="node-label font-pixel">W3</span>
          </button>

          {/* Milestone 4: Castle */}
          <button 
            className={`milestone-node node-4 ${collectedMilestones.w4 ? 'active' : ''}`}
            onClick={() => scrollToSection('world-4')}
            title="World 4: Victory Castle & Hire"
          >
            <span className="node-icon">🏰</span>
            <span className="node-label font-pixel">W4</span>
          </button>

          {/* Moving 8-bit Character Sprite */}
          <div 
            className={`runner-sprite ${isJumping ? 'jumping' : 'running'}`}
            style={{ top: `${runnerTopPercent}%` }}
            onClick={handleJump}
            title="Click me to JUMP!"
          >
            <div className="sprite-avatar">
              <span className="sprite-character">🏃</span>
            </div>
            {isJumping && <span className="jump-effect font-pixel">BOING!</span>}
          </div>
        </div>

        {/* Jump Action Button */}
        <button 
          onClick={handleJump}
          className="jump-btn pixel-btn pixel-btn-primary font-pixel"
          title="Jump over obstacle"
        >
          ▲ JUMP
        </button>
      </div>

      <style>{`
        .side-runner-dock {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 900;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: auto;
        }

        .track-container {
          width: 84px;
          height: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.6rem 0.4rem;
          background: #FAF6EE;
          border: 3px solid #2A2118;
          box-shadow: 4px 4px 0px #2A2118;
        }

        .track-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.5rem;
          color: #2A2118;
          margin-bottom: 0.5rem;
        }

        .progress-percent {
          color: #D97706;
          font-size: 0.62rem;
        }

        .track-rail {
          position: relative;
          flex: 1;
          width: 8px;
          background: #E5DCCB;
          border: 2px solid #2A2118;
          border-radius: 4px;
          margin: 0.25rem 0;
        }

        .rail-fill {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: #10B981;
          border-radius: 2px;
          transition: height 0.1s linear;
        }

        .milestone-node {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 32px;
          height: 32px;
          background: #FFFDF8;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 0;
        }

        .milestone-node:hover {
          transform: translate(-50%, -50%) scale(1.15);
          background: #FEF3C7;
        }

        .milestone-node.active {
          background: #FBBF24;
        }

        .node-1 { top: 6%; }
        .node-2 { top: 34%; }
        .node-3 { top: 64%; }
        .node-4 { top: 94%; }

        .node-icon {
          font-size: 0.85rem;
          line-height: 1;
        }

        .node-label {
          font-size: 0.42rem;
          color: #2A2118;
          margin-top: 1px;
        }

        .runner-sprite {
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: pointer;
          z-index: 10;
          transition: top 0.08s linear;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sprite-avatar {
          width: 34px;
          height: 34px;
          background: #EF4444;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sprite-character {
          font-size: 1.25rem;
          display: inline-block;
          animation: characterRun 0.4s infinite alternate;
        }

        .runner-sprite.jumping {
          animation: jumpAnimation 0.45s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        @keyframes jumpAnimation {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -120%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }

        .jump-effect {
          position: absolute;
          top: -16px;
          font-size: 0.45rem;
          background: #FBBF24;
          border: 1px solid #2A2118;
          padding: 1px 3px;
          white-space: nowrap;
          color: #2A2118;
        }

        .jump-btn {
          width: 100%;
          font-size: 0.5rem;
          padding: 0.4rem 0.2rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 992px) {
          .side-runner-dock {
            display: none;
          }
        }
      `}</style>
    </aside>
  )
}
