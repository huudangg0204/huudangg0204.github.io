import profile from '../data/profile.json'
import { playJumpSound } from '../utils/audio'

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollToTop = () => {
    playJumpSound()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="retro-footer">
      <div className="footer-container">
        {/* Retro Credits Banner */}
        <div className="footer-credits-banner font-pixel">
          <span className="coin-insert-text anim-bob">🪙 INSERT COIN TO HIRE</span>
          <span className="credits-text">THANKS FOR PLAYING!</span>
        </div>

        <div className="footer-content-grid">
          {/* Hero Col */}
          <div className="footer-col">
            <div className="footer-hero-badge">
              <span className="hero-tag font-pixel">LEVEL 22</span>
              <strong className="hero-name font-pixel">{profile.name}</strong>
              <p className="hero-title">{profile.title}</p>
            </div>
            <p className="hero-tagline">
              B.Sc in Data Science at University of Information Technology (VNU-HCM). Researcher at UIT NLP Research Group.
            </p>
          </div>

          {/* World Teleports */}
          <div className="footer-col">
            <h5 className="footer-col-title font-pixel">QUEST DIRECTORY</h5>
            <div className="footer-nav-links">
              <button onClick={() => scrollTo('world-1')} className="footer-link-btn font-body">
                🚩 World 1-1: Origin & Bio
              </button>
              <button onClick={() => scrollTo('world-2')} className="footer-link-btn font-body">
                🍄 World 1-2: Skills & Power-ups
              </button>
              <button onClick={() => scrollTo('world-3')} className="footer-link-btn font-body">
                👾 World 1-3: Boss Battles (Projects)
              </button>
              <button onClick={() => scrollTo('world-4')} className="footer-link-btn font-body">
                🏰 World 1-4: Victory Castle & Hire
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div className="footer-col">
            <h5 className="footer-col-title font-pixel">CONNECT & CV</h5>
            <div className="footer-social-links">
              <a href={profile.cvPath} target="_blank" rel="noopener noreferrer" className="footer-social-a">
                📄 Download Full CV (PDF)
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="footer-social-a">
                🐙 GitHub Profile
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-a">
                💼 LinkedIn Profile
              </a>
              <a href={`mailto:${profile.email}`} className="footer-social-a">
                ✉️ {profile.email}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Top Button */}
        <div className="footer-bottom-bar">
          <p className="copyright-text font-body">
            © {year} Le Cao Huu Dang. Built with Retro Pixel Quest Aesthetics on Warm Cream Palette.
          </p>
          <button onClick={scrollToTop} className="pixel-btn pixel-btn-primary font-pixel top-btn">
            ▲ TOP OF QUEST
          </button>
        </div>
      </div>

      <style>{`
        .retro-footer {
          background: #F4EDE0;
          border-top: 4px solid #2A2118;
          padding: 3rem 1.5rem 2rem;
          position: relative;
        }

        .footer-container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .footer-credits-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          background: #2A2118;
          color: #FBBF24;
          padding: 0.85rem 1.25rem;
          font-size: 0.68rem;
          border: 2px solid #2A2118;
          box-shadow: 3px 3px 0px #2A2118;
        }

        .coin-insert-text {
          color: #F59E0B;
        }

        .credits-text {
          color: #FFF;
        }

        .footer-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-hero-badge {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-tag {
          font-size: 0.52rem;
          color: #E11D48;
        }

        .hero-name {
          font-size: 0.88rem;
          color: #2A2118;
        }

        .hero-title {
          font-size: 0.82rem;
          color: #D97706;
          font-weight: 600;
        }

        .hero-tagline {
          font-size: 0.82rem;
          color: #645648;
          line-height: 1.5;
        }

        .footer-col-title {
          font-size: 0.62rem;
          color: #2A2118;
          margin-bottom: 0.25rem;
        }

        .footer-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .footer-link-btn {
          background: none;
          border: none;
          text-align: left;
          font-size: 0.85rem;
          color: #4A3E33;
          cursor: pointer;
          padding: 2px 0;
          transition: color 0.1s ease;
        }

        .footer-link-btn:hover {
          color: #D97706;
          text-decoration: underline;
        }

        .footer-social-links {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .footer-social-a {
          font-size: 0.85rem;
          color: #4A3E33;
          text-decoration: none;
          transition: color 0.1s ease;
        }

        .footer-social-a:hover {
          color: #D97706;
          text-decoration: underline;
        }

        .footer-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 2px dashed #D5C9B7;
        }

        .copyright-text {
          font-size: 0.8rem;
          color: #786C60;
        }

        .top-btn {
          font-size: 0.55rem;
          padding: 0.5rem 0.8rem;
        }
      `}</style>
    </footer>
  )
}
