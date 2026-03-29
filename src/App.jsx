import { useState, useEffect } from 'react'
import Loader       from './components/Loader'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import About        from './components/About'
import SkillsMatrix from './components/SkillsMatrix'
import Projects     from './components/Projects'
import Resume       from './components/Resume'
import Blog         from './components/Blog'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

const SKIP_KEY = 'sonnb_loader_seen'

export default function App() {
  // Skip loader after first visit in this session
  const [showLoader, setShowLoader] = useState(
    () => !sessionStorage.getItem(SKIP_KEY)
  )

  const handleLoaderComplete = () => {
    sessionStorage.setItem(SKIP_KEY, '1')
    setShowLoader(false)
  }

  return (
    <>
      {showLoader && <Loader onComplete={handleLoaderComplete} />}

      {!showLoader && (
        <>
          <Navbar />
          <main>
            <Hero />
            <About />
            <SkillsMatrix />
            <Projects />
            <Resume />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
