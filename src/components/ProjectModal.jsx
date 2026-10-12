import { useEffect, useRef, useState } from 'react'
import { playBlipSound } from '../utils/audio'
import generatedProjectMedia from '../data/projectMedia.generated'

function toPublicUrl(path) {
  if (!path) return null
  return path.startsWith('/') ? path : `${import.meta.env.BASE_URL}${path}`
}

function getProjectMedia(project) {
  const generatedMedia = generatedProjectMedia[project.id]
  const galleryImages = generatedMedia?.galleryImages?.length
    ? generatedMedia.galleryImages
    : project.galleryImages?.filter(Boolean).length
      ? project.galleryImages.filter(Boolean)
      : project.previewImage ? [project.previewImage] : []

  return {
    galleryImages: galleryImages.map(toPublicUrl),
    demoVideo: toPublicUrl(generatedMedia?.demoVideo || project.demoVideo),
  }
}

function VideoPlayer({ project, src }) {
  const videoRef = useRef(null)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => setVideoError(false), [src])

  if (videoError) {
    return (
      <div className="video-fallback-box pixel-card">
        <span style={{ fontSize: '2.5rem' }}>{project.emoji}</span>
        <div className="fallback-text">
          <strong className="font-pixel" style={{ fontSize: '0.68rem', color: '#2A2118' }}>
            DEMO PREVIEW READY
          </strong>
          <p style={{ fontSize: '0.8rem', color: '#645648', marginTop: '4px' }}>
            Production pipeline ready for live demonstration. Inspect source code and architectural stages below.
          </p>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: '#786C60' }}>
            The video file is unavailable. Add a supported video to this project folder and rebuild the site.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="video-wrapper">
      <video
        ref={videoRef}
        src={src}
        poster={project.previewImage}
        controls
        onError={() => setVideoError(true)}
        aria-label={`Demo video: ${project.title}`}
      />
    </div>
  )
}

