import { useState, useEffect } from 'react'
import profileData from '../data/profile.json'
import { playVictorySound, playCoinSound } from '../utils/audio'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function WorldCastle({ onAddCoin }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)
  const [flagHoisted, setFlagHoisted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [sectionRef, isSectionRevealed] = useScrollReveal({ threshold: 0.25 })

  // Auto-hoist flag & trigger celebration confetti when scrolled into view
  useEffect(() => {
    if (isSectionRevealed && !flagHoisted) {
      setFlagHoisted(true)
      setShowConfetti(true)
      playVictorySound()
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [isSectionRevealed, flagHoisted])

  const handleManualHoist = () => {
    setFlagHoisted(true)
    setShowConfetti(true)
    playVictorySound()
    if (onAddCoin) onAddCoin()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSent(true)
    playVictorySound()
    if (onAddCoin) onAddCoin()

    const subject = encodeURIComponent(`[Quest Collaboration] Opportunity from: ${formData.name}`)
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)
    window.open(`mailto:${profileData.email}?subject=${subject}&body=${body}`, '_blank')
  }

  // Generate 18 colorful pixel confetti pieces
  const confettiColors = ['#F59E0B', '#E11D48', '#10B981', '#0284C7', '#8B5CF6', '#FBBF24']

  return (
    <section id="world-4" ref={sectionRef} className="world-section world-4-container">
      {/* World Banner */}
      <div className={`world-banner retro-reveal ${isSectionRevealed ? 'is-revealed' : ''}`}>
        <span className="world-tag font-pixel">★ WORLD 1-4: FINAL STAGE ★</span>
        <h2 className="world-title font-pixel">CASTLE VICTORY: STAGE CLEAR & COLLABORATE</h2>
        <p className="world-subtitle">
          Quest complete! The character has safely reached the castle and warmly invites recruiters and partners to connect.
        </p>
      </div>

      {/* Castle & Flagpole Visual Stage */}
      <div className={`castle-stage-wrapper pixel-card retro-reveal delay-1 ${isSectionRevealed ? 'is-revealed' : ''}`}>
        {/* Pixel Confetti Burst Particles */}
        {showConfetti && (
          <div className="confetti-container" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="confetti-particle"
                style={{
                  left: `${5 + Math.random() * 90}%`,
                  top: `${Math.random() * 20}%`,
                  background: confettiColors[i % confettiColors.length],
                  animationDelay: `${Math.random() * 0.6}s`,
                  animationDuration: `${1.2 + Math.random() * 0.8}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="flagpole-zone" onClick={handleManualHoist} title="Click flagpole to hoist victory flag!" role="button" tabIndex={0}>
          <div className="flagpole-pole">
            <div className={`victory-flag font-pixel ${flagHoisted ? 'hoisted' : ''}`}>
              <span>🚩</span>
              <span className="flag-text">UIT 2025</span>
            </div>
          </div>
          <div className="flagpole-base"></div>
        </div>

        {/* Castle Gate & Hero */}
        <div className="castle-structure">
          <div className="castle-parapet">
            <div className="parapet-brick"></div>
            <div className="parapet-brick"></div>
            <div className="parapet-brick"></div>
          </div>
          <div className="castle-main">
            <div className="castle-gate">
              <div className="hero-waving anim-bob">
                <span className="hero-avatar">🧑‍💻</span>
                <span className="waving-hand">👋</span>
              </div>
            </div>
          </div>
          <div className="castle-speech-bubble font-pixel">
            STAGE CLEAR! LET'S BUILD SOMETHING GREAT!
          </div>
        </div>
      </div>

      {/* Contact & Recruit Grid */}
      <div className="castle-contact-grid">
        {/* Left: Contact Form */}
        <div className={`pixel-card contact-form-card retro-reveal-left delay-2 ${isSectionRevealed ? 'is-revealed' : ''}`}>
          <div className="form-header">
            <span className="header-icon">📬</span>
            <div>
              <h3 className="form-title font-pixel">SEND COLLABORATION INVITATION</h3>
              <p className="form-subtitle">Fill out the quick form or launch direct email client to Huu Dang.</p>
            </div>
          </div>

          {formSent ? (
            <div className="sent-success-box font-pixel">
              <span>🎉 MESSAGE READY TO DISPATCH!</span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', marginTop: '6px' }}>
                Thank you! Your email client has been opened to finalize email to <strong>{profileData.email}</strong>.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="pixel-btn pixel-btn-primary"
                style={{ marginTop: '10px' }}
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label className="form-label font-pixel">YOUR NAME / COMPANY:</label>
                <input
                  type="text"
                  required
                  placeholder=""
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pixel-input font-body"
                />
              </div>

              <div className="form-group">
                <label className="form-label font-pixel">CONTACT EMAIL:</label>
                <input
                  type="email"
                  required
                  placeholder="email@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pixel-input font-body"
                />
              </div>

              <div className="form-group">
                <label className="form-label font-pixel">MESSAGE / OPPORTUNITY:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details regarding AI/Data Science engineering roles or project collaborations..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="pixel-input font-body"
                />
              </div>

              <button type="submit" className="pixel-btn pixel-btn-primary font-pixel anim-pulse">
                🚀 LAUNCH DIRECT EMAIL NOW
              </button>
            </form>
          )}
        </div>

        {/* Right: Direct Channels & CV Download */}
        <div className="castle-info-column">
          {/* Status Box */}
          <div className={`pixel-card status-card retro-reveal-right delay-2 ${isSectionRevealed ? 'is-revealed' : ''}`}>
            <div className="status-badge font-pixel">
              <span className="status-dot-large"></span> CURRENT STATUS
            </div>
            <h4 className="status-title font-pixel">{profileData.status}</h4>
            <p className="status-desc">
              Prepared to join teams building AI Systems, NLP Research, LLM Applications, or Data Science with high ownership and technical rigor.
            </p>
          </div>

          {/* Download Official CV */}
          <div className={`pixel-card cv-download-card retro-reveal-right delay-3 ${isSectionRevealed ? 'is-revealed' : ''}`}>
            <div className="cv-icon">📄</div>
            <div className="cv-details">
              <h4 className="cv-title font-pixel">OFFICIAL CURRICULUM VITAE</h4>
              <p className="cv-desc"></p>
              <a
                href={profileData.cvPath}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn pixel-btn-green font-pixel"
                onClick={() => playCoinSound()}
              >
                📥 DOWNLOAD CV (PDF)
              </a>
            </div>
          </div>

          {/* Social & Direct Contact Links */}
          <div className={`pixel-card links-card retro-reveal-right delay-4 ${isSectionRevealed ? 'is-revealed' : ''}`}>
            <div className="links-header font-pixel">DIRECT CHANNELS</div>
            <div className="links-list">
              <a
                href={`mailto:${profileData.email}`}
                className="direct-link-item"
                title="Send email"
              >
                <span className="link-icon">✉️</span>
                <div className="link-text">
                  <span className="link-type font-pixel">EMAIL:</span>
                  <strong className="link-val">{profileData.email}</strong>
                </div>
              </a>

              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="direct-link-item"
                title="View GitHub"
              >
                <span className="link-icon">🐙</span>
                <div className="link-text">
                  <span className="link-type font-pixel">GITHUB:</span>
                  <strong className="link-val">github.com/huudangg0204</strong>
                </div>
              </a>

              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="direct-link-item"
                title="View LinkedIn"
              >
                <span className="link-icon">💼</span>
                <div className="link-text">
                  <span className="link-type font-pixel">LINKEDIN:</span>
                  <strong className="link-val">linkedin.com/in/huudangg0204</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .world-4-container {
          padding-top: 1.5rem;
          margin-bottom: 3rem;
        }

        .castle-stage-wrapper {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 2.5rem;
          background: #F4EDE0;
          padding: 2.5rem 1.5rem 1.5rem;
          margin-bottom: 2.5rem;
          position: relative;
          min-height: 220px;
          overflow: hidden;
        }

        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 15;
        }

        .flagpole-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .flagpole-pole {
          width: 8px;
          height: 140px;
          background: #78350F;
          border: 2px solid #2A2118;
          position: relative;
        }

        .victory-flag {
          position: absolute;
          left: 10px;
          bottom: 10px;
          background: #E11D48;
          color: #FFF;
          border: 2px solid #2A2118;
          padding: 3px 8px;
          font-size: 0.55rem;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transition: bottom 1.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        .victory-flag.hoisted {
          bottom: 110px;
          animation: flagWave 1s infinite alternate;
        }

        .flagpole-base {
          width: 32px;
          height: 14px;
          background: #2A2118;
          border: 2px solid #2A2118;
        }

        .castle-structure {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .castle-parapet {
          display: flex;
          gap: 6px;
        }

        .parapet-brick {
          width: 24px;
          height: 16px;
          background: #E5DCCB;
          border: 2px solid #2A2118;
          border-bottom: none;
        }

        .castle-main {
          width: 140px;
          height: 80px;
          background: #D9CBB7;
          border: 3px solid #2A2118;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .castle-gate {
          width: 50px;
          height: 55px;
          background: #2A2118;
          border-top-left-radius: 25px;
          border-top-right-radius: 25px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 4px;
        }

        .hero-waving {
          display: flex;
          align-items: center;
          position: relative;
        }

        .hero-avatar {
          font-size: 1.8rem;
          line-height: 1;
        }

        .waving-hand {
          position: absolute;
          top: -10px;
          right: -8px;
          font-size: 1rem;
          animation: waveHand 0.8s ease-in-out infinite alternate;
        }

        @keyframes waveHand {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(25deg); }
        }

        .castle-speech-bubble {
          margin-top: 0.75rem;
          background: #FFFDF8;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          padding: 0.4rem 0.8rem;
          font-size: 0.58rem;
          color: #2A2118;
          text-align: center;
        }

        .castle-contact-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.75rem;
          align-items: start;
        }

        .contact-form-card {
          background: #FFFDF8;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px dashed #2A2118;
        }

        .header-icon {
          font-size: 1.8rem;
        }

        .form-title {
          font-size: 0.75rem;
          color: #2A2118;
        }

        .form-subtitle {
          font-size: 0.82rem;
          color: #645648;
          margin-top: 2px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-label {
          font-size: 0.52rem;
          color: #2A2118;
        }

        .pixel-input {
          background: #FAF6EE;
          border: 2px solid #2A2118;
          padding: 0.65rem 0.8rem;
          font-size: 0.85rem;
          color: #2A2118;
          box-shadow: inset 2px 2px 0px rgba(0,0,0,0.06);
          outline: none;
          transition: border-color 0.1s ease, background 0.1s ease;
        }

        .pixel-input:focus {
          background: #FFF;
          border-color: #D97706;
          box-shadow: inset 2px 2px 0px rgba(0,0,0,0.1), 0 0 0 2px #FEF3C7;
        }

        .sent-success-box {
          background: #ECFDF5;
          border: 2px solid #10B981;
          color: #065F46;
          padding: 1.25rem;
          font-size: 0.7rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .castle-info-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .status-card {
          background: #FFFDF8;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.5rem;
          color: #059669;
        }

        .status-dot-large {
          width: 8px;
          height: 8px;
          background: #10B981;
          border: 1px solid #2A2118;
          display: inline-block;
          animation: pulseGlow 1.5s infinite;
        }

        .status-title {
          font-size: 0.72rem;
          color: #2A2118;
        }

        .status-desc {
          font-size: 0.82rem;
          color: #645648;
          line-height: 1.45;
        }

        .cv-download-card {
          background: #FAF6EE;
          border-left: 5px solid #10B981;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .cv-icon {
          font-size: 2.2rem;
          line-height: 1;
        }

        .cv-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .cv-title {
          font-size: 0.65rem;
          color: #2A2118;
        }

        .cv-desc {
          font-size: 0.78rem;
          color: #645648;
          line-height: 1.35;
        }

        .links-card {
          background: #FFFDF8;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .links-header {
          font-size: 0.58rem;
          color: #2A2118;
          border-bottom: 2px dashed #2A2118;
          padding-bottom: 0.4rem;
        }

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .direct-link-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          color: #2A2118;
          padding: 0.45rem 0.6rem;
          background: #FAF6EE;
          border: 2px solid #2A2118;
          box-shadow: 2px 2px 0px #2A2118;
          transition: all 0.1s ease;
        }

        .direct-link-item:hover {
          background: #FEF3C7;
          transform: translate(-1px, -1px);
        }

        .link-icon {
          font-size: 1.1rem;
        }

        .link-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .link-type {
          font-size: 0.45rem;
          color: #786C60;
        }

        .link-val {
          font-size: 0.78rem;
        }

        @media (max-width: 900px) {
          .castle-contact-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
