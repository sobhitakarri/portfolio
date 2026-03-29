import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ──────────────────────────────────────────────────────────
   PCB Trace Canvas — draws copper traces outward from center
   ────────────────────────────────────────────────────────── */
function PCBCanvas({ onComplete }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const cx = canvas.width  / 2
    const cy = canvas.height / 2
    const GREEN = '#00ff88'
    const DIM   = '#00ff8833'

    // Pre-define trace paths (horizontal + vertical from center)
    const traces = []
    const GRID = 40

    // Horizontal traces
    for (let y = cy % GRID; y < canvas.height; y += GRID) {
      traces.push({ x1: cx, y1: y, x2: canvas.width + 50, y2: y, dir: 'h' })
      traces.push({ x1: cx, y1: y, x2: -50,               y2: y, dir: 'h' })
    }
    // Vertical traces
    for (let x = cx % GRID; x < canvas.width; x += GRID) {
      traces.push({ x1: x, y1: cy, x2: x, y2: canvas.height + 50, dir: 'v' })
      traces.push({ x1: x, y1: cy, x2: x, y2: -50,                dir: 'v' })
    }

    // Vias at intersections
    const vias = []
    for (let x = cx % GRID; x < canvas.width; x += GRID) {
      for (let y = cy % GRID; y < canvas.height; y += GRID) {
        if (Math.random() > 0.6) {
          vias.push({ x, y, r: 3, delay: Math.random() * 800 })
        }
      }
    }

    let start = null
    const DURATION = 1200

    function draw(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / DURATION, 1)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw faint grid
      ctx.strokeStyle = 'rgba(0,255,136,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }

      // Draw traces growing outward
      ctx.shadowColor = GREEN
      ctx.shadowBlur  = 6
      ctx.strokeStyle = GREEN
      ctx.lineWidth   = 1.5

      traces.forEach(t => {
        const len = Math.hypot(t.x2 - t.x1, t.y2 - t.y1)
        const drawn = len * progress

        ctx.beginPath()
        if (t.dir === 'h') {
          const endX = t.x2 > t.x1 ? t.x1 + drawn : t.x1 - drawn
          ctx.moveTo(t.x1, t.y1)
          ctx.lineTo(endX, t.y1)
        } else {
          const endY = t.y2 > t.y1 ? t.y1 + drawn : t.y1 - drawn
          ctx.moveTo(t.x1, t.y1)
          ctx.lineTo(t.x1, endY)
        }
        ctx.stroke()
      })

      // Draw vias
      vias.forEach(v => {
        if (elapsed > v.delay) {
          const pulse = Math.sin((elapsed - v.delay) / 200) * 0.5 + 0.5
          ctx.beginPath()
          ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,255,136,${0.3 + pulse * 0.7})`
          ctx.shadowBlur = 8 * pulse
          ctx.fill()

          // Via ring
          ctx.beginPath()
          ctx.arc(v.x, v.y, v.r + 2, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(0,255,136,${0.2 + pulse * 0.4})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      // SMD component silhouettes
      if (progress > 0.5) {
        const compAlpha = (progress - 0.5) * 2
        const components = [
          { x: cx - 120, y: cy - 80,  w: 20, h: 8,  type: 'resistor' },
          { x: cx + 100, y: cy + 60,  w: 16, h: 16, type: 'cap' },
          { x: cx - 60,  y: cy + 100, w: 24, h: 10, type: 'resistor' },
          { x: cx + 140, y: cy - 50,  w: 14, h: 14, type: 'cap' },
          { x: cx - 150, y: cy + 30,  w: 20, h: 8,  type: 'resistor' },
        ]
        components.forEach(c => {
          ctx.globalAlpha = compAlpha * 0.6
          ctx.fillStyle = '#1a2a1a'
          ctx.strokeStyle = GREEN
          ctx.lineWidth = 0.8
          ctx.shadowBlur = 4

          if (c.type === 'resistor') {
            ctx.fillRect(c.x - c.w/2, c.y - c.h/2, c.w, c.h)
            ctx.strokeRect(c.x - c.w/2, c.y - c.h/2, c.w, c.h)
            // End caps
            ctx.fillStyle = 'rgba(0,255,136,0.3)'
            ctx.fillRect(c.x - c.w/2,         c.y - c.h/2, 4, c.h)
            ctx.fillRect(c.x + c.w/2 - 4,     c.y - c.h/2, 4, c.h)
          } else {
            ctx.beginPath()
            ctx.arc(c.x, c.y, c.w/2, 0, Math.PI * 2)
            ctx.fill()
            ctx.stroke()
          }
          ctx.globalAlpha = 1
        })
      }

      if (progress < 1) {
        requestAnimationFrame(draw)
      } else {
        setTimeout(onComplete, 100)
      }
    }

    requestAnimationFrame(draw)
  }, [onComplete])

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

/* ──────────────────────────────────────────────────────────
   Transistor Layer SVG — MOSFET gate array (VLSI cross-section)
   ────────────────────────────────────────────────────────── */
function TransistorLayer({ progress }) {
  // GDSII Layer structure: Substrate, N-Well, Diffusion, Poly, Metal
  const layers = [
    { id: 'SUB', color: '#050510', label: 'SUBSTRATE', start: 0.0, end: 0.2 },
    { id: 'NWELL', color: 'rgba(0,100,255,0.15)', label: 'N-WELL', start: 0.2, end: 0.4 },
    { id: 'DIFF', color: 'rgba(0,255,136,0.2)', label: 'DIFFUSION', start: 0.4, end: 0.6 },
    { id: 'POLY', color: 'rgba(255,50,80,0.12)', label: 'POLY-GATE', start: 0.6, end: 0.8 },
    { id: 'MET', color: 'rgba(200,180,100,0.5)', label: 'METAL-1', start: 0.8, end: 1.0 },
  ]

  const rows = 6, cols = 10
  const cw = 44, ch = 36

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox={`0 0 ${cols * cw} ${rows * ch}`}
        style={{ width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Substrate */}
        <rect width={cols * cw} height={rows * ch} fill={layers[0].color} />
        
        {/* N-Well Layer */}
        {progress > layers[1].start && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols), c = i % cols
              return <rect key={i} x={c*cw+2} y={r*ch+8} width={cw-4} height={ch-16} fill={layers[1].color} stroke="rgba(0,100,255,0.4)" strokeWidth="0.5" />
            })}
          </motion.g>
        )}

        {/* Diffusion Layer */}
        {progress > layers[2].start && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols), c = i % cols
              return (
                <g key={i}>
                  <rect x={c*cw+4} y={r*ch+10} width={10} height={ch-20} fill={layers[2].color} stroke="rgba(0,255,136,0.5)" strokeWidth="0.5" />
                  <rect x={c*cw+cw-14} y={r*ch+10} width={10} height={ch-20} fill={layers[2].color} stroke="rgba(0,255,136,0.5)" strokeWidth="0.5" />
                </g>
              )
            })}
          </motion.g>
        )}

        {/* Poly Layer */}
        {progress > layers[3].start && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols), c = i % cols
              return <rect key={i} x={c*cw+14} y={r*ch+4} width={cw-28} height={ch-8} fill={layers[3].color} stroke="rgba(255,50,80,0.6)" strokeWidth="1" />
            })}
          </motion.g>
        )}

        {/* Metal Layer */}
        {progress > layers[4].start && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {Array.from({ length: rows * cols }).map((_, i) => {
              const r = Math.floor(i / cols), c = i % cols
              return (
                <g key={i}>
                  <rect x={c*cw+7} y={r*ch+12} width={5} height={4} fill={layers[4].color} stroke="rgba(200,180,100,0.8)" strokeWidth="0.3" rx="0.5" />
                  <rect x={c*cw+cw-11} y={r*ch+12} width={5} height={4} fill={layers[4].color} stroke="rgba(200,180,100,0.8)" strokeWidth="0.3" rx="0.5" />
                  <line x1={c*cw} y1={r*ch+ch/2} x2={c*cw+cw} y2={r*ch+ch/2} stroke="rgba(200,180,100,0.3)" strokeWidth="1.5" />
                </g>
              )
            })}
          </motion.g>
        )}
      </svg>

      {/* GDSII Layer Labels */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {layers.map(layer => (
          <motion.div
            key={layer.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: progress > layer.start ? 0 : -10, opacity: progress > layer.start ? 1 : 0.2 }}
            style={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: progress > layer.start ? '#00ff88' : '#8892a4' }}
          >
            {progress > layer.start ? '●' : '○'} {layer.label}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   IC Chip SVG — QFP package, zooms into die
   ────────────────────────────────────────────────────────── */
function ChipZoom({ phase, zoomProgress }) {
  const scale = 1 + zoomProgress * 8
  const opacity = Math.min(zoomProgress * 3, 1)
  const chipOpacity = Math.max(1 - zoomProgress * 2, 0)

  return (
    <div style={{ position: 'relative', width: 300, height: 300 }}>
      {/* QFP Chip Package */}
      <motion.div
        style={{ position: 'absolute', inset: 0, opacity: chipOpacity }}
        animate={{ scale: scale }}
        transition={{ duration: 0, ease: 'linear' }}
      >
        <svg viewBox="0 0 300 300" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
          {/* Package body */}
          <img
            src="/404-chip.svg"
            alt="Silicon Die"
            style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 10px #00ff8844)' }}
          />
        </svg>
      </motion.div>

      {/* Transistor layout that fades in as we zoom in */}
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          opacity: opacity,
          overflow: 'hidden',
          borderRadius: 4,
        }}
      >
        <TransistorLayer progress={zoomProgress} />
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Boot Sequence Terminal
   ────────────────────────────────────────────────────────── */
const BOOT_LINES = [
  { text: 'BIOS v2.1.0 — Sobhita Chip Inc.', delay: 0,   color: '#8892a4' },
  { text: 'Initializing silicon lattice...... OK', delay: 150, color: '#00ff88' },
  { text: 'Verifying GDSII layer stack....... OK', delay: 300, color: '#00ff88' },
  { text: 'Loading RTL netlist (2847 cells)... OK', delay: 450, color: '#00ff88' },
  { text: 'Running gate-level simulation...... OK', delay: 600, color: '#00ff88' },
  { text: 'CTS: Clock Tree Synthesis.......... OK', delay: 750, color: '#8892a4' },
  { text: 'Verifying setup/hold timings....... PASS', delay: 900, color: '#00ff88' },
  { text: 'Final LVS & DRC check.............. CLEAN', delay: 1050, color: '#00ff88' },
  { text: 'Booting portfolio kernel v1.0.0...', delay: 1200, color: '#7c3aed' },
  { text: '>> SYSTEM READY <<', delay: 1400, color: '#00ff88' },
]

function LogicGatePropagation({ progress, visibleLines }) {
  const gates = [
    { type: 'NOT', x: 20, y: 10 },
    { type: 'AND', x: 80, y: 10 },
    { type: 'XOR', x: 140, y: 10 },
    { type: 'OR',  x: 200, y: 10 },
  ]

  return (
    <div style={{ marginTop: 24, padding: '10px 0', borderTop: '1px solid #1e2030' }}>
      <svg width="240" height="40" viewBox="0 0 240 40">
        {gates.map((g, i) => (
          <g key={i}>
            {/* Connection lines */}
            {i < gates.length - 1 && (
              <line x1={g.x + 30} y1={g.y + 10} x2={gates[i+1].x} y2={gates[i+1].y + 10} stroke="#1e2030" strokeWidth="1" />
            )}
            {/* Logic pulse propagation */}
            {visibleLines.length > i * 2 && (
              <motion.circle
                initial={{ cx: g.x, cy: g.y + 10 }}
                animate={{ cx: gates[i+1] ? gates[i+1].x : g.x + 30 }}
                transition={{ duration: 0.5 }}
                r="3"
                fill="#00ff88"
                style={{ filter: 'drop-shadow(0 0 4px #00ff88)' }}
              />
            )}
            {/* Gate symbol placeholders */}
            <rect x={g.x} y={g.y} width="30" height="20" rx="2" fill="#0f0f1a" stroke="#00ff8844" strokeWidth="1" />
            <text x={g.x + 15} y={g.y + 14} textAnchor="middle" fill="#00ff8888" fontSize="8" fontFamily="JetBrains Mono">
              {g.type}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ color: '#00ff8866', fontSize: '0.65rem', fontFamily: 'JetBrains Mono', marginTop: 4 }}>
        PROPAGATION: {visibleLines.length > 0 ? 'ACTIVE' : 'IDLE'} | CLK: 100MHz
      </div>
    </div>
  )
}

function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timers = []
    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
      }, line.delay))
    })

    // Progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 2
      })
    }, 20)

    timers.push(setTimeout(onComplete, 1600))
    return () => { timers.forEach(clearTimeout); clearInterval(interval) }
  }, [onComplete])

  return (
    <div style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.78rem',
      color: '#8892a4',
      width: 480,
      maxWidth: '90vw',
    }}>
      {visibleLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ color: line.color, padding: '2px 0', lineHeight: 1.6 }}
        >
          {line.text}
        </motion.div>
      ))}

      {/* Logic Gate Propagation Visualizer */}
      <LogicGatePropagation progress={progress} visibleLines={visibleLines} />

      {/* Progress bar */}
      <div style={{ marginTop: 20, background: '#1e2030', height: 4, borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #00ff88, #00cc6a)',
            boxShadow: '0 0 8px #00ff88',
            borderRadius: 2,
            width: `${progress}%`,
          }}
        />
      </div>
      <div style={{ color: '#00ff8888', marginTop: 6, fontSize: '0.7rem' }}>
        {progress < 100 ? `LOADING... ${progress}%` : 'COMPLETE [100%]'}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Main Loader
   ────────────────────────────────────────────────────────── */
export default function Loader({ onComplete }) {
  const [phase, setPhase] = useState(0)
  // 0 = PCB traces, 1 = chip zoom, 2 = boot sequence, 3 = wipe out
  const [zoomProgress, setZoomProgress] = useState(0)
  const [showSkip, setShowSkip] = useState(false)
  const animFrameRef = useRef(null)
  const startTimeRef = useRef(null)

  // Show skip after 1s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1000)
    return () => clearTimeout(t)
  }, [])

  // Zoom animation in phase 1
  useEffect(() => {
    if (phase !== 1) return
    startTimeRef.current = null
    const ZOOM_DURATION = 1300

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const p = Math.min(elapsed / ZOOM_DURATION, 1)
      setZoomProgress(p)
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setTimeout(() => setPhase(2), 200)
      }
    }
    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [phase])

  const handleSkip = () => {
    cancelAnimationFrame(animFrameRef.current)
    setPhase(3)
    setTimeout(onComplete, 600)
  }

  const handlePCBComplete = () => setPhase(1)
  const handleBootComplete = () => {
    setPhase(3)
    setTimeout(onComplete, 700)
  }

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0a0a0f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Phase 0 — PCB Traces */}
          {phase === 0 && <PCBCanvas onComplete={handlePCBComplete} />}

          {/* Phase 1 — Chip Zoom */}
          {phase === 1 && (
            <>
              <PCBCanvas onComplete={() => {}} />
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'relative', zIndex: 10 }}
              >
                <ChipZoom phase={phase} zoomProgress={zoomProgress} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  position: 'relative', zIndex: 10,
                  marginTop: 24,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#00ff8888',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                {zoomProgress < 0.5
                  ? '// zooming to die surface...'
                  : '// transistor layer visible — MOSFET gate array'
                }
              </motion.div>
            </>
          )}

          {/* Phase 2 — Boot Sequence */}
          {phase === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'relative', zIndex: 10,
                background: 'rgba(10,10,15,0.95)',
                border: '1px solid #00ff8833',
                borderRadius: 4,
                padding: '28px 32px',
              }}
            >
              {/* Terminal header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid #1e2030',
              }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff88' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#8892a4', marginLeft: 8 }}>
                  Sobhita — boot sequence
                </span>
              </div>
              <BootSequence onComplete={handleBootComplete} />
            </motion.div>
          )}

          {/* Scanline sweep overlay on phase change */}
          {phase === 0 && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,136,0.01) 3px, rgba(0,255,136,0.01) 4px)',
            }} />
          )}

          {/* Skip button */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleSkip}
                style={{
                  position: 'absolute', bottom: 32, right: 32,
                  background: 'transparent',
                  border: '1px solid #00ff8844',
                  color: '#8892a4',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.target.style.borderColor = '#00ff88'
                  e.target.style.color = '#00ff88'
                }}
                onMouseLeave={e => {
                  e.target.style.borderColor = '#00ff8844'
                  e.target.style.color = '#8892a4'
                }}
              >
                [ SKIP INTRO ]
              </motion.button>
            )}
          </AnimatePresence>

          {/* Corner decorators */}
          {[['top-4 left-4 border-t-2 border-l-2',''], ['top-4 right-4 border-t-2 border-r-2',''], ['bottom-4 left-4 border-b-2 border-l-2',''], ['bottom-4 right-4 border-b-2 border-r-2','']].map(([cls], i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 24, height: 24,
              borderColor: '#00ff8844',
              borderStyle: 'solid',
              borderWidth: 0,
              ...(i === 0 ? { top: 16, left: 16, borderTopWidth: 2, borderLeftWidth: 2 } :
                  i === 1 ? { top: 16, right: 16, borderTopWidth: 2, borderRightWidth: 2 } :
                  i === 2 ? { bottom: 16, left: 16, borderBottomWidth: 2, borderLeftWidth: 2 } :
                            { bottom: 16, right: 16, borderBottomWidth: 2, borderRightWidth: 2 }),
            }} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
