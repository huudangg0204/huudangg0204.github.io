import { useState, useEffect, useRef } from 'react'
import profileData from '../data/profile.json'
import { playBlipSound, playCoinSound } from '../utils/audio'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function WorldIntro({ onAddCoin }) {
  const audioRef = useRef(null)
  const [activeMusicTrack, setActiveMusicTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [expCounter, setExpCounter] = useState(0)
  const [sectionRef, isSectionRevealed] = useScrollReveal({ threshold: 0.15 })

  const tracks = profileData.personal?.music?.tracks || []
  const currentTrack = tracks[activeMusicTrack] || tracks[0] || {}

  // Keep ref synchronized with current track index to prevent stale closures
  const activeTrackRef = useRef(activeMusicTrack)
  useEffect(() => {
    activeTrackRef.current = activeMusicTrack
  }, [activeMusicTrack])

  const handleCollectCoin = () => {
    playCoinSound()
    if (onAddCoin) onAddCoin()
  }

  // Default audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.45
    }
  }, [])

  // Auto-advance to next song seamlessly
  const handleAutoNextTrack = () => {
    if (!tracks.length || !audioRef.current) return
    const nextIdx = (activeTrackRef.current + 1) % tracks.length
    activeTrackRef.current = nextIdx
    setActiveMusicTrack(nextIdx)
    setCurrentTime(0)

    const audio = audioRef.current
    audio.src = encodeURI(tracks[nextIdx].src)
    audio.currentTime = 0
    audio.load()

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.warn('Auto play next track waiting for buffer:', err)
          const onCanPlay = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {})
            audio.removeEventListener('canplay', onCanPlay)
          }
          audio.addEventListener('canplay', onCanPlay)
        })
    }
  }

  // Listen directly on audio element for the ended event
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onAudioEnded = () => {
      handleAutoNextTrack()
    }

    audio.addEventListener('ended', onAudioEnded)
    return () => {
      audio.removeEventListener('ended', onAudioEnded)
    }
  }, [tracks])

  const handleTrackChange = (idx, autoPlay = true) => {
    playBlipSound()
    setActiveMusicTrack(idx)
    activeTrackRef.current = idx
    setCurrentTime(0)
    if (audioRef.current && tracks[idx]) {
      audioRef.current.src = encodeURI(tracks[idx].src)
      audioRef.current.currentTime = 0
      audioRef.current.load()
      if (autoPlay || isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Playback blocked by browser policy:', err)
            setIsPlaying(false)
          })
      }
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      playBlipSound()
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play error:', err)
        })
    }
  }

  const handlePrevTrack = () => {
    playBlipSound()
    if (!tracks.length || !audioRef.current) return
    const prevIdx = (activeTrackRef.current - 1 + tracks.length) % tracks.length
    handleTrackChange(prevIdx, true)
  }

  const handleNextTrack = () => {
    playBlipSound()
    handleAutoNextTrack()
  }

  const toggleMute = () => {
    playBlipSound()
    if (audioRef.current) {
      const nextMuted = !isMuted
      audioRef.current.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const seekTime = pos * duration
    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Animated EXP counter when scrolled into view
  useEffect(() => {
    if (!isSectionRevealed) return
    let start = 0
    const target = 8450
    const duration = 1200
    const stepTime = 25
    const increment = Math.ceil(target / (duration / stepTime))

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setExpCounter(target)
        clearInterval(timer)
      } else {
        setExpCounter(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isSectionRevealed])

  // Autoplay music on load or on first user gesture
  useEffect(() => {
    const tryPlay = () => {
      if (!audioRef.current) return
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            removeInteractionListeners()
          })
          .catch((err) => {
            // Browser autoplay policy requires user gesture
            console.log('Autoplay waiting for user gesture:', err?.name)
          })
      }
    }

    const interactionEvents = ['pointerdown', 'click', 'keydown', 'touchstart']
    const handleInteraction = () => {
      tryPlay()
    }

    const removeInteractionListeners = () => {
      interactionEvents.forEach(evt => {
        window.removeEventListener(evt, handleInteraction)
        document.removeEventListener(evt, handleInteraction)
      })
    }

    // Attempt immediately on mount
    tryPlay()

    // Listen on window and document until play succeeds
    interactionEvents.forEach(evt => {
      window.addEventListener(evt, handleInteraction, { passive: true })
      document.addEventListener(evt, handleInteraction, { passive: true })
    })

    return () => {
      removeInteractionListeners()
    }
  }, [])

  return (
    <section id="world-1" ref={sectionRef} className="world-section world-1-container">
      {/* Top Header: Origin Title (Left) & Pocket Retro Cassette Deck (Top-Right) */}
      <div className={`world-1-header retro-reveal ${isSectionRevealed ? 'is-revealed' : ''}`}>
        <div className="world-banner-info">
          <span className="world-tag font-pixel">★ WORLD 1-1 ★</span>
          <h2 className="world-title font-pixel">ORIGIN: CHARACTER SHEET & LORE</h2>
          <p className="world-subtitle">
            Welcome, Recruiter! Step into the quest. Explore character stats, academic roots at UIT (VNU-HCM), and personal engineering lore.
          </p>
        </div>

        {/* Compact Pocket Cassette Deck (Top Right) */}
        <div className="pocket-cassette-deck">
          {/* Native Audio Element */}
          <audio
            ref={audioRef}
            src={currentTrack?.src ? encodeURI(currentTrack.src) : ''}
            preload="auto"
            onTimeUpdate={() => {
              if (audioRef.current) {
                setCurrentTime(audioRef.current.currentTime)
                if (!duration && audioRef.current.duration) {
                  setDuration(audioRef.current.duration)
                }
              }
            }}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(audioRef.current.duration || 0)
              }
            }}
            onEnded={handleAutoNextTrack}
          />

          <div className="pocket-deck-top">
            <span className="pocket-title font-pixel">🎧 CASSETTE DECK</span>
            <div className="pocket-status font-pixel">
              {isPlaying ? (
                <span className="status-playing">
                  <span className="rec-dot"></span> PLAYING
                </span>
              ) : (
                <span className="status-paused" title="Click anywhere on page to play">
                  ⏸ CLICK TO PLAY 🎵
                </span>
              )}
            </div>
          </div>

          <div className="pocket-tape-row">
            <div className="pocket-cassette-window">
              <div className={`tape-spool-mini ${isPlaying ? 'spinning' : ''}`}></div>
              <div className={`tape-vu-mini ${isPlaying ? 'active' : ''}`}>
                <span className="vu-bar bar-1"></span>
                <span className="vu-bar bar-2"></span>
                <span className="vu-bar bar-3"></span>
              </div>
              <div className={`tape-spool-mini ${isPlaying ? 'spinning' : ''}`}></div>
            </div>

            <div className="pocket-track-details">
              <div className="pocket-track-name font-pixel" title={currentTrack?.title}>
                {activeMusicTrack + 1}. {currentTrack?.title || 'Retro Cassette'}
              </div>
              <span className="pocket-track-time font-pixel">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Mini Progress Bar */}
          <div className="pocket-progress-wrap" onClick={handleSeek} title="Click to seek">
            <div 
              className="pocket-progress-fill" 
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>

          {/* Physical Controls Bar */}
          <div className="pocket-controls">
            <button className="pocket-btn font-pixel" onClick={handlePrevTrack} title="Previous track">⏮</button>
            <button 
              className={`pocket-btn pocket-btn-play font-pixel ${isPlaying ? 'is-playing' : ''}`} 
              onClick={togglePlay}
              title={isPlaying ? 'Pause Music' : 'Play Music'}
            >
              {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
            </button>
            <button className="pocket-btn font-pixel" onClick={handleNextTrack} title="Next track">⏭</button>
            <button className="pocket-btn font-pixel" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          {/* Mini Track Quick-Selectors */}
          <div className="pocket-track-chips">
            {tracks.map((t, idx) => (
              <button
                key={idx}
                onClick={() => handleTrackChange(idx, true)}
                className={`pocket-chip font-pixel ${activeMusicTrack === idx ? 'active' : ''}`}
                title={`${idx + 1}. ${t.title}`}
              >
                {activeMusicTrack === idx && isPlaying ? '🎵' : `#${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="intro-grid">
        {/* Left Column: Character Sheet / Stats */}
        <div className={`pixel-card character-card retro-reveal-left ${isSectionRevealed ? 'is-revealed' : ''}`}>
          <div className="character-header">
            <div className="avatar-frame" onClick={handleCollectCoin} title="Click to collect bonus coin & hear chime!" aria-label="Player Avatar">
              <img 
                src={profileData.avatar} 
                alt={profileData.name}
                className="pixel-avatar"
                onError={(e) => {
                  e.target.style.display = 'none'
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div className="avatar-fallback" style={{ display: 'none' }}>
                <span style={{ fontSize: '2.5rem' }}>🧑‍💻</span>
              </div>
              <div className="level-badge font-pixel">LV.22</div>
            </div>

            <div className="character-info">
              <div className="character-status font-pixel">
                <span className="status-dot"></span> OPEN FOR QUESTS
              </div>
              <h1 className="character-name font-pixel">{profileData.name}</h1>
              <p className="character-title font-body">{profileData.title}</p>
              <p className="character-origin font-body">
                🎓 <strong>UIT (VNU-HCM)</strong> — B.Sc in Data Science (GPA {profileData.education[0].gpa})
              </p>
            </div>
          </div>

          {/* Character Stats Bar */}
          <div className="stats-box">
            <h3 className="stats-title font-pixel">CHARACTER ATTRIBUTES</h3>
            <div className="stat-row">
              <span className="stat-label font-pixel">HP (Stamina)</span>
              <div className="stat-bar-track">
                <div 
                  className="stat-bar-fill fill-red" 
                  style={{ width: isSectionRevealed ? '100%' : '0%' }}
                />
              </div>
              <span className="stat-val font-pixel">100/100</span>
            </div>
            <div className="stat-row">
              <span className="stat-label font-pixel">MP (Creativity)</span>
              <div className="stat-bar-track">
                <div 
                  className="stat-bar-fill fill-blue" 
                  style={{ width: isSectionRevealed ? '96%' : '0%' }}
                />
              </div>
              <span className="stat-val font-pixel">96/100</span>
            </div>
            <div className="stat-row">
              <span className="stat-label font-pixel">EXP (Projects)</span>
              <div className="stat-bar-track">
                <div 
                  className="stat-bar-fill fill-gold" 
                  style={{ width: isSectionRevealed ? '85%' : '0%' }}
                />
              </div>
              <span className="stat-val font-pixel">
                {isSectionRevealed ? `${(expCounter / 1000).toFixed(2)}K` : '0.00K'}
              </span>
            </div>
          </div>

          {/* Research Affiliation */}
          <div className="research-box">
            <div className="box-tag font-pixel">RESEARCH LAB</div>
            <h4 className="research-lab-name font-pixel">{profileData.research.lab}</h4>
            <p className="research-role">{profileData.research.role}</p>
            <ul className="research-list">
              {profileData.research.highlights.map((item, i) => (
                <li key={i}>⚔️ {item}</li>
              ))}
            </ul>
          </div>

          {/* Primary Action Buttons */}
          <div className="character-actions">
            <a 
              href={profileData.cvPath} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="pixel-btn pixel-btn-primary action-btn"
              onClick={() => playCoinSound()}
            >
              📄 DOWNLOAD CV (PDF)
            </a>
            <a 
              href={profileData.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="pixel-btn pixel-btn-white action-btn"
              onClick={() => playBlipSound()}
            >
              🐙 GITHUB REPO
            </a>
          </div>
        </div>

        {/* Right Column: Personal Lore (Hobbies, Music, Movies) */}
        <div className="personal-lore-column">
          {/* Motto Card */}
          <div className={`pixel-card motto-card retro-reveal delay-1 ${isSectionRevealed ? 'is-revealed' : ''}`}>
            <div className="card-mini-title font-pixel">💬 PLAYER MOTTO</div>
            <p className="motto-text">
              &ldquo;{profileData.personal.motto}&rdquo;
            </p>
          </div>

          {/* Personal Hobbies & Habits */}
          <div className={`pixel-card hobbies-card retro-reveal delay-2 ${isSectionRevealed ? 'is-revealed' : ''}`}>
            <div className="card-mini-title font-pixel">☕ HOBBIES & ENGINEERING RITUALS</div>
            <div className="hobbies-grid">
              {profileData.personal.hobbies.map((h, i) => (
                <div key={i} className="hobby-item">
                  <div className="hobby-icon">{h.icon}</div>
                  <div className="hobby-content">
                    <h5 className="hobby-name font-pixel">{h.title}</h5>
                    <p className="hobby-desc">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sci-Fi Cinema & Anime Favorites */}
          <div className={`pixel-card cinema-card retro-reveal delay-4 ${isSectionRevealed ? 'is-revealed' : ''}`}>
            <div className="card-mini-title font-pixel">🎬 SCI-FI CINEMA & ANIME INSPIRATIONS</div>
            <div className="movies-row">
              {profileData.personal.movies.favorites.map((m, i) => (
                <div key={i} className="movie-chip">
                  <span className="movie-tag font-pixel">{m.tag}</span>
                  <strong className="movie-name">{m.title}</strong>
                  <p className="movie-desc">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .world-1-container {
          padding-top: 1.5rem;
          margin-bottom: 5rem;
        }

        .world-1-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .world-banner-info {
          flex: 1;
        }

        .intro-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        .character-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .character-header {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .avatar-frame {
          position: relative;
          width: 96px;
          height: 96px;
          border: 3px solid #2A2118;
          box-shadow: 3px 3px 0px #2A2118;
          background: #F4EDE0;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.1s ease;
        }

        .avatar-frame:hover {
          transform: scale(1.05);
        }

        .pixel-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
          image-rendering: pixelated;
        }

        .avatar-fallback {
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          background: #FEF3C7;
        }

        .level-badge {
          position: absolute;
          bottom: -6px;
          right: -6px;
          background: #E11D48;
          color: #FFF;
          font-size: 0.5rem;
          padding: 2px 4px;
          border: 2px solid #2A2118;
        }

        .character-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .character-status {
          font-size: 0.52rem;
          color: #059669;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          background: #10B981;
          border: 1px solid #2A2118;
          display: inline-block;
          animation: pulseGlow 1.5s infinite;
        }

        .character-name {
          font-size: 1.05rem;
          color: #2A2118;
          line-height: 1.3;
        }

        .character-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #D97706;
        }

        .character-origin {
          font-size: 0.78rem;
          color: #645648;
          line-height: 1.4;
        }

        .stats-box {
          background: #F4EDE0;
          border: 2px solid #2A2118;
          padding: 0.9rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .stats-title {
          font-size: 0.62rem;
          color: #2A2118;
          margin-bottom: 0.2rem;
        }

        .stat-row {
          display: grid;
          grid-template-columns: 110px 1fr 54px;
          align-items: center;
          gap: 0.5rem;
        }

        .stat-label {
          font-size: 0.5rem;
          color: #645648;
        }

        .stat-bar-track {
          height: 10px;
          background: #FFFDF9;
          border: 2px solid #2A2118;
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          transition: width 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .fill-red { background: #E11D48; }
        .fill-blue { background: #0284C7; }
        .fill-gold { background: #F59E0B; }

        .stat-val {
          font-size: 0.52rem;
          color: #2A2118;
          text-align: right;
        }

        .research-box {
          background: #FAF6EE;
          border: 2px dashed #2A2118;
          padding: 0.9rem;
          position: relative;
        }

        .box-tag {
          display: inline-block;
          font-size: 0.48rem;
          background: #8B5CF6;
          color: #FFF;
          padding: 2px 6px;
          border: 1px solid #2A2118;
          margin-bottom: 0.4rem;
        }

        .research-lab-name {
          font-size: 0.72rem;
          color: #2A2118;
          margin-bottom: 0.2rem;
        }

        .research-role {
          font-size: 0.75rem;
          color: #D97706;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .research-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .research-list li {
          font-size: 0.76rem;
          color: #44372C;
          line-height: 1.4;
        }

        .character-actions {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          width: 100%;
        }

        .character-actions .action-btn {
          width: 100%;
          box-sizing: border-box;
          justify-content: center;
          font-size: 0.68rem;
          padding: 0.8rem 1rem;
          text-align: center;
        }

        .personal-lore-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-mini-title {
          font-size: 0.62rem;
          color: #2A2118;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .motto-card {
          background: #FFFDF8;
          border-left: 5px solid #F59E0B;
        }

        .motto-text {
          font-size: 0.95rem;
          color: #44372C;
          font-style: italic;
          line-height: 1.5;
        }

        /* Pocket Retro Cassette Deck (Top Right) */
        .pocket-cassette-deck {
          width: 330px;
          background: #2A2118;
          color: #FFF;
          border: 3px solid #2A2118;
          box-shadow: 4px 4px 0 #1A130D;
          padding: 0.65rem 0.8rem;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .pocket-deck-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pocket-title {
          font-size: 0.58rem;
          color: #FBBF24;
          letter-spacing: 0.5px;
        }

        .pocket-status {
          font-size: 0.46rem;
          letter-spacing: 0.5px;
        }

        .status-playing {
          color: #10B981;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .status-paused {
          color: #F59E0B;
        }

        .rec-dot {
          width: 5px;
          height: 5px;
          background: #EF4444;
          border-radius: 50%;
          display: inline-block;
          animation: recBlink 1s infinite alternate;
        }

        @keyframes recBlink {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0.2; transform: scale(0.8); }
        }

        .pocket-tape-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #3D3125;
          border: 2px solid #5C4B3A;
          padding: 0.4rem 0.5rem;
        }

        .pocket-cassette-window {
          height: 32px;
          background: #1F1812;
          border: 1px solid #5C4B3A;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.45rem;
          gap: 0.35rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
        }

        .tape-spool-mini {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px dashed #FAF6EE;
          background: #44372C;
          box-shadow: 0 0 0 1px #1F1812;
        }

        .tape-spool-mini.spinning {
          animation: spin 2.5s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .tape-vu-mini {
          display: flex;
          gap: 2px;
          align-items: flex-end;
          height: 12px;
        }

        .tape-vu-mini .vu-bar {
          width: 3px;
          background: #5C4B3A;
          height: 3px;
          border-radius: 1px;
        }

        .tape-vu-mini.active .vu-bar {
          background: #10B981;
          animation: vuBounce 0.6s infinite alternate ease-in-out;
        }

        .tape-vu-mini.active .bar-1 { animation-delay: 0.05s; }
        .tape-vu-mini.active .bar-2 { animation-delay: 0.15s; }
        .tape-vu-mini.active .bar-3 { animation-delay: 0.25s; }

        @keyframes vuBounce {
          0% { height: 3px; background: #10B981; }
          50% { height: 11px; background: #FBBF24; }
          100% { height: 6px; background: #EF4444; }
        }

        .pocket-track-details {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
          flex: 1;
        }

        .pocket-track-name {
          font-size: 0.54rem;
          color: #FFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pocket-track-time {
          font-size: 0.46rem;
          color: #A3E635;
        }

        .pocket-progress-wrap {
          height: 6px;
          background: #1F1812;
          border: 1px solid #5C4B3A;
          cursor: pointer;
          position: relative;
        }

        .pocket-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #F59E0B, #10B981);
          width: 0%;
          transition: width 0.1s linear;
        }

        .pocket-controls {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr;
          gap: 0.25rem;
        }

        .pocket-btn {
          background: #1F1812;
          border: 2px solid #5C4B3A;
          color: #FAF6EE;
          font-size: 0.5rem;
          padding: 0.35rem 0.15rem;
          cursor: pointer;
          transition: all 0.08s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0 #110D0A;
        }

        .pocket-btn:hover {
          background: #44372C;
          border-color: #F59E0B;
          transform: translate(-1px, -1px);
          box-shadow: 3px 3px 0 #110D0A;
        }

        .pocket-btn:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 #110D0A;
        }

        .pocket-btn-play {
          background: #B45309;
          border-color: #F59E0B;
          color: #FFF;
          font-weight: bold;
        }

        .pocket-btn-play.is-playing {
          background: #065F46;
          border-color: #10B981;
        }

        .pocket-btn-play:hover {
          background: #D97706;
        }

        .pocket-btn-play.is-playing:hover {
          background: #047857;
        }

        .pocket-track-chips {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.25rem;
        }

        .pocket-chip {
          background: #3D3125;
          border: 1px solid #5C4B3A;
          color: #D1C7BD;
          font-size: 0.46rem;
          padding: 0.25rem 0;
          text-align: center;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .pocket-chip:hover {
          background: #5C4B3A;
          color: #FFF;
        }

        .pocket-chip.active {
          background: #F59E0B;
          color: #2A2118;
          border-color: #FBBF24;
          font-weight: bold;
        }

        /* Hobbies */
        .hobbies-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .hobby-item {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          background: #FAF6EE;
          border: 2px solid #2A2118;
          padding: 0.65rem;
        }

        .hobby-icon {
          font-size: 1.4rem;
          line-height: 1;
        }

        .hobby-name {
          font-size: 0.6rem;
          color: #2A2118;
          margin-bottom: 0.2rem;
        }

        .hobby-desc {
          font-size: 0.72rem;
          color: #645648;
          line-height: 1.35;
        }

        /* Movies */
        .movies-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }

        .movie-chip {
          background: #FAF6EE;
          border: 2px solid #2A2118;
          padding: 0.6rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .movie-tag {
          font-size: 0.45rem;
          color: #E11D48;
        }

        .movie-name {
          font-size: 0.75rem;
          color: #2A2118;
        }

        .movie-desc {
          font-size: 0.7rem;
          color: #645648;
          line-height: 1.3;
        }

        @media (max-width: 960px) {
          .world-1-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1.25rem;
          }
          .pocket-cassette-deck {
            width: 100%;
          }
          .intro-grid {
            grid-template-columns: 1fr;
          }
          .character-card {
            width: 100%;
          }
          .hobbies-grid,
          .movies-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
