import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const NAME = 'SOBHITA KARRI'
const FINAL_STATE = { 1: 'cad', 8: 'structure' }
const VB_W = 1200
const GROUND = 318
const CAP = 78
const FIRST = 0.25
const STEP = 0.17
const DURATION = 3.9

const clamp01 = v => Math.min(1, Math.max(0, v))
const easeOut = v => 1 - Math.pow(1 - v, 3)

function letterProgress(t, order, final) {
  const s = FIRST + order * STEP
  return {
    cad: easeOut(clamp01((t - s) / 0.35)),
    structure: final === 'cad' ? 0 : easeOut(clamp01((t - s - 0.3) / 0.6)),
    solid: final === 'solid' ? easeOut(clamp01((t - s - 0.85) / 0.55)) : 0,
  }
}

function Letter({ ch, x, w, i, st, final }) {
  const top = GROUND - CAP - 8
  const h = GROUND + 4 - top
  const sY = GROUND + 4 - h * st.structure
  const fY = GROUND + 4 - h * st.solid
  const cadOpacity = final === 'solid' ? st.cad * (1 - st.solid * 0.85) : st.cad

  return (
    <g>
      <defs>
        <clipPath id={`ld-s-${i}`}>
          <rect x={x - 4} y={sY} width={w + 8} height={h * st.structure} />
        </clipPath>
        <clipPath id={`ld-f-${i}`}>
          <rect x={x - 4} y={fY} width={w + 8} height={h * st.solid} />
        </clipPath>
      </defs>

      <text x={x} y={GROUND} className="ld-text ld-cad" style={{ opacity: cadOpacity }}>{ch}</text>

      {st.structure > 0 && (
        <text x={x} y={GROUND} className="ld-text ld-structure" clipPath={`url(#ld-s-${i})`}>{ch}</text>
      )}
      {st.structure > 0.02 && st.structure < 0.98 && (
        <line x1={x - 3} y1={sY} x2={x + w + 3} y2={sY} className="ld-ink-thin" />
      )}

      {st.solid > 0 && (
        <text x={x} y={GROUND} className="ld-text ld-solid" clipPath={`url(#ld-f-${i})`}>{ch}</text>
      )}
      {st.solid > 0.02 && st.solid < 0.98 && (
        <line x1={x - 3} y1={fY} x2={x + w + 3} y2={fY} className="ld-accent" />
      )}

      {final === 'cad' && st.cad > 0 && (
        <g style={{ opacity: st.cad }}>
          <line x1={x} y1={GROUND + 14} x2={x + w} y2={GROUND + 14} className="ld-accent" />
          <line x1={x} y1={GROUND + 10} x2={x} y2={GROUND + 18} className="ld-accent" />
          <line x1={x + w} y1={GROUND + 10} x2={x + w} y2={GROUND + 18} className="ld-accent" />
          <line x1={x + w / 2} y1={top - 4} x2={x + w / 2} y2={GROUND + 4} className="ld-accent ld-dashed" />
          <text x={x + w / 2} y={top - 10} textAnchor="middle" className="ld-label ld-label-accent">CAD</text>
        </g>
      )}
      {final === 'structure' && st.structure > 0.6 && (
        <text x={x + w / 2} y={top - 10} textAnchor="middle" className="ld-label" style={{ opacity: st.structure }}>
          Frame
        </text>
      )}
    </g>
  )
}

