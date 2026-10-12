import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import profile from '../data/profile.json'

const NAV_ITEMS = [
  { to: '/',         label: 'Living CV',   icon: '◈' },
  { to: '/projects', label: 'Projects',    icon: '◆' },
  { to: '/lab',      label: 'AI Lab',      icon: '⚡' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none' }} aria-label="Home">
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--cyan-dim), var(--indigo))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0,
          }}>HD</div>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>Hữu Đăng</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AI Engineer</div>
          </div>
        </NavLink>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
            >
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{icon}</span>
              {label}
            </NavLink>
          ))}
          <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 var(--space-2)' }} />
          <a
            href={profile.cvPath}
            download
            className="btn btn-outline btn-sm"
            aria-label="Download CV PDF"
          >
            <span>📄</span> CV
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-btn"
          className="mobile-menu-btn"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(v => !v)}
          style={{
            display: 'none',
            background: 'transparent',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            padding: 'var(--space-2)',
            cursor: 'pointer',
            fontSize: '1.1rem',
            lineHeight: 1,
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div id="mobile-menu" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(10, 22, 40, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-default)',
          padding: 'var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
              style={{ justifyContent: 'flex-start' }}
            >
              <span>{icon}</span>{label}
            </NavLink>
          ))}
          <a
            href={profile.cvPath}
            download
            className="btn btn-outline btn-sm"
            style={{ marginTop: 'var(--space-2)' }}
          >
            📄 Tải CV
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; }
        }
      `}</style>
    </nav>
  )
}
