import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import About        from './components/About'
import Domains      from './components/Domains'
import Projects     from './components/Projects'
import Resume       from './components/Resume'
import Contact      from './components/Contact'
import Footer       from './components/Footer'
import NotFound     from './components/NotFound'
import Loader       from './components/Loader'
import FlightPath   from './components/FlightPath'

function MainSite({ ready }) {
  return (
    <>
      <Navbar />
      <div style={{ position: 'relative' }}>
        <FlightPath />
        <main style={{
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <Hero />
          <About />
          <Domains />
          <Projects />
          <Resume />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaderDone = useCallback(() => setReady(true), [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {!ready && <Loader onDone={onLoaderDone} />}
      <Routes>
        <Route path="/" element={<MainSite ready={ready} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
