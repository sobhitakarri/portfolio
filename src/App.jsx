import { Component, useState, useCallback, useEffect } from 'react'
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

function MainSite({ revealed, ready }) {
  return (
    <>
      <Navbar />
      <div style={{ position: 'relative' }}>
        {ready && <FlightPath />}
        <main style={{
          position: 'relative',
          zIndex: 2,
          opacity: revealed || ready ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          <Hero enter={ready} />
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

class LoaderBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFail() }
  render() { return this.state.failed ? null : this.props.children }
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const onReveal = useCallback(() => setRevealed(true), [])
  const onLand = useCallback(() => setReady(true), [])
  const onLoaderDone = useCallback(() => setLoaderDone(true), [])
  const bailOut = useCallback(() => {
    document.body.style.overflow = ''
    setRevealed(true)
    setReady(true)
    setLoaderDone(true)
  }, [])

  useEffect(() => {
    if (loaderDone) return
    const id = window.setTimeout(bailOut, 6000)
    return () => window.clearTimeout(id)
  }, [loaderDone, bailOut])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {!loaderDone && (
        <LoaderBoundary onFail={bailOut}>
          <Loader onReveal={onReveal} onLand={onLand} onDone={onLoaderDone} />
        </LoaderBoundary>
      )}
      <Routes>
        <Route path="/" element={<MainSite revealed={revealed} ready={ready} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
