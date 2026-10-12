import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import profile from '../data/profile.json'

function HeroSection() {
  const navigate = useNavigate()

  return (
    <section
      className="grid-bg"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 'var(--space-20)',
        paddingBottom: 'var(--space-20)',
      }}
    >
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} aria-hidden="true" />
      <div style={{
        position: 'absolute', bottom: '20%', right: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-16)',
          alignItems: 'center',
        }}>
          {/* Left: Info */}
          <div>
            {/* Status badge */}
            <div className="animate-fade-in-up" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="badge-status" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--emerald)',
                  animation: 'pulse-glow 2s infinite',
                  display: 'inline-block',
                }} />
                {profile.statusEmoji} {profile.status}
              </span>
            </div>

            {/* Name */}
            <h1 className="animate-fade-in-up animate-delay-100" style={{ marginBottom: 'var(--space-3)' }}>
              <span className="gradient-text">{profile.name}</span>
            </h1>

            {/* Title */}
            <div className="animate-fade-in-up animate-delay-200" style={{ marginBottom: 'var(--space-4)' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--cyan)',
                letterSpacing: '0.05em',
              }}>
                &gt; {profile.title}
              </span>
            </div>

            <p className="animate-fade-in-up animate-delay-300" style={{ marginBottom: 'var(--space-4)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {profile.subtitle}
            </p>

            <p className="animate-fade-in-up animate-delay-400" style={{ marginBottom: 'var(--space-8)', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 500 }}>
              {profile.bio}
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animate-delay-500" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <button
                id="hero-cta-projects"
                className="btn btn-primary"
                onClick={() => navigate('/projects')}
              >
                ▶ Khám phá 5 Dự án
              </button>
              <button
                id="hero-cta-lab"
                className="btn btn-outline"
                onClick={() => navigate('/lab')}
              >
                ⚡ Thử AI Terminal
              </button>
              <a
                id="hero-cta-cv"
                href={profile.cvPath}
                download
                className="btn btn-ghost"
                aria-label="Tải CV PDF"
              >
                📄 Tải CV (PDF)
              </a>
            </div>

            {/* Social Links */}
            <div className="animate-fade-in-up" style={{ marginTop: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)', fontSize: '0.85rem' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label="GitHub Profile"
              >
                🐙 GitHub
              </a>
              <span style={{ width: 1, height: 16, background: 'var(--border-default)' }} />
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)', fontSize: '0.85rem' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                aria-label="LinkedIn Profile"
              >
                💼 LinkedIn
              </a>
              <span style={{ width: 1, height: 16, background: 'var(--border-default)' }} />
              <a href={`mailto:${profile.email}`} style={{ color: 'var(--text-muted)', transition: 'color var(--transition-fast)', fontSize: '0.85rem' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                📧 Email
              </a>
            </div>
          </div>

          {/* Right: Avatar + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)' }}>
            {/* Avatar */}
            <div style={{
              position: 'relative',
              animation: 'float 6s ease-in-out infinite',
            }}>
              <div style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                padding: 3,
                background: 'linear-gradient(135deg, var(--cyan), var(--indigo))',
                boxShadow: '0 0 40px rgba(56, 189, 248, 0.25), 0 0 80px rgba(56, 189, 248, 0.08)',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                }}>
                  <img
                    src={profile.avatar}
                    alt={`Ảnh đại diện của ${profile.name}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '👤' }}
                  />
                </div>
              </div>
              {/* Orbit decoration */}
              <div style={{
                position: 'absolute', inset: -16,
                borderRadius: '50%',
                border: '1px dashed var(--border-subtle)',
                animation: 'none',
              }} aria-hidden="true" />
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', width: '100%', maxWidth: 360 }}>
              {[
                { value: '5', label: 'Dự án AI', icon: '🚀' },
                { value: profile.education[0].gpa, label: 'GPA', icon: '🎓' },
                { value: '3+', label: 'Năm nghiên cứu', icon: '🔬' },
              ].map((stat, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: 'var(--space-4)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-base)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: 'var(--space-1)' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--cyan)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ResearchSection() {
  const r = profile.research

  return (
    <section className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-label">Research</div>
        <h2 className="section-title">UIT NLP Research Group</h2>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Accent line */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, bottom: 0,
            width: 4,
            background: 'linear-gradient(to bottom, var(--cyan), var(--indigo))',
            borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
          }} aria-hidden="true" />

          <div style={{ paddingLeft: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '1.5rem' }}>🔬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{r.lab}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{r.role}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              {r.highlights.map((h, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ color: 'var(--emerald)', marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EducationSection() {
  const edu = profile.education[0]

  return (
    <section className="section">
      <div className="container">
        <div className="section-label">Education</div>
        <h2 className="section-title">Học vấn & Thành tích</h2>
        <div className="card" style={{ maxWidth: 600 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--cyan-glow), var(--indigo-glow))',
              border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
            }}>🎓</div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-1)' }}>{edu.school}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)', marginBottom: 'var(--space-3)' }}>
                {edu.degree}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                <span className="badge badge-cyan">GPA: {edu.gpa}</span>
                <span className="badge badge-green">{edu.period}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {edu.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  const categories = Object.values(profile.skills)

  return (
    <section className="section" style={{ background: 'var(--bg-surface)' }}>
      <div className="container">
        <div className="section-label">Skills</div>
        <h2 className="section-title">Kỹ năng Chuyên sâu</h2>
        <p className="section-desc" style={{ marginBottom: 'var(--space-10)' }}>
          Phân nhóm theo domain — từ LLM & Agentic AI đến Data Engineering và Backend/DevOps.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {categories.map((cat) => (
            <div key={cat.label} className="skill-category-card" style={{
              borderLeft: `3px solid ${cat.color}20`,
            }}>
              <div className="skill-category-icon">{cat.icon}</div>
              <div className="skill-category-label" style={{ color: cat.color }}>
                {cat.label}
              </div>
              <div className="skill-pills-grid">
                {cat.items.map(item => (
                  <span
                    key={item}
                    className="skill-pill"
                    style={{ '--pill-hover-color': cat.color }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = `${cat.color}40`
                      e.currentTarget.style.color = cat.color
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  useEffect(() => {
    document.title = 'Lê Cao Hữu Đăng | AI Systems & Data Science Engineer'
  }, [])

  return (
    <>
      <HeroSection />
      <ResearchSection />
      <EducationSection />
      <SkillsSection />
    </>
  )
}