function Crane({ x, height, jib, t, phase = 0, flip = false }) {
  const top = GROUND - height
  const m = 5
  let mast = ''
  for (let y = GROUND; y > top; y -= 14) {
    const y2 = Math.max(top, y - 14)
    mast += `M ${-m} ${y} L ${m} ${y2} `
  }
  let boom = ''
  for (let bx = -jib * 0.32; bx < jib; bx += 12) {
    boom += `M ${bx} ${top + 6} L ${bx + 6} ${top} L ${bx + 12} ${top + 6} `
  }
  const trolley = jib * (0.3 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.9 + phase)))
  const hookY = top + 26 + 64 * (0.5 + 0.5 * Math.sin(t * 1.4 + phase * 1.7))

  return (
    <g transform={`translate(${x} 0)${flip ? ' scale(-1 1)' : ''}`} className="ld-ink">
      <line x1={-m} y1={GROUND} x2={-m} y2={top} />
      <line x1={m} y1={GROUND} x2={m} y2={top} />
      <path d={mast} className="ld-ink-thin" />
      <path d={`M ${-m} ${top} L 0 ${top - 22} L ${m} ${top}`} />
      <line x1={-jib * 0.32} y1={top} x2={jib} y2={top} />
      <line x1={-jib * 0.32} y1={top + 6} x2={jib} y2={top + 6} />
      <path d={boom} className="ld-ink-thin" />
      <line x1={0} y1={top - 22} x2={jib * 0.8} y2={top} className="ld-ink-thin" />
      <line x1={0} y1={top - 22} x2={-jib * 0.3} y2={top} className="ld-ink-thin" />
      <rect x={-jib * 0.32} y={top + 6} width={18} height={12} className="ld-fill" />
      <rect x={m} y={top + 6} width={10} height={9} />
      <rect x={trolley - 4} y={top + 5} width={8} height={4} className="ld-fill" />
      <line x1={trolley} y1={top + 9} x2={trolley} y2={hookY} className="ld-ink-thin" />
      <rect x={trolley - 12} y={hookY} width={24} height={4} className="ld-accent-fill" />
    </g>
  )
}

function Arm({ x, t, phase = 0, flip = false }) {
  const a1 = -68 + 16 * Math.sin(t * 1.6 + phase)
  const a2 = 58 + 24 * Math.sin(t * 2.1 + phase + 1)
  const spark = Math.sin(t * 13 + phase) > 0.55 ? 1 : 0.15

  return (
    <g transform={`translate(${x} ${GROUND})${flip ? ' scale(-1 1)' : ''}`}>
      <rect x={-14} y={-6} width={28} height={6} className="ld-fill" />
      <rect x={-6} y={-14} width={12} height={8} className="ld-ink" />
      <g transform={`translate(0 -14) rotate(${a1})`}>
        <line x1={0} y1={0} x2={46} y2={0} className="ld-ink-thick" />
        <circle r={4} className="ld-joint" />
        <g transform={`translate(46 0) rotate(${a2})`}>
          <line x1={0} y1={0} x2={36} y2={0} className="ld-ink-thick" />
          <circle r={3} className="ld-joint" />
          <g transform="translate(36 0)">
            <path d="M 0 -4 L 8 -4 M 0 4 L 8 4" className="ld-ink" />
            <circle cx={11} r={2.4} className="ld-accent-fill" style={{ opacity: spark }} />
          </g>
        </g>
      </g>
    </g>
  )
}

function Conveyor({ t, x1, x2 }) {
  const y = GROUND + 34
  const len = x2 - x1
  const speed = 70
  const gap = 140
  const rollers = []
  for (let rx = x1 + 8; rx <= x2 - 8; rx += 48) rollers.push(rx)
  const boxes = []
  for (let k = 0; k * gap < len + gap; k++) {
    const bx = x1 + ((k * gap + t * speed) % (len + gap)) - gap
    if (bx < x1 + 4 || bx > x2 - 22) continue
    const bw = 12 + (k % 3) * 4
    const bh = 8 + (k % 2) * 4
    boxes.push(
      <rect
        key={k}
        x={bx}
        y={y - 6 - bh}
        width={bw}
        height={bh}
        className={k % 4 === 1 ? 'ld-accent-fill' : k % 2 ? 'ld-fill' : 'ld-ink'}
      />
    )
  }

  return (
    <g>
      <path
        d={`M ${x1} ${y - 6} L ${x2} ${y - 6} A 6 6 0 0 1 ${x2} ${y + 6} L ${x1} ${y + 6} A 6 6 0 0 1 ${x1} ${y - 6}`}
        className="ld-ink"
      />
      <line
        x1={x1}
        y1={y - 6}
        x2={x2}
        y2={y - 6}
        className="ld-accent"
        style={{ strokeDasharray: '4 14', strokeDashoffset: -t * speed }}
      />
      {rollers.map(rx => (
        <g key={rx} transform={`translate(${rx} ${y}) rotate(${(t * speed * 57.3) / 4.5})`}>
          <circle r={4.5} className="ld-ink-thin" />
          <line x1={-4.5} y1={0} x2={4.5} y2={0} className="ld-ink-thin" />
        </g>
      ))}
      {rollers.filter((_, i) => i % 4 === 0).map(rx => (
        <line key={`leg-${rx}`} x1={rx} y1={y + 6} x2={rx} y2={y + 22} className="ld-ink-thin" />
      ))}
      {boxes}
    </g>
  )
}