function ProjectGallery({ project, images }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState([])
  const touchStartX = useRef(null)
  const activeImage = images[activeIndex]
  const hasMultipleImages = images.length > 1

  if (images.length === 0) return null

  useEffect(() => {
    setActiveIndex(0)
    setFailedImages([])
  }, [project.id])

  const moveToImage = (direction) => {
    setActiveIndex((currentIndex) => (
      (currentIndex + direction + images.length) % images.length
    ))
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const distance = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null

    if (Math.abs(distance) < 40 || !hasMultipleImages) return
    moveToImage(distance < 0 ? 1 : -1)
  }

  return (
    <div className="project-gallery">
      <div
        className="gallery-stage"
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
        onTouchEnd={handleTouchEnd}
      >
        {failedImages.includes(activeImage) ? (
          <div className="gallery-image-fallback" role="status">
            <span>{project.emoji}</span>
            <span className="font-pixel">IMAGE PREVIEW UNAVAILABLE</span>
          </div>
        ) : (
          <img
            key={activeImage}
            className="gallery-image"
            src={activeImage}
            alt={`${project.title} — ảnh ${activeIndex + 1} trên ${images.length}`}
            onError={() => setFailedImages((current) => [...new Set([...current, activeImage])])}
          />
        )}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="gallery-nav gallery-nav-prev font-pixel"
              onClick={() => moveToImage(-1)}
              aria-label="Xem ảnh trước"
            >
              ◀
            </button>
            <button
              type="button"
              className="gallery-nav gallery-nav-next font-pixel"
              onClick={() => moveToImage(1)}
              aria-label="Xem ảnh tiếp theo"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="gallery-pagination" aria-label="Chọn ảnh project">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`gallery-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Xem ảnh ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
          <span className="gallery-counter font-pixel">{activeIndex + 1} / {images.length}</span>
        </div>
      )}
    </div>
  )
}

function ProjectMedia({ project }) {
  const media = getProjectMedia(project)
  const hasImages = media.galleryImages.length > 0
  const hasVideo = Boolean(media.demoVideo)

  if (!hasImages && !hasVideo) {
    return (
      <div className="media-empty-state" role="status">
        <span aria-hidden="true">📁</span>
        <span className="font-pixel">MEDIA DEMO COMING SOON</span>
      </div>
    )
  }

  return (
    <>
      {hasImages && (
        <div className="section-block">
          <h4 className="section-title font-pixel">🖼️ PROJECT GALLERY</h4>
          <ProjectGallery project={project} images={media.galleryImages} />
        </div>
      )}

      {hasVideo && (
        <div className="section-block">
          <h4 className="section-title font-pixel">🎬 VIDEO DEMO & LIVE EXECUTION</h4>
          <VideoPlayer project={project} src={media.demoVideo} />
        </div>
      )}
    </>
  )
}

function ArchitectureFlow({ steps }) {
  return (
    <div className="arch-flow-wrapper">
      <div className="arch-steps-container">
        {steps.map((step, i) => (
          <div key={i} className="arch-step-node">
            <div className="arch-box">
              <span className="step-num font-pixel">STAGE {i + 1}</span>
              <span className="step-title font-body">{step}</span>
            </div>
            {i < steps.length - 1 && <span className="step-arrow font-pixel">➔</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProjectModal({ project, onClose }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!project) return null

  const boss = project.boss || {}

  const handleClose = () => {
    playBlipSound()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div 
        ref={modalRef} 
        className="modal-window pixel-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Retro Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="boss-defeat-tag font-pixel">💀 BOSS DEFEATED</span>
            <h2 className="modal-title font-pixel">
              {project.emoji} {project.title}
            </h2>
          </div>
          <button 
            onClick={handleClose} 
            className="pixel-btn pixel-btn-red font-pixel close-btn"
            aria-label="Close dialog"
          >
            ✖ ESC
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-scroll-body">
          {/* Boss Encounter Lore Bar */}
          <div className="boss-encounter-lore">
            <div className="lore-item">
              <span className="lore-label font-pixel">BOSS ENCOUNTER:</span>
              <strong className="lore-val font-pixel">{boss.name || project.shortTitle}</strong>
            </div>
            <div className="lore-item">
              <span className="lore-label font-pixel">EXP REWARD:</span>
              <span className="lore-val color-gold font-pixel">{boss.exp || '+3,000 EXP'}</span>
            </div>
          </div>

          {/* Only render the media types that this project provides. */}
          <ProjectMedia project={project} />

          {/* Summary & Description */}
          <div className="section-block">
            <h4 className="section-title font-pixel">📖 TACTICAL BLUEPRINT & DESIGN</h4>
            <p className="desc-text">{project.description}</p>
          </div>

          {/* Metrics Overview */}
          <div className="section-block">
            <h4 className="section-title font-pixel">📊 KEY BENCHMARKS & VERIFIED METRICS</h4>
            <div className="modal-metrics-grid">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="modal-metric-chip">
                  <span className="metric-ico">{m.icon}</span>
                  <div className="metric-text-group">
                    <span className="modal-m-label font-pixel">{m.label}</span>
                    <strong className="modal-m-val font-mono">{m.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Architecture Flow */}
          <div className="section-block">
            <h4 className="section-title font-pixel">🏗️ DATA PIPELINE ARCHITECTURE</h4>
            <ArchitectureFlow steps={project.architecture} />
          </div>

          {/* Weapon / Tech Stack */}
          <div className="section-block">
            <h4 className="section-title font-pixel">⚔️ WEAPONS & ARSENAL TECH STACK</h4>
            <div className="modal-tags-list">
              {project.techStack.map((tech, idx) => (
                <span key={idx} className="tech-pill font-mono">
                  ✦ {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-btn pixel-btn-primary font-pixel"
          >
            📦 VIEW FULL GITHUB REPOSITORY
          </a>
          <button 
            onClick={handleClose} 
            className="pixel-btn pixel-btn-white font-pixel"
          >
            RETURN TO QUEST
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(42, 33, 24, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          backdrop-filter: blur(3px);
        }

        .modal-window {
          width: 100%;
          max-width: 820px;
          max-height: 90vh;
          background: #FAF6EE;
          border: 4px solid #2A2118;
          box-shadow: 8px 8px 0px #2A2118;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 0;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: #F4EDE0;
          border-bottom: 3px solid #2A2118;
        }

        .modal-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .boss-defeat-tag {
          font-size: 0.52rem;
          color: #DC2626;
        }

        .modal-title {
          font-size: 0.85rem;
          color: #2A2118;
          line-height: 1.3;
        }

        .close-btn {
          font-size: 0.65rem;
          padding: 0.4rem 0.65rem;
        }

        .modal-scroll-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.4rem;
        }

        .boss-encounter-lore {
          background: #FEF08A;
          border: 2px solid #2A2118;
          padding: 0.65rem 0.9rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .lore-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
        }

        .lore-label {
          color: #78350F;
        }

        .lore-val {
          color: #2A2118;
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .section-title {
          font-size: 0.65rem;
          color: #2A2118;
        }

        .video-wrapper {
          border: 3px solid #2A2118;
          background: #000;
          overflow: hidden;
        }

        .video-wrapper video {
          width: 100%;
          max-height: 380px;
          display: block;
        }

        .media-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          border: 2px dashed #786C60;
          padding: 1.5rem;
          color: #645648;
          font-size: 0.55rem;
        }

        .media-empty-state span:first-child {
          font-size: 2rem;
        }

        .project-gallery {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .gallery-stage {
          position: relative;
          min-height: 220px;
          background: #1F1812;
          border: 3px solid #2A2118;
          overflow: hidden;
          touch-action: pan-y;
        }

        .gallery-image,
        .gallery-image-fallback {
          width: 100%;
          height: min(50vw, 380px);
          min-height: 220px;
          display: block;
        }

        .gallery-image {
          object-fit: contain;
          animation: gallery-slide-in 180ms ease-out;
        }

        .gallery-image-fallback {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #FAF6EE;
          font-size: 0.55rem;
        }

        .gallery-image-fallback span:first-child {
          font-size: 2.5rem;
        }

        @keyframes gallery-slide-in {
          from { opacity: 0; transform: translateX(14px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .gallery-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 2.25rem;
          height: 2.25rem;
          border: 2px solid #FAF6EE;
          background: rgba(42, 33, 24, 0.9);
          color: #FAF6EE;
          cursor: pointer;
          font-size: 0.6rem;
        }

        .gallery-nav:hover,
        .gallery-nav:focus-visible {
          background: #F59E0B;
          color: #2A2118;
          outline: 2px solid #F59E0B;
          outline-offset: 2px;
        }

        .gallery-nav-prev { left: 0.65rem; }
        .gallery-nav-next { right: 0.65rem; }

        .gallery-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.4rem;
        }

        .gallery-dot {
          width: 0.65rem;
          height: 0.65rem;
          padding: 0;
          border: 2px solid #2A2118;
          border-radius: 50%;
          background: #F4EDE0;
          cursor: pointer;
        }

        .gallery-dot.active { background: #F59E0B; }

        .gallery-dot:focus-visible {
          outline: 2px solid #0284C7;
          outline-offset: 2px;
        }

        .gallery-counter {
          margin-left: 0.25rem;
          color: #645648;
          font-size: 0.5rem;
        }

        .video-fallback-box {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: #FFFDF8;
          padding: 1.25rem;
        }

        .fallback-text {
          display: flex;
          flex-direction: column;
        }

        .desc-text {
          font-size: 0.92rem;
          color: #4A3E33;
          line-height: 1.6;
          background: #FFFDF9;
          border: 2px solid #2A2118;
          padding: 0.9rem 1.1rem;
        }

        .modal-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.65rem;
        }

        .modal-metric-chip {
          background: #FFFDF9;
          border: 2px solid #2A2118;
          padding: 0.6rem 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .metric-ico {
          font-size: 1.4rem;
        }

        .metric-text-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .modal-m-label {
          font-size: 0.5rem;
          color: #786C60;
        }

        .modal-m-val {
          font-size: 0.85rem;
          color: #2A2118;
        }

        .arch-steps-container {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .arch-step-node {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .arch-box {
          background: #F4EDE0;
          border: 2px solid #2A2118;
          padding: 0.45rem 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .step-num {
          font-size: 0.45rem;
          color: #D97706;
        }

        .step-title {
          font-size: 0.78rem;
          font-weight: 600;
          color: #2A2118;
        }

        .step-arrow {
          font-size: 0.75rem;
          color: #2A2118;
        }

        .modal-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tech-pill {
          background: #F4EDE0;
          border: 2px solid #2A2118;
          padding: 0.35rem 0.65rem;
          font-size: 0.78rem;
          color: #2A2118;
        }

        .modal-footer {
          padding: 0.9rem 1.25rem;
          background: #F4EDE0;
          border-top: 3px solid #2A2118;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        @media (max-width: 600px) {
          .modal-footer {
            flex-direction: column;
          }
          .modal-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .gallery-image,
          .gallery-image-fallback {
            height: 220px;
          }
        }
      `}</style>
    </div>
  )
}
