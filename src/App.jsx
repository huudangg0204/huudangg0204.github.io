import { useState, useEffect } from 'react'
import RetroHUD from './components/RetroHUD'
import SideRunnerTrack from './components/SideRunnerTrack'
import WorldIntro from './components/WorldIntro'
import WorldSkills from './components/WorldSkills'
import WorldBosses from './components/WorldBosses'
import WorldCastle from './components/WorldCastle'
import Footer from './components/Footer'
import ProjectModal from './components/ProjectModal'

import PixelClouds from './components/PixelClouds'

export default function App() {
  const [activeWorld, setActiveWorld] = useState('1-1 (ORIGIN)')
  const [coins, setCoins] = useState(12)
  const [selectedProject, setSelectedProject] = useState(null)

  const handleAddCoin = () => {
    setCoins(prev => prev + 1)
  }

  // Detect which World is currently scrolled into view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220

      const w4 = document.getElementById('world-4')
      const w3 = document.getElementById('world-3')
      const w2 = document.getElementById('world-2')
      const w1 = document.getElementById('world-1')

      if (w4 && scrollPos >= w4.offsetTop) {
        setActiveWorld('1-4 (CASTLE)')
      } else if (w3 && scrollPos >= w3.offsetTop) {
        setActiveWorld('1-3 (BOSS)')
      } else if (w2 && scrollPos >= w2.offsetTop) {
        setActiveWorld('1-2 (SKILLS)')
      } else {
        setActiveWorld('1-1 (ORIGIN)')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="retro-quest-app">
      {/* Authentic 8-bit Mario Pixel Clouds Parallax Background */}
      <PixelClouds />

      {/* Top Fixed Game HUD */}
      <RetroHUD 
        activeWorld={activeWorld} 
        coins={coins} 
        onCoinClick={handleAddCoin} 
      />

      {/* Fixed Side-Scroller Tracker Dock */}
      <SideRunnerTrack 
        onCollectCoin={handleAddCoin} 
      />

      {/* Main Quest Single-Page Vertical Stream */}
      <main className="quest-main-container">
        {/* World 1: Origin & Bio (Level 1, Bio, Music, Movies, Hobbies) */}
        <WorldIntro onAddCoin={handleAddCoin} />

        {/* World 2: Obstacle Run (Skills Power-ups & Mystery Block) */}
        <WorldSkills onAddCoin={handleAddCoin} />

        {/* World 3: Boss Battle (Major Projects as Defeated Bosses) */}
        <WorldBosses onSelectProject={(project) => setSelectedProject(project)} />

        {/* World 4: Castle Victory (Castle Stage, Flagpole, Contact & CV) */}
        <WorldCastle onAddCoin={handleAddCoin} />
      </main>

      {/* Retro Arcade Footer */}
      <Footer />

      {/* Boss Project Detail Modal */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      <style>{`
        .retro-quest-app {
          min-height: 100vh;
          background: #FAF6EE;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .quest-main-container {
          flex: 1;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 76px 1.5rem 2rem;
          position: relative;
          z-index: 1;
        }

        /* Parallax Clouds styling */
        .cloud-1 {
          top: 15%;
          left: 8%;
          width: 110px;
          height: 32px;
        }

        .cloud-2 {
          top: 45%;
          right: 12%;
          width: 140px;
          height: 38px;
        }

        .cloud-3 {
          top: 75%;
          left: 15%;
          width: 90px;
          height: 28px;
        }

        @media (max-width: 768px) {
          .quest-main-container {
            padding: 68px 1rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