function SurveyDrone({ x, y, t, width }) {
  const bob = Math.sin(t * 2.2) * 4
  const sweep = Math.sin(t * 1.8) * width * 0.35
  return (
    <g transform={`translate(${x} ${y + bob})`}>
      <path
        d={`M 0 6 L ${sweep - 10} ${GROUND - y - bob - 4} L ${sweep + 10} ${GROUND - y - bob - 4} Z`}
        className="ld-scan"
      />
      <line x1={-12} y1={0} x2={12} y2={0} className="ld-ink" />
      <rect x={-5} y={-2} width={10} height={6} className="ld-fill" />
      <ellipse cx={-12} cy={-2} rx={6} ry={1.6} className="ld-accent" />
      <ellipse cx={12} cy={-2} rx={6} ry={1.6} className="ld-accent" />
    </g>
  )
}

export default function Loader({ onDone }) {
  const [t, setT] = useState(0)
  const [layout, setLayout] = useState(null)
  const [leaving, setLeaving] = useState(false)
  const measureRef = useRef(null)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    setTimeout(() => {
      document.body.style.overflow = ''
      onDone?.()
    }, 650)
  }, [onDone])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') finish() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [finish])

  useLayoutEffect(() => {
    let cancelled = false
    const measure = () => {
      const el = measureRef.current
      if (!el || cancelled) return
      const total = el.getComputedTextLength()
      const offset = (VB_W - total) / 2
      const letters = [...NAME].map((ch, i) => {
        const start = el.getStartPositionOfChar(i).x
        const end = el.getEndPositionOfChar(i).x
        return { ch, x: offset + start, w: end - start }
      })
      setLayout({ letters, left: offset, width: total })
    }
    const timeout = setTimeout(measure, 900)
    document.fonts?.ready.then(() => {
      clearTimeout(timeout)
      measure()
    })
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  useEffect(() => {
    if (!layout) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(DURATION)
      const id = setTimeout(finish, 700)
      return () => clearTimeout(id)
    }
    let raf = 0
    const t0 = performance.now()
    const tick = () => {
      const s = (performance.now() - t0) / 1000
      setT(s)
      if (s >= DURATION + 0.45) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [layout, finish])

  const letters = layout?.letters ?? []
  let order = 0
  const built = letters.map((l, i) => {
    if (l.ch === ' ') return null
    const final = FINAL_STATE[i] ?? 'solid'
    const st = letterProgress(t, order++, final)
    return { ...l, i, final, st }
  }).filter(Boolean)

  const doneCount = built.filter(b =>
    b.final === 'solid' ? b.st.solid >= 1 : b.final === 'structure' ? b.st.structure >= 1 : b.st.cad >= 1
  ).length
  const progress = clamp01(t / DURATION)

  const left = layout?.left ?? 195
  const width = layout?.width ?? 810
  const at = (i, f = 0.5) => (letters[i] ? letters[i].x + letters[i].w * f : left + (width * i) / NAME.length)
  const cadLetter = letters[1]

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onClick={finish}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-void)',
        color: 'var(--text-bright)',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        cursor: 'pointer',
      }}
    >
      <div style={{
        height: 'var(--nav-h)',
        padding: '0 var(--section-px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Inter Tight, sans-serif',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.18em' }}>Sobhita Karri</span>
        <span style={{ color: 'var(--text-muted)' }}>Skip →</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 var(--section-px)',
        minHeight: 0,
      }}>
        <svg
          viewBox={`${left - 130} 20 ${width + 260} 380`}
          style={{ width: '100%', maxWidth: 1100, height: 'auto', maxHeight: '100%', overflow: 'visible' }}
          aria-label="Building Sobhita Karri"
          role="img"
        >
          <defs>
            <pattern id="ld-scaffold" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M 0 0 H 12 M 0 0 V 12 M 0 12 L 12 0" className="ld-ink-thin" />
            </pattern>
          </defs>

          <text ref={measureRef} x={0} y={-2000} className="ld-text" style={{ visibility: 'hidden' }}>
            {NAME}
          </text>

          {Array.from({ length: Math.ceil((width + 260) / 80) + 1 }, (_, k) => {
            const gx = left - 130 + k * 80
            return <line key={gx} x1={gx} y1={40} x2={gx} y2={GROUND} className="ld-grid" />
          })}
          <line x1={left - 130} y1={GROUND - 200} x2={left + width + 130} y2={GROUND - 200} className="ld-grid ld-dashed" />
          <text x={left - 124} y={GROUND - 206} className="ld-label">LVL +24.0</text>

          <Crane x={at(2, 0.6)} height={250} jib={210} t={t} phase={0} />
          <Crane x={at(10, 0.4)} height={280} jib={240} t={t} phase={2.1} flip />

          {built.map(b => (
            <Letter key={b.i} ch={b.ch} x={b.x} w={b.w} i={b.i} st={b.st} final={b.final} />
          ))}

          {cadLetter && (
            <SurveyDrone x={cadLetter.x + cadLetter.w / 2} y={GROUND - CAP - 70} t={t} width={cadLetter.w} />
          )}

          <Arm x={left - 60} t={t} phase={0.4} />
          <Arm x={left + width + 60} t={t} phase={1.9} flip />

          <line x1={left - 130} y1={GROUND} x2={left + width + 130} y2={GROUND} className="ld-ink" />
          {Array.from({ length: Math.ceil((width + 260) / 40) + 1 }, (_, k) => {
            const gx = left - 130 + k * 40
            return <line key={`tick-${gx}`} x1={gx} y1={GROUND} x2={gx} y2={GROUND + 4} className="ld-ink-thin" />
          })}

          <Conveyor t={t} x1={left - 120} x2={left + width + 120} />

          <text x={left - 124} y={GROUND + 72} className="ld-label">Grid A-01</text>
          <text x={left + width + 124} y={GROUND + 72} textAnchor="end" className="ld-label">Elev ±0.00</text>
        </svg>
      </div>

      <div style={{ padding: '0 var(--section-px) 32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 14,
        }}>
          <div className="type-xs" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            Site 01 · Constructing identity
            <span style={{ width: 6, height: 6, background: 'var(--accent)', display: 'inline-block' }} />
          </div>

          <div className="type-xs" style={{ display: 'flex', gap: 18, letterSpacing: '0.1em' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, border: '1px dashed var(--accent)' }} /> CAD
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{
                width: 8, height: 8, border: '1px solid var(--text-bright)',
                backgroundImage: 'linear-gradient(45deg, transparent 45%, var(--text-bright) 45%, var(--text-bright) 55%, transparent 55%)',
              }} /> Structure
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, background: 'var(--text-bright)' }} /> Built
            </span>
          </div>

          <div style={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '0.8rem',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--text-bright)',
          }}>
            {String(doneCount).padStart(2, '0')} / {String(built.length || 12).padStart(2, '0')}
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: '100%',
            background: 'var(--accent)',
            transform: `scaleX(${progress})`,
            transformOrigin: 'left',
          }} />
        </div>
      </div>
    </motion.div>
  )
}
