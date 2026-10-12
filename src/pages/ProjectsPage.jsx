import { useState, useEffect } from 'react'
import ProjectCard from '../components/ProjectCard'
import ProjectModal from '../components/ProjectModal'
import projects from '../data/projects.json'

const ALL_TAGS = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    document.title = 'Projects | Lê Cao Hữu Đăng'
  }, [])

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.tags.includes(activeFilter))

  return (
    <>
      {/* Header */}
      <section className="section grid-bg" style={{ paddingBottom: 'var(--space-10)' }}>
        <div className="container">
          <div className="section-label">Showcase</div>
          <h1 className="gradient-text" style={{ marginBottom: 'var(--space-4)' }}>
            Flagship AI Projects
          </h1>
          <p className="section-desc" style={{ marginBottom: 'var(--space-8)' }}>
            5 dự án AI/Data Science tiêu biểu — từ Speech AI ngoại tuyến, VQA neuro-symbolic, đến Medical RAG và Video Retrieval. Mỗi dự án kèm số liệu thực chiến và video demo.
          </p>

          {/* Tag Filter */}
          <div
            role="toolbar"
            aria-label="Lọc dự án theo công nghệ"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}
          >
            {ALL_TAGS.slice(0, 12).map(tag => (
              <button
                key={tag}
                id={`filter-${tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setActiveFilter(tag)}
                aria-pressed={activeFilter === tag}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: '999px',
                  border: `1px solid ${activeFilter === tag ? 'var(--cyan)' : 'var(--border-default)'}`,
                  background: activeFilter === tag ? 'var(--cyan-glow)' : 'transparent',
                  color: activeFilter === tag ? 'var(--cyan)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (activeFilter !== tag) {
                    e.currentTarget.style.borderColor = 'var(--border-strong)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={e => {
                  if (activeFilter !== tag) {
                    e.currentTarget.style.borderColor = 'var(--border-default)'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Count */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-6)',
          }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
            </span>
            {activeFilter !== 'All' && (
              <button
                onClick={() => setActiveFilter('All')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 'var(--space-1) var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--rose)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                ✕ Clear filter
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div
              role="status"
              style={{
                textAlign: 'center',
                padding: 'var(--space-20) 0',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>🔍</div>
              <h3 style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Không có dự án nào với tag này</h3>
              <button
                onClick={() => setActiveFilter('All')}
                className="btn btn-outline btn-sm"
                style={{ marginTop: 'var(--space-4)' }}
              >
                Xem tất cả dự án
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 'var(--space-6)',
            }}>
              {filtered.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          )}

          {/* CTA to Lab */}
          <div style={{
            marginTop: 'var(--space-16)',
            padding: 'var(--space-10)',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>⚡</div>
            <h2 style={{ marginBottom: 'var(--space-3)' }}>Muốn khám phá sâu hơn?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 480, margin: '0 auto var(--space-6)' }}>
              Thử AI Interactive Terminal — tra cứu kỹ năng, giả lập pipeline và đặt câu hỏi trực tiếp.
            </p>
            <a href="#/lab" className="btn btn-primary">
              ⚡ Vào AI Lab Terminal
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  )
}
