import { useEffect, useRef, useState } from 'react'

function buildPath(w, h, vh) {
  const startX = w * 0.05
  const startY = Math.min(vh * 0.62, h)
  const rowH = Math.max(420, Math.min(760, vh * 0.85))
  const left = w * (w < 640 ? 0.1 : 0.07)
  const right = w * (w < 640 ? 0.9 : 0.93)

  let x = startX
  let y = startY
  let d = `M ${x} ${y}`
  const waypoints = []
  let toRight = true

  while (y < h - 60) {
    const ny = Math.min(h - 60, y + rowH)
    const seg = ny - y
    const nx = toRight ? right : left
    const c1 = waypoints.length === 0 ? [w * 0.35, y] : [x, y + seg * 0.55]
    const c2 = [nx, ny - seg * 0.55]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${nx} ${ny}`
    waypoints.push({ x: nx, y: ny })
    x = nx
    y = ny
    toRight = !toRight
  }

  return { w, h, d, waypoints }
}

export default function FlightPath() {
  const rootRef = useRef(null)
  const drawnRef = useRef(null)
  const droneRef = useRef(null)
  const tagRef = useRef(null)
  const wpRefs = useRef([])
  const [geo, setGeo] = useState(null)

  useEffect(() => {
    const parent = rootRef.current?.parentElement
    if (!parent) return

    let last = ''
    const build = () => {
      const w = parent.clientWidth
      const h = parent.offsetHeight
      const key = `${w}x${h}x${window.innerHeight}`
      if (key === last || !w || !h) return
      last = key
      setGeo(buildPath(w, h, window.innerHeight))
    }

    build()
    const ro = new ResizeObserver(build)
    ro.observe(parent)
    window.addEventListener('resize', build)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', build)
    }
  }, [])

  useEffect(() => {
    if (!geo) return
    const path = drawnRef.current
    const drone = droneRef.current
    if (!path || !drone) return

    const total = path.getTotalLength()
    const samples = []
    for (let l = 0; l <= total; l += 4) {
      const p = path.getPointAtLength(l)
      samples.push([l, p.y])
    }
    path.style.strokeDasharray = `${total} ${total}`

    const lengthAtY = (ty) => {
      if (ty <= samples[0][1]) return 0
      const lastSample = samples[samples.length - 1]
      if (ty >= lastSample[1]) return lastSample[0]
      let lo = 0
      let hi = samples.length - 1
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (samples[mid][1] < ty) lo = mid + 1
        else hi = mid
      }
      const [l1, y1] = samples[Math.max(0, lo - 1)]
      const [l2, y2] = samples[lo]
      const f = y2 === y1 ? 0 : (ty - y1) / (y2 - y1)
      return l1 + (l2 - l1) * f
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cur = null
    let lastWritten = -1
    let raf = 0

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const rect = rootRef.current.getBoundingClientRect()
      const target = lengthAtY(window.innerHeight * 0.55 - rect.top)
      cur = cur == null || reduce ? target : cur + (target - cur) * 0.09
      if (Math.abs(cur - lastWritten) < 0.2) return
      lastWritten = cur

      path.style.strokeDashoffset = `${total - cur}`
      const p = path.getPointAtLength(cur)
      const ahead = path.getPointAtLength(Math.min(total, cur + 8))
      const behind = path.getPointAtLength(Math.max(0, cur - 8))
      const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * (180 / Math.PI)

      drone.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`)
      tagRef.current?.setAttribute('transform', `translate(${p.x + 26} ${p.y - 22})`)

      geo.waypoints.forEach((wp, i) => {
        wpRefs.current[i]?.classList.toggle('passed', p.y >= wp.y - 2)
      })
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [geo])

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: geo?.h ?? 0,
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {geo && (
        <svg
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          style={{ display: 'block' }}
        >
          <path d={geo.d} className="fp-corridor" />
          <path ref={drawnRef} d={geo.d} className="fp-drawn" />

          {geo.waypoints.map((wp, i) => (
            <g key={i} ref={el => { wpRefs.current[i] = el }} className="fp-wp">
              <circle cx={wp.x} cy={wp.y} r={4} />
              <text
                x={wp.x + (wp.x > geo.w / 2 ? -12 : 12)}
                y={wp.y + 3}
                textAnchor={wp.x > geo.w / 2 ? 'end' : 'start'}
                className="fp-label"
              >
                WP-{String(i + 1).padStart(2, '0')}
              </text>
            </g>
          ))}

          <g ref={droneRef}>
            <circle r={22} className="fp-halo" />
            <line x1={-12} y1={-12} x2={12} y2={12} className="fp-arm" />
            <line x1={-12} y1={12} x2={12} y2={-12} className="fp-arm" />
            {[[-12, -12], [12, -12], [-12, 12], [12, 12]].map(([cx, cy]) => (
              <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={7} className="fp-rotor" />
            ))}
            <rect x={-6} y={-5} width={12} height={10} rx={2} className="fp-body" />
            <path d="M 7 -3 L 12 0 L 7 3 Z" className="fp-nose" />
          </g>

          <g ref={tagRef}>
            <text className="fp-label fp-tag">UAV-01</text>
          </g>
        </svg>
      )}
    </div>
  )
}
