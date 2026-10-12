import { useState } from 'react'

function ProjectPreview({ project }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="project-card-preview">
      {!imgError ? (
        <img
          src={project.previewImage}
          alt={`Preview của dự án ${project.title}`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          <span style={{ fontSize: '2.5rem' }}>{project.emoji}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Demo video coming soon
          </span>
        </div>
      )}
      <div className="project-card-play" aria-hidden="true">
        <div className="play-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
      {project.featured && (
        <div style={{
          position: 'absolute',
          top: 'var(--space-3)',
          left: 'var(--space-3)',
          background: 'linear-gradient(135deg, var(--cyan-dim), var(--indigo))',
          color: '#fff',
          fontSize: '0.65rem',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          padding: '2px 8px',
          borderRadius: '999px',
          letterSpacing: '0.05em',
        }}>FEATURED</div>
      )}
    </div>
  )
}

export default function ProjectCard({ project, onClick }) {
  return (
    <article
      className="project-card"
      onClick={onClick}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`Xem chi tiết dự án ${project.title}`}
    >
      <ProjectPreview project={project} />

      <div style={{ padding: 'var(--space-5)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, flex: 1 }}>
              {project.title}
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            {project.summary}
          </p>
        </div>

        {/* Metrics */}
        {project.metrics?.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
          }}>
            {project.metrics.slice(0, 2).map((m, i) => (
              <div key={i} className="metric-card">
                <div className="metric-value">{m.value}</div>
                <div className="metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginTop: 'auto' }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              className="tag-chip"
              style={{
                background: project.tagColors?.[tag]
                  ? `${project.tagColors[tag]}15`
                  : 'var(--bg-elevated)',
                color: project.tagColors?.[tag] || 'var(--text-muted)',
                borderColor: project.tagColors?.[tag]
                  ? `${project.tagColors[tag]}40`
                  : 'var(--border-subtle)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
            Xem chi tiết →
          </span>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub repo của ${project.title}`}
            onClick={e => e.stopPropagation()}
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
          >
            🐙 GitHub
          </a>
        </div>
      </div>
    </article>
  )
}
