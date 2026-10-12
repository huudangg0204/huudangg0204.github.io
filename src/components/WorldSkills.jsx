import { useState, useEffect } from 'react'
import profileData from '../data/profile.json'
import { playPowerupSound, playCoinSound, playBlipSound } from '../utils/audio'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function WorldSkills({ onAddCoin }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [punchingBlock, setPunchingBlock] = useState(false)
  const [floatingCoin, setFloatingCoin] = useState(false)
  const [blockHinted, setBlockHinted] = useState(false)
  const [sectionRef, isSectionRevealed] = useScrollReveal({ threshold: 0.15 })

  const skillCategories = [
    { key: 'all', label: 'ALL ITEMS', icon: '🎒' },
    { key: 'llm', label: 'LLM & AGENTS', icon: '🍄' },
    { key: 'retrieval', label: 'VECTOR & SEARCH', icon: '⭐' },
    { key: 'vision', label: 'SPEECH & VISION', icon: '🌸' },
    { key: 'data', label: 'DATA SYSTEMS', icon: '⚡' },
    { key: 'backend', label: 'DEVOPS & API', icon: '🛡️' }
  ]

  // Hint bounce when scrolling into view
  useEffect(() => {
    if (isSectionRevealed && !blockHinted) {
      setBlockHinted(true)
    }
  }, [isSectionRevealed, blockHinted])

  const handlePunchBlock = () => {
    if (punchingBlock) return
    setPunchingBlock(true)
    setFloatingCoin(true)
    playPowerupSound()
    if (onAddCoin) onAddCoin()

    setTimeout(() => {
      setPunchingBlock(false)
    }, 250)

    setTimeout(() => {
      setFloatingCoin(false)
    }, 900)
  }

  const handleSkillClick = () => {
    playBlipSound()
  }

  const skillsList = Object.entries(profileData.skills)

  const filteredSkills = activeCategory === 'all'
    ? skillsList
    : skillsList.filter(([key]) => key === activeCategory)

  return (
    <section id="world-2" ref={sectionRef} className="world-section world-2-container">
      {/* World Banner */}
      <div className={`world-banner retro-reveal ${isSectionRevealed ? 'is-revealed' : ''}`}>
        <span className="world-tag font-pixel">★ WORLD 1-2 ★</span>
        <h2 className="world-title font-pixel">OBSTACLE RUN: SKILL POWER-UPS & INVENTORY</h2>
        <p className="world-subtitle">
          Equipped items and specialized abilities to conquer heavy distributed data systems and production real-time AI pipelines.
        </p>
      </div>

      {/* Interactive Mario Question Mark Block */}
      <div className={`mystery-block-wrapper retro-reveal delay-1 ${isSectionRevealed ? 'is-revealed' : ''}`}>
        <div className="mystery-instruction font-pixel">
          CLICK [?] BLOCK FOR BONUS EXP & COIN REWARDS!
        </div>
        <div 
          className={`mystery-block ${punchingBlock ? 'punched' : ''} ${blockHinted && !punchingBlock ? 'hint-bounce' : ''}`}
          onClick={handlePunchBlock}
          title="Click to punch mystery block!"
          role="button"
          tabIndex={0}
        >
          <span className="block-question font-pixel">?</span>
          {floatingCoin && (
            <div className="floating-coin-popup font-pixel anim-pop">
              <span>🪙 +100 EXP!</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Toolbar */}
      <div className={`category-toolbar retro-reveal delay-2 ${isSectionRevealed ? 'is-revealed' : ''}`}>
        {skillCategories.map(cat => (
          <button
            key={cat.key}
            onClick={() => {
              playBlipSound()
              setActiveCategory(cat.key)
            }}
            className={`pixel-btn ${activeCategory === cat.key ? 'pixel-btn-primary' : 'pixel-btn-white'} font-pixel`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Skills Power-Up Cards Grid */}
      <div className="skills-grid">
        {filteredSkills.map(([key, group], idx) => (
          <div 
            key={key} 
            className={`pixel-card skill-card pixel-card-hover retro-reveal delay-${(idx % 4) + 1} ${isSectionRevealed ? 'is-revealed' : ''}`}
          >
            <div className="skill-card-header">
              <div className="skill-item-icon" style={{ borderColor: group.color }}>
                <span className="item-emoji">{group.icon}</span>
              </div>
              <div className="skill-title-block">
                <span className="power-type font-pixel" style={{ color: group.color }}>
                  POWER-UP ITEM
                </span>
                <h3 className="skill-group-name font-pixel">{group.label}</h3>
              </div>
            </div>

            {/* Power Level Bar with Scroll Charging and Shimmer */}
            <div className="power-level-meter">
              <div className="power-level-header">
                <span className="power-label font-pixel">POWER LEVEL</span>
                <span className="power-val font-pixel">{group.powerLevel || 90}%</span>
              </div>
              <div className="power-track">
                <div 
                  className="power-fill" 
                  style={{ 
                    width: isSectionRevealed ? `${group.powerLevel || 90}%` : '0%', 
                    background: group.color,
                    position: 'relative'
                  }}
                >
                  {isSectionRevealed && <div className="power-shimmer-sweep" />}
                </div>
              </div>
            </div>

            {/* Skill Tags / Items in Inventory */}
            <div className="skill-tags-wrapper">
              <div className="inventory-label font-pixel">EQUIPPED SKILLS:</div>
              <div className="tags-container">
                {group.items.map((item, itemIdx) => (
                  <span 
                    key={itemIdx} 
                    className="skill-tag"
                    onClick={handleSkillClick}
                    title={`Proficient in ${item}`}
                  >
                    ✦ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .world-2-container {
          padding-top: 1.5rem;
          margin-bottom: 5rem;
        }

        .mystery-block-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }

        .mystery-instruction {
          font-size: 0.62rem;
          color: #D97706;
          background: #FFFDF8;
          border: 2px solid #2A2118;
          padding: 0.4rem 0.8rem;
          box-shadow: 2px 2px 0px #2A2118;
        }

        .mystery-block {
          width: 60px;
          height: 60px;
          background: #F59E0B;
          border: 4px solid #2A2118;
          box-shadow: 4px 4px 0px #2A2118;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          user-select: none;
          transition: transform 0.1s ease, background 0.1s ease;
        }

        .mystery-block:hover {
          background: #FBBF24;
          transform: translateY(-2px);
        }

        .mystery-block.punched {
          transform: translateY(-16px) scale(1.1);
          background: #B45309;
        }

        .block-question {
          font-size: 1.7rem;
          color: #2A2118;
          font-weight: 900;
        }

        .floating-coin-popup {
          position: absolute;
          top: -42px;
          left: 50%;
          transform: translateX(-50%);
          background: #FBBF24;
          color: #2A2118;
          border: 2px solid #2A2118;
          padding: 4px 8px;
          font-size: 0.58rem;
          white-space: nowrap;
          box-shadow: 2px 2px 0px #2A2118;
          pointer-events: none;
        }

        .anim-pop {
          animation: coinFly 0.8s ease-out forwards;
        }

        @keyframes coinFly {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
          50% { opacity: 1; transform: translate(-50%, -24px) scale(1.15); }
          100% { opacity: 0; transform: translate(-50%, -48px) scale(1); }
        }

        .category-toolbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.6rem;
          margin-bottom: 2.25rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .skill-card {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          background: #FFFDF8;
        }

        .skill-card-header {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }

        .skill-item-icon {
          width: 52px;
          height: 52px;
          background: #FAF6EE;
          border: 3px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-emoji {
          font-size: 1.6rem;
          line-height: 1;
        }

        .skill-title-block {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .power-type {
          font-size: 0.48rem;
        }

        .skill-group-name {
          font-size: 0.76rem;
          color: #2A2118;
          line-height: 1.3;
        }

        .power-level-meter {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          background: #F4EDE0;
          padding: 0.65rem;
          border: 2px solid #2A2118;
        }

        .power-level-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .power-label {
          font-size: 0.48rem;
          color: #786C60;
        }

        .power-val {
          font-size: 0.52rem;
          color: #2A2118;
        }

        .power-track {
          height: 8px;
          background: #FFFDF8;
          border: 2px solid #2A2118;
          overflow: hidden;
        }

        .power-fill {
          height: 100%;
          transition: width 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .skill-tags-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .inventory-label {
          font-size: 0.52rem;
          color: #645648;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .skill-tag {
          font-size: 0.72rem;
          background: #FAF6EE;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          padding: 0.3rem 0.55rem;
          color: #2A2118;
          cursor: pointer;
          transition: all 0.08s ease;
          user-select: none;
        }

        .skill-tag:hover {
          background: #FBBF24;
          transform: translate(-1px, -1px);
        }

        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }
          .category-toolbar {
            gap: 0.4rem;
          }
        }
      `}</style>
    </section>
  )
}
