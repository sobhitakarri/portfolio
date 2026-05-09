import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import NotFound     from './components/NotFound'

const SKIP_KEY = 'sonnb_loader_seen'

function MainSite() {
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
