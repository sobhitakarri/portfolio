import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAME = 'SOBHITA KARRI'
const VB_W = 1200
const GROUND = 318
const CAP = 78
const DURATION = 2.7
const SYNC_MS = 1100
const ease = [0.22, 1, 0.36, 1]

// Only a few letters are printed by a mechanism; the rest drop in under gravity
const JOBS = [
  { i: 0, tool: 'pulley', t0: 1.1 },     // S — trolley pulley + counterweight
  { i: 2, tool: 'arm2r', t0: 0.15 },     // B — ceiling-mounted 2R arm
  { i: 5, tool: 'gantry', t0: 0.4 },     // T — XZ gantry
  { i: 8, tool: 'ballistic', t0: 0.65 }, // K — ballistic droplets
  { i: 10, tool: 'fivebar', t0: 0.9 },   // R — five-bar linkage
]
const ROWS = 7
const MOVE = 0.2
const PRINT = 1.05
const G = 1400        // px/s²
const FLIGHT = 0.34   // s, droplet time of flight
const DROP_DT = 0.035 // s, droplet emission interval
const DROP_H = 70     // px, letter drop height
const RESTITUTION = 0.32
const MOTION = 1.15   // pace of background site machines

const clamp01 = v => Math.min(1, Math.max(0, v))
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, u) => a + (b - a) * u
const minJerk = u => u * u * u * (10 - 15 * u + 6 * u * u)

function letterBox(l) {
  const yb = GROUND + 4
  const h = CAP + 10
  return { x0: l.x - 3, x1: l.x + l.w + 3, yb, rowH: h / ROWS }
}

/** Boustrophedon raster through a letter box, parametrised by arc length */
function rasterPoint(box, s) {
  const W = box.x1 - box.x0
  const total = ROWS * W + (ROWS - 1) * box.rowH
  let d = clamp01(s) * total
  for (let r = 0; r < ROWS; r++) {
    const y = box.yb - (r + 0.5) * box.rowH
    const ltr = r % 2 === 0
    if (d <= W) return { x: ltr ? box.x0 + d : box.x1 - d, y, r, f: d / W }
    d -= W
    if (r < ROWS - 1) {
      if (d <= box.rowH) return { x: ltr ? box.x1 : box.x0, y: y - d, r, f: 1 }
      d -= box.rowH
    }
  }
  const r = ROWS - 1
  return { x: r % 2 === 0 ? box.x1 : box.x0, y: box.yb - (r + 0.5) * box.rowH, r, f: 1 }
}

/** Approach (min-jerk) → raster print → retract (min-jerk) */
function pathAt(plan, t) {
  const { t0, box, rest } = plan
  const a1 = t0 + MOVE
  const p1 = a1 + PRINT
  const r1 = p1 + MOVE
  const s = clamp01((t - a1) / PRINT)
  let pt
  let printing = false
  if (t < t0) pt = rest
  else if (t < a1) {
    const u = minJerk((t - t0) / MOVE)
    const q = rasterPoint(box, 0)
    pt = { x: lerp(rest.x, q.x, u), y: lerp(rest.y, q.y, u) }
  } else if (t < p1) {
    pt = rasterPoint(box, s)
    printing = true
  } else if (t < r1) {
    const u = minJerk((t - p1) / MOVE)
    const q = rasterPoint(box, 1)
    pt = { x: lerp(q.x, rest.x, u), y: lerp(q.y, rest.y, u) }
  } else pt = rest
  return { x: pt.x, y: pt.y, printing, s }
}

/** Central-difference acceleration of the end-effector, px/s² (SVG y down) */
function accAt(plan, t) {
  const h = 0.012
  const a = pathAt(plan, t - h)
  const b = pathAt(plan, t)
  const c = pathAt(plan, t + h)
  return { x: (a.x - 2 * b.x + c.x) / (h * h), y: (a.y - 2 * b.y + c.y) / (h * h) }
}

/** Free fall from DROP_H, then damped bounces (coefficient of restitution) */
function dropOffset(tau) {
  if (tau <= 0) return { y: -DROP_H, visible: false }
  const tf = Math.sqrt((2 * DROP_H) / G)
  if (tau < tf) return { y: -DROP_H + 0.5 * G * tau * tau, visible: true }
  let t = tau - tf
  let v = G * tf * RESTITUTION
  for (let k = 0; k < 3; k++) {
    const dur = (2 * v) / G
    if (t < dur) return { y: -(v * t - 0.5 * G * t * t), visible: true }
    t -= dur
    v *= RESTITUTION
  }
  return { y: 0, visible: true, landed: true }
}

/* ─────────────── primitives ─────────────── */

function arrowHead(x, y, ang, cls = 'ld-accent-fill') {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d="M 0 0 L -7 -3.5 L -7 3.5 Z" className={cls} />
    </g>
  )
}

function Vec({ x1, y1, x2, y2, label, accent = true }) {
  if (Math.hypot(x2 - x1, y2 - y1) < 4) return null
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={accent ? 'ld-accent' : 'ld-ink'} />
      {arrowHead(x2, y2, ang, accent ? 'ld-accent-fill' : 'ld-fill')}
      {label && (
        <text
          x={x2 + 4}
          y={y2 - 4}
          className={accent ? 'ld-label ld-label-accent' : 'ld-label'}
          style={{ textTransform: 'none', fontStyle: 'italic' }}
        >
          {label}
        </text>
      )}
    </g>
  )
}

/** Free-body-diagram layer — thinner and slightly faded so forces read as annotation */
function Fbd({ children }) {
  return <g className="ld-fbd" style={{ opacity: 0.85 }}>{children}</g>
}

function Nozzle({ p, printing }) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={3.2} className="ld-accent-fill" />
      {printing && <circle cx={p.x} cy={p.y} r={7} className="ld-accent" style={{ opacity: 0.5 }} />}
    </g>
  )
}

/* ─────────────── physics builders ─────────────── */

/** Ceiling-mounted 2R arm — analytic IK, elbow chosen away from the letter */
function Arm2R({ geo, p, printing }) {
  const { base, L1, L2 } = geo
  let dx = p.x - base.x
  let dy = p.y - base.y
  const n = Math.hypot(dx, dy) || 1
  const d = clamp(n, Math.abs(L1 - L2) + 0.5, L1 + L2 - 0.5)
  dx *= d / n
  dy *= d / n
  const c2 = clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1)
  const q = Math.acos(c2)
  const sols = [q, -q].map(q2 => {
    const q1 = Math.atan2(dy, dx) - Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2))
    return { ex: base.x + L1 * Math.cos(q1), ey: base.y + L1 * Math.sin(q1) }
  })
  const s = sols[0].ex < sols[1].ex ? sols[0] : sols[1]
  const tip = { x: base.x + dx, y: base.y + dy }
  // FBD: link weights at centres of mass, base reaction carries the total
  const m1 = { x: (base.x + s.ex) / 2, y: (base.y + s.ey) / 2 }
  const m2 = { x: (s.ex + tip.x) / 2, y: (s.ey + tip.y) / 2 }
  return (
    <g>
      <line x1={base.x - 22} y1={base.y - 6} x2={base.x + 22} y2={base.y - 6} className="ld-ink" />
      <rect x={base.x - 9} y={base.y - 6} width={18} height={6} className="ld-fill" />
      <line x1={base.x} y1={base.y} x2={s.ex} y2={s.ey} className="ld-ink-thick" />
      <line x1={s.ex} y1={s.ey} x2={tip.x} y2={tip.y} className="ld-ink-thick" />
      <circle cx={base.x} cy={base.y} r={4.5} className="ld-joint" />
      <circle cx={s.ex} cy={s.ey} r={3.8} className="ld-joint" />
      <Fbd>
        <Vec x1={m1.x} y1={m1.y} x2={m1.x} y2={m1.y + 18} label="m₁g" accent={false} />
        <Vec x1={m2.x} y1={m2.y} x2={m2.x} y2={m2.y + 18} label="m₂g" accent={false} />
        <Vec x1={base.x} y1={base.y} x2={base.x} y2={base.y - 26} label="R" />
      </Fbd>
      <Nozzle p={tip} printing={printing} />
      <text x={base.x + 28} y={base.y - 2} className="ld-label ld-label-accent">2R · IK</text>
    </g>
  )
}

/** Moving trolley pulley + fixed end pulley + counterweight; rope length is conserved */
function Pulley({ geo, plan, t, p, printing }) {
  const { railY, x0, x1, L } = geo
  const r = 7
  const wy = railY + 10
  const ey = railY + 10
  const wx = p.x + r
  const cwY = clamp(ey + L - (p.y - wy) - (x1 - wx), ey + 14, GROUND - 24)
  const a = accAt(plan, t)
  // Head: ΣF_y = mg − T = m·a_y  →  T/mg = 1 − a_y/g
  const tRatio = clamp(1 - a.y / G, 0.2, 2)
  const k = 24
  return (
    <g>
      <line x1={x0} y1={railY} x2={x1 + 10} y2={railY} className="ld-ink" />
      <line x1={x0} y1={railY + 4} x2={x1 + 10} y2={railY + 4} className="ld-ink-thin" />
      <rect x={wx - 10} y={railY - 6} width={20} height={8} className="ld-fill" />
      <circle cx={wx} cy={wy} r={r} className="ld-joint" />
      <circle cx={x1} cy={ey} r={r} className="ld-joint" />
      <line x1={p.x} y1={wy} x2={p.x} y2={p.y - 8} className="ld-ink-thin" />
      <line x1={wx} y1={wy - r} x2={x1} y2={ey - r} className="ld-ink-thin" />
      <line x1={x1 + r} y1={ey} x2={x1 + r} y2={cwY} className="ld-ink-thin" />
      <rect x={p.x - 6} y={p.y - 8} width={12} height={6} className="ld-ink" />
      <rect x={x1 + r - 8} y={cwY} width={16} height={18} className="ld-fill" />
      <Fbd>
        <Vec x1={p.x + 10} y1={p.y - 6} x2={p.x + 10} y2={p.y - 6 - k * tRatio} label="T" />
        <Vec x1={p.x + 10} y1={p.y} x2={p.x + 10} y2={p.y + k} label="mg" accent={false} />
        <Vec x1={x1 + r + 12} y1={cwY} x2={x1 + r + 12} y2={cwY - k * tRatio} label="T" />
        <Vec x1={x1 + r + 12} y1={cwY + 18} x2={x1 + r + 12} y2={cwY + 18 + k} label="Mg" accent={false} />
      </Fbd>
      <Nozzle p={p} printing={printing} />
      <text x={x0} y={railY - 10} className="ld-label ld-label-accent">PULLEY · ΣL = const</text>
    </g>
  )
}

/** Cartesian gantry — prismatic X on rail, prismatic Z */
function Gantry({ geo, plan, t, p, printing }) {
  const { railY, x0, x1 } = geo
  const a = accAt(plan, t)
  // Carriage: N balances mg, drive force F = m·aₓ
  const fx = clamp(a.x / G, -1.4, 1.4) * 24
  return (
    <g>
      <line x1={x0} y1={railY} x2={x1} y2={railY} className="ld-ink" />
      <line x1={x0} y1={railY + 5} x2={x1} y2={railY + 5} className="ld-ink-thin" />
      <rect x={p.x - 11} y={railY - 6} width={22} height={13} className="ld-fill" />
      <line x1={p.x} y1={railY + 7} x2={p.x} y2={p.y - 6} className="ld-ink-thick" />
      <path d={`M ${p.x - 5} ${p.y - 6} L ${p.x + 5} ${p.y - 6} L ${p.x} ${p.y} Z`} className="ld-ink" />
      <Fbd>
        <Vec x1={p.x - 16} y1={railY - 6} x2={p.x - 16} y2={railY - 30} label="N" />
        <Vec x1={p.x + 16} y1={railY + 7} x2={p.x + 16} y2={railY + 31} label="mg" accent={false} />
        <Vec x1={p.x} y1={railY - 12} x2={p.x + fx} y2={railY - 12} label="F=maₓ" />
      </Fbd>
      <Nozzle p={p} printing={printing} />
      <text x={x1 + 6} y={railY + 4} className="ld-label ld-label-accent">XZ</text>
    </g>
  )
}

/** Ballistic deposition — droplets on exact parabolas landing on the raster point */
function Ballistic({ geo, plan, t, p, printing }) {
  const { L } = geo
  const drops = []
  const first = Math.ceil(t / DROP_DT) * DROP_DT
  for (let tl = first; tl <= t + FLIGHT; tl += DROP_DT) {
    const q = pathAt(plan, tl)
    if (!q.printing) continue
    const u = t - (tl - FLIGHT)
    const v0x = (q.x - L.x) / FLIGHT
    const v0y = (q.y - L.y - 0.5 * G * FLIGHT * FLIGHT) / FLIGHT
    drops.push({ x: L.x + v0x * u, y: L.y + v0y * u + 0.5 * G * u * u, v0x, v0y })
  }
  const next = drops[drops.length - 1]
  const barrel = next ? Math.atan2(next.v0y, next.v0x) : -Math.PI / 2
  return (
    <g>
      {drops.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={2} className="ld-accent-fill" />
      ))}
      <rect x={L.x - 10} y={GROUND - 5} width={20} height={5} className="ld-fill" />
      <line
        x1={L.x}
        y1={L.y}
        x2={L.x + Math.cos(barrel) * 20}
        y2={L.y + Math.sin(barrel) * 20}
        className="ld-ink-thick"
      />
      <circle cx={L.x} cy={L.y} r={3.5} className="ld-joint" />
      {printing && <circle cx={p.x} cy={p.y} r={5} className="ld-accent" style={{ opacity: 0.6 }} />}
      {next && (
        <Fbd>
          <Vec
            x1={drops[drops.length >> 1].x}
            y1={drops[drops.length >> 1].y}
            x2={drops[drops.length >> 1].x}
            y2={drops[drops.length >> 1].y + 22}
            label="mg"
            accent={false}
          />
          <Vec x1={L.x} y1={L.y} x2={L.x - Math.cos(barrel) * 18} y2={L.y - Math.sin(barrel) * 18} label="recoil" />
        </Fbd>
      )}
      <text x={L.x} y={GROUND + 16} textAnchor="middle" className="ld-label ld-label-accent">g</text>
    </g>
  )
}

function circleElbow(B, P, a, b) {
  const dx = P.x - B.x
  const dy = P.y - B.y
  const n = Math.hypot(dx, dy) || 1
  const d = clamp(n, Math.abs(a - b) + 0.5, a + b - 0.5)
  const ux = dx / n
  const uy = dy / n
  const l = (a * a - b * b + d * d) / (2 * d)
  const h = Math.sqrt(Math.max(0, a * a - l * l))
  const mx = B.x + ux * l
  const my = B.y + uy * l
  const e1 = { x: mx - uy * h, y: my + ux * h }
  const e2 = { x: mx + uy * h, y: my - ux * h }
  return e1.y < e2.y ? e1 : e2
}

/** Five-bar parallel linkage — closed-loop IK by circle intersection */
function FiveBar({ geo, p, printing }) {
  const { B1, B2, a, b } = geo
  const E1 = circleElbow(B1, p, a, b)
  const E2 = circleElbow(B2, p, a, b)
  // Distal links are two-force members: F₁û₁ + F₂û₂ + mg = 0 at the tip
  const n1 = Math.hypot(E1.x - p.x, E1.y - p.y) || 1
  const n2 = Math.hypot(E2.x - p.x, E2.y - p.y) || 1
  const u1 = { x: (E1.x - p.x) / n1, y: (E1.y - p.y) / n1 }
  const u2 = { x: (E2.x - p.x) / n2, y: (E2.y - p.y) / n2 }
  const det = u1.x * u2.y - u2.x * u1.y || 1e-6
  const F1 = clamp(u2.x / det, -2, 2)
  const F2 = clamp(-u1.x / det, -2, 2)
  const k = 22
  return (
    <g>
      <line x1={B1.x} y1={B1.y} x2={B2.x} y2={B2.y} className="ld-ink-thin" />
      <line x1={B1.x} y1={B1.y} x2={E1.x} y2={E1.y} className="ld-ink-thick" />
      <line x1={B2.x} y1={B2.y} x2={E2.x} y2={E2.y} className="ld-ink-thick" />
      <line x1={E1.x} y1={E1.y} x2={p.x} y2={p.y} className="ld-ink" />
      <line x1={E2.x} y1={E2.y} x2={p.x} y2={p.y} className="ld-ink" />
      <circle cx={B1.x} cy={B1.y} r={4} className="ld-joint" />
      <circle cx={B2.x} cy={B2.y} r={4} className="ld-joint" />
      <circle cx={E1.x} cy={E1.y} r={3.2} className="ld-joint" />
      <circle cx={E2.x} cy={E2.y} r={3.2} className="ld-joint" />
      <Fbd>
        <Vec x1={p.x} y1={p.y} x2={p.x + u1.x * F1 * k} y2={p.y + u1.y * F1 * k} label="F₁" />
        <Vec x1={p.x} y1={p.y} x2={p.x + u2.x * F2 * k} y2={p.y + u2.y * F2 * k} label="F₂" />
        <Vec x1={p.x} y1={p.y} x2={p.x} y2={p.y + k} label="mg" accent={false} />
      </Fbd>
      <Nozzle p={p} printing={printing} />
      <text x={(B1.x + B2.x) / 2} y={GROUND + 16} textAnchor="middle" className="ld-label ld-label-accent">5-BAR</text>
    </g>
  )
}

/* ─────────────── background site (lighter layer) ─────────────── */

function Crane({ x, height, jib, t, phase = 0, flip = false }) {
  const mt = t * MOTION
  const top = GROUND - height
  const m = 5
  let mast = ''
  for (let y = GROUND; y > top; y -= 14) {
    mast += `M ${-m} ${y} L ${m} ${Math.max(top, y - 14)} `
  }
  let boom = ''
  for (let bx = -jib * 0.32; bx < jib; bx += 12) {
    boom += `M ${bx} ${top + 6} L ${bx + 6} ${top} L ${bx + 12} ${top + 6} `
  }
  const trolley = jib * (0.3 + 0.55 * (0.5 + 0.5 * Math.sin(mt * 1.15 + phase)))
  const hookY = top + 26 + 60 * (0.5 + 0.5 * Math.sin(mt * 1.7 + phase * 1.4))
  // Hoisted load: T = m(g − a_y), a_y from the analytic hook motion
  const w = 1.7 * MOTION
  const ay = -60 * 0.5 * w * w * Math.sin(mt * 1.7 + phase * 1.4)
  const tLen = 18 * clamp(1 - ay / G, 0.5, 1.6)
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
      <rect x={trolley - 4} y={top + 5} width={8} height={4} className="ld-fill" />
      <line x1={trolley} y1={top + 9} x2={trolley} y2={hookY} className="ld-ink-thin" />
      <rect x={trolley - 10} y={hookY} width={20} height={4} className="ld-accent-fill" />
      <circle cx={trolley} cy={top + 9} r={3} className="ld-joint" />
      <Fbd>
        <Vec x1={trolley + 14} y1={hookY} x2={trolley + 14} y2={hookY - tLen} />
        <Vec x1={trolley + 14} y1={hookY + 4} x2={trolley + 14} y2={hookY + 22} accent={false} />
      </Fbd>
    </g>
  )
}

function SiteArm({ x, t, phase = 0, flip = false }) {
  const mt = t * MOTION
  const a1 = -68 + 22 * Math.sin(mt * 1.55 + phase)
  const a2 = 58 + 32 * Math.sin(mt * 2.05 + phase + 1)
  const spark = Math.sin(mt * 12 + phase) > 0.35 ? 1 : 0.15
  return (
    <g transform={`translate(${x} ${GROUND})${flip ? ' scale(-1 1)' : ''}`}>
      <rect x={-14} y={-6} width={28} height={6} className="ld-fill" />
      <rect x={-6} y={-14} width={12} height={8} className="ld-ink" />
      <g transform={`translate(0 -14) rotate(${a1})`}>
        <line x1={0} y1={0} x2={46} y2={0} className="ld-ink-thick" />
        <circle r={4} className="ld-joint" />
        <g transform={`translate(46 0) rotate(${a2})`}>
          <line x1={0} y1={0} x2={34} y2={0} className="ld-ink-thick" />
          <circle r={3} className="ld-joint" />
          <g transform="translate(34 0)">
            <path d="M 0 -4 L 8 -4 M 0 4 L 8 4" className="ld-ink" />
            <circle cx={11} r={2.4} className="ld-accent-fill" style={{ opacity: spark }} />
          </g>
        </g>
      </g>
    </g>
  )
}

function Cone({ x }) {
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      <path d="M -7 0 L -2 -18 L 2 -18 L 7 0 Z" className="ld-ink" />
      <line x1={-4.5} y1={-8} x2={4.5} y2={-8} className="ld-accent" />
      <line x1={-10} y1={0} x2={10} y2={0} className="ld-ink" />
    </g>
  )
}

function Barrier({ x, w = 44 }) {
  let stripes = ''
  for (let k = 0; k < w; k += 8) stripes += `M ${k} -22 L ${k + 5} -14 `
  return (
    <g transform={`translate(${x - w / 2} ${GROUND})`}>
      <rect x={0} y={-22} width={w} height={8} className="ld-ink" />
      <path d={stripes} className="ld-accent" />
      <line x1={4} y1={-14} x2={4} y2={0} className="ld-ink-thin" />
      <line x1={w - 4} y1={-14} x2={w - 4} y2={0} className="ld-ink-thin" />
    </g>
  )
}

function Pallet({ x, t }) {
  const rise = clamp01(t / 0.6)
  return (
    <g transform={`translate(${x} ${GROUND})`}>
      {[0, 1, 2].map(i => (
        <rect
          key={i}
          x={-14 + (i % 2) * 3}
          y={-9 - i * 8}
          width={24}
          height={7}
          className={i === 1 ? 'ld-accent-fill' : 'ld-fill'}
          style={{ opacity: clamp01(rise * 3 - i * 0.4) }}
        />
      ))}
    </g>
  )
}

function Conveyor({ t, x1, x2 }) {
  const y = GROUND + 34
  const len = x2 - x1
  const speed = 120
  const gap = 130
  const mt = t * MOTION
  const rollers = []
  for (let rx = x1 + 8; rx <= x2 - 8; rx += 48) rollers.push(rx)
  const boxes = []
  for (let k = 0; k * gap < len + gap; k++) {
    const bx = x1 + ((k * gap + mt * speed) % (len + gap)) - gap
    if (bx < x1 + 4 || bx > x2 - 22) continue
    boxes.push(
      <rect
        key={k}
        x={bx}
        y={y - 6 - (8 + (k % 2) * 4)}
        width={12 + (k % 3) * 4}
        height={8 + (k % 2) * 4}
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
      {rollers.map(rx => (
        <g key={rx} transform={`translate(${rx} ${y}) rotate(${(mt * speed * 57.3) / 4.5})`}>
          <circle r={4.5} className="ld-ink-thin" />
          <line x1={-4.5} y1={0} x2={4.5} y2={0} className="ld-ink-thin" />
        </g>
      ))}
      {boxes}
    </g>
  )
}

/* ─────────────── letters ─────────────── */

function PrintedLetter({ ch, x, i, box, s }) {
  const W = box.x1 - box.x0
  const rects = []
  let bead = null
  if (s >= 1) {
    rects.push({ x: box.x0, y: box.yb - ROWS * box.rowH, w: W, h: ROWS * box.rowH })
  } else if (s > 0) {
    const q = rasterPoint(box, s)
    if (q.r > 0) rects.push({ x: box.x0, y: box.yb - q.r * box.rowH, w: W, h: q.r * box.rowH })
    const ry = box.yb - (q.r + 1) * box.rowH
    const pw = q.f * W
    const px = q.r % 2 === 0 ? box.x0 : box.x1 - pw
    rects.push({ x: px, y: ry, w: pw, h: box.rowH })
    bead = { x1: px, x2: px + pw, y: ry }
  }
  return (
    <g>
      <defs>
        <clipPath id={`ld-f-${i}`}>
          {rects.map((r, k) => (
            <rect key={k} x={r.x} y={r.y} width={r.w} height={r.h} />
          ))}
        </clipPath>
      </defs>
      <text x={x} y={GROUND} className="ld-text ld-cad" style={{ opacity: s >= 1 ? 0 : 0.9 }}>{ch}</text>
      {s > 0 && <text x={x} y={GROUND} className="ld-text ld-solid" clipPath={`url(#ld-f-${i})`}>{ch}</text>}
      {bead && bead.x2 - bead.x1 > 1 && (
        <line x1={bead.x1} y1={bead.y} x2={bead.x2} y2={bead.y} className="ld-accent" />
      )}
    </g>
  )
}

function DroppedLetter({ ch, x, w, drop }) {
  if (!drop.visible) return null
  const cx = x + w / 2
  const cy = GROUND + drop.y - CAP / 2
  const contact = drop.y > -3
  return (
    <>
      <text x={x} y={GROUND + drop.y} className="ld-text ld-solid">{ch}</text>
      {!drop.landed && (
        <Fbd>
          <Vec x1={cx} y1={cy} x2={cx} y2={cy + 20} label="mg" accent={false} />
          {contact && <Vec x1={cx + 6} y1={GROUND} x2={cx + 6} y2={GROUND - 34} label="N" />}
        </Fbd>
      )}
    </>
  )
}

const LD_FONT = 104   // .ld-text font-size
const LD_SPACING = 6  // .ld-text letter-spacing

const MONO = "'IBM Plex Mono', ui-monospace, monospace"
const SERIF = "'Instrument Serif', Georgia, serif"
const SYNE = "'Syne', 'Inter Tight', sans-serif"

const FLICK = 0.015

/** Visible only between a and b, with near-instant cuts in and out */
const flick = (a, b) => ({
  opacity: [0, 0, 1, 1, 0, 0],
  times: [0, a, a + FLICK, b, b + FLICK, 1],
})

/**
 * Type styles the name flicks through while it shrinks into the hero.
 * Capitals appear exactly once (the first frame of the handoff, matching the
 * loader); every later style is mixed/lower case and font-sized to the hero's
 * width so the shrink reads as one continuous motion.
 */
const FLIP_STYLES = [
  {
    key: 'built',
    text: NAME,
    style: { letterSpacing: `${LD_SPACING / LD_FONT}em` },
    opacity: [1, 1, 0, 0],
    times: [0, 0.12, 0.12 + FLICK, 1],
  },
  {
    key: 'outline',
    fit: true,
    text: 'Sobhita Karri',
    style: { color: 'transparent', WebkitTextStroke: '1.5px var(--accent)' },
    ...flick(0.12, 0.25),
  },
  {
    key: 'mono',
    fit: true,
    text: 'sobhita_karri',
    style: { fontFamily: MONO, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--accent)' },
    ...flick(0.25, 0.37),
  },
  {
    key: 'serif',
    fit: true,
    text: 'Sobhita Karri',
    style: { fontFamily: SERIF, fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.01em' },
    ...flick(0.37, 0.49),
  },
  {
    key: 'syne',
    fit: true,
    text: 'sobhita karri',
    style: { fontFamily: SYNE, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)' },
    ...flick(0.49, 0.61),
  },
  {
    key: 'italic',
    fit: true,
    text: 'Sobhita Karri',
    style: { fontWeight: 400, fontStyle: 'italic', letterSpacing: '-0.02em' },
    ...flick(0.61, 0.73),
  },
  {
    key: 'hero',
    final: true,
    text: 'Sobhita Karri',
    style: {},
    opacity: [0, 0, 1, 1],
    times: [0, 0.73, 0.73 + FLICK, 1],
  },
]

/** Width and first-baseline offset of a one-line text in the given style */
function measureText(text, style) {
  const el = document.createElement('div')
  Object.assign(el.style, style, {
    position: 'fixed', left: '-9999px', top: '0', margin: '0', padding: '0',
    display: 'inline-block', whiteSpace: 'nowrap', visibility: 'hidden',
  })
  el.textContent = text
  document.body.appendChild(el)
  const w = el.getBoundingClientRect().width
  const b = baselineOffset(el)
  el.remove()
  return { w, b }
}

function flipLayers(flip) {
  const base = {
    fontFamily: flip.fontFamily,
    fontWeight: flip.fontWeight,
    fontSize: flip.fontSize,
    letterSpacing: flip.letterSpacing,
    lineHeight: flip.lineHeight,
  }
  const heroFont = parseFloat(flip.fontSize) || 80
  return FLIP_STYLES.map(layer => {
    const style = { letterSpacing: flip.letterSpacing, ...layer.style }
    if (layer.fit && flip.to.width > 8) {
      const { w } = measureText(layer.text, { ...base, ...style })
      if (w > 0) style.fontSize = `${(heroFont * flip.to.width) / w}px`
    }
    // Shift inside the scaled box so every style shares the hero baseline
    const { b } = measureText(layer.text, { ...base, ...style })
    return { ...layer, style, dy: flip.bOff - b }
  })
}

/** Distance from an element's top edge to its first-line text baseline */
function baselineOffset(el) {
  const probe = document.createElement('span')
  probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline'
  el.appendChild(probe)
  const off = probe.getBoundingClientRect().top - el.getBoundingClientRect().top
  probe.remove()
  return off
}

function screenBox(svg, g) {
  try {
    const bbox = g.getBBox()
    const ctm = g.getScreenCTM()
    if (!ctm || !bbox.width) return null
    const map = (x, y) => {
      const p = svg.createSVGPoint()
      p.x = x
      p.y = y
      return p.matrixTransform(ctm)
    }
    const a = map(bbox.x, bbox.y)
    const b = map(bbox.x + bbox.width, bbox.y + bbox.height)
    return { left: a.x, top: a.y, width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) }
  } catch {
    return null
  }
}

function buildPlans(letters) {
  const top = GROUND - CAP - 6
  return JOBS.map(job => {
    const l = letters[job.i]
    const box = letterBox(l)
    const mid = (box.x0 + box.x1) / 2
    const span = box.x1 - box.x0
    let geo
    let rest
    if (job.tool === 'arm2r') {
      const base = { x: mid - span * 0.15, y: top - 92 }
      const reach = Math.hypot(span * 0.7, GROUND + 4 - base.y) + 6
      geo = { base, L1: reach * 0.54, L2: reach * 0.54 }
      rest = { x: base.x + 50, y: base.y + 60 }
    } else if (job.tool === 'gantry') {
      geo = { railY: top - 54, x0: box.x0 - 26, x1: box.x1 + 26 }
      rest = { x: mid, y: top - 22 }
    } else if (job.tool === 'pulley') {
      const railY = top - 62
      const x0 = box.x0 - 30
      const x1 = box.x1 + 4
      rest = { x: mid, y: top - 20 }
      // Rope length fixed so the counterweight hangs mid-height at rest
      const wx = rest.x + 7
      const L = (rest.y - (railY + 10)) + (x1 - wx) + 105
      geo = { railY, x0, x1, L }
    } else if (job.tool === 'ballistic') {
      const prev = letters[job.i - 1]
      const gapX = prev.ch === ' ' ? prev.x + prev.w / 2 : box.x0 - 14
      geo = { L: { x: gapX, y: GROUND - 9 } }
      rest = { x: mid, y: top }
    } else {
      const by = GROUND - 2
      const B1 = { x: mid - span * 0.24, y: by }
      const B2 = { x: mid + span * 0.24, y: by }
      const maxR = Math.hypot(span * 0.75 + 6, by - top) + 8
      geo = { B1, B2, a: maxR * 0.56, b: maxR * 0.56 }
      rest = { x: mid, y: GROUND - 34 }
    }
    return { ...job, box, geo, rest }
  })
}

function Builder({ plan, t }) {
  const q = pathAt(plan, t)
  const p = { x: q.x, y: q.y }
  const props = { geo: plan.geo, plan, t, p, printing: q.printing }
  const fade = clamp01((t - plan.t0 + 0.15) / 0.2) * (1 - clamp01((t - plan.t0 - MOVE * 2 - PRINT) / 0.25) * 0.55)
  let body
  if (plan.tool === 'arm2r') body = <Arm2R {...props} />
  else if (plan.tool === 'gantry') body = <Gantry {...props} />
  else if (plan.tool === 'pulley') body = <Pulley {...props} />
  else if (plan.tool === 'ballistic') body = <Ballistic {...props} />
  else body = <FiveBar {...props} />
  return <g style={{ opacity: fade }}>{body}</g>
}

// Glyph advances for 'SOBHITA KARRI' in Inter Tight 700 @ 104px (.ld-text)
const GLYPHS = [
  [0, 70.7], [70.69, 83.91], [154.59, 71.31], [225.89, 80.16], [306.04, 31.7],
  [337.73, 62.84], [400.55, 80.31], [480.85, 26.73], [507.56, 74.36], [581.91, 80.31],
  [662.21, 70.91], [733.11, 70.9], [804, 31.71],
]
const NAME_W = 835.71
const LAYOUT = (() => {
  const left = (VB_W - NAME_W) / 2
  const letters = [...NAME].map((ch, i) => ({ ch, x: left + GLYPHS[i][0], w: GLYPHS[i][1] }))
  return { letters, left, width: NAME_W, plans: buildPlans(letters) }
})()

// Static SVG, built once at module load and reused every frame
const GRID_LINES = Array.from({ length: Math.ceil((NAME_W + 260) / 80) + 1 }, (_, k) => {
  const gx = LAYOUT.left - 130 + k * 80
  return <line key={gx} x1={gx} y1={40} x2={gx} y2={GROUND} className="ld-grid" />
})
const STATIC_PROPS = (
  <>
    <Barrier x={LAYOUT.left - 108} />
    <Barrier x={LAYOUT.left + NAME_W + 108} />
    <Cone x={LAYOUT.left - 22} />
    <Cone x={LAYOUT.left + NAME_W + 22} />
  </>
)

export default function Loader({ onReveal, onLand, onDone }) {
  const [t, setT] = useState(0)
  const [phase, setPhase] = useState('build')
  const [flip, setFlip] = useState(null)
  const svgRef = useRef(null)
  const lettersRef = useRef(null)
  const doneRef = useRef(false)
  const startedRef = useRef(false)
  const syncing = phase === 'sync' || phase === 'out'

  const complete = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    document.body.style.overflow = ''
    onDone?.()
  }, [onDone])

  const landedRef = useRef(false)
  const land = useCallback(() => {
    if (landedRef.current) return
    landedRef.current = true
    onLand?.()
    setPhase('out')
    window.setTimeout(complete, 320)
  }, [onLand, complete])

  /** All DOM measurement for the handoff — run ahead of time so the cut is instant */
  const measureFlip = useCallback(() => {
    const svg = svgRef.current
    const letters = lettersRef.current
    const hero = document.getElementById('hero-name')
    const from = svg && letters ? screenBox(svg, letters) : null
    const to = hero?.getBoundingClientRect()
    const style = hero ? getComputedStyle(hero) : null

    let svgStart = null
    const ctm = svg?.getScreenCTM()
    if (ctm) {
      const pt = svg.createSVGPoint()
      pt.x = LAYOUT.letters[0].x
      pt.y = GROUND
      const s = pt.matrixTransform(ctm)
      svgStart = { x: s.x, y: s.y, font: LD_FONT * ctm.a }
    }

    const target = to && to.width > 8 ? to : {
      left: Math.max(24, window.innerWidth * 0.06),
      top: window.innerHeight * 0.28,
      width: Math.min(420, window.innerWidth * 0.55),
      height: Math.min(96, window.innerHeight * 0.12),
    }
    const heroFont = parseFloat(style?.fontSize) || 80
    const bOff = hero ? baselineOffset(hero) : heroFont * 0.8

    let s0
    let x0
    let y0
    if (svgStart) {
      s0 = svgStart.font / heroFont
      x0 = svgStart.x - target.left
      y0 = svgStart.y - bOff * s0 - target.top
    } else {
      const origin = from && from.width > 8 ? from : {
        left: window.innerWidth * 0.12,
        top: window.innerHeight * 0.32,
        width: window.innerWidth * 0.76,
      }
      s0 = origin.width / Math.max(target.width, 1)
      x0 = origin.left - target.left
      y0 = origin.top - target.top
    }

    const next = {
      to: { left: target.left, top: target.top, width: target.width },
      fontSize: style?.fontSize || 'clamp(3.25rem, 8.5vw, 5.75rem)',
      fontFamily: style?.fontFamily || 'Inter Tight, Helvetica Neue, Arial, sans-serif',
      fontWeight: style?.fontWeight || '700',
      letterSpacing: style?.letterSpacing || '-0.04em',
      lineHeight: style?.lineHeight || '0.95',
      bOff,
      s0,
      x0,
      y0,
    }
    return { ...next, layers: flipLayers(next) }
  }, [])

  const prepRef = useRef(null)

  const startSync = useCallback(() => {
    if (doneRef.current || startedRef.current) return
    startedRef.current = true
    setT(DURATION)
    setFlip(prepRef.current || measureFlip())
    setPhase('sync')
    // Page (still hidden hero name, nav) shows through only as the name lands
    window.setTimeout(() => onReveal?.(), SYNC_MS * 0.55)
    window.setTimeout(land, SYNC_MS + 1500)
  }, [measureFlip, onReveal, land])

  const skip = useCallback(() => {
    if (doneRef.current) return
    startedRef.current = true
    onReveal?.()
    onLand?.()
    setPhase('out')
    window.setTimeout(complete, 280)
  }, [onReveal, onLand, complete])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') skip() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [skip])

  useEffect(() => {
    if (phase !== 'build') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setT(DURATION)
      const id = setTimeout(startSync, 120)
      return () => clearTimeout(id)
    }
    let raf = 0
    const t0 = performance.now()
    const tick = () => {
      const s = (performance.now() - t0) / 1000
      setT(Math.min(DURATION, s))
      if (s >= DURATION - 0.35 && !prepRef.current) prepRef.current = measureFlip()
      if (s >= DURATION) {
        startSync()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, startSync, measureFlip])

  useEffect(() => {
    // Handoff fonts are only used at the very end — fetch them up front
    document.fonts?.load(`italic 400 40px ${SERIF}`)
    document.fonts?.load(`800 40px ${SYNE}`)
    const drop = () => { prepRef.current = null }
    window.addEventListener('resize', drop)
    return () => window.removeEventListener('resize', drop)
  }, [])

  const { letters, left, width, plans } = LAYOUT
  const at = (i, f = 0.5) => letters[i].x + letters[i].w * f

  const printS = {}
  plans.forEach(plan => { printS[plan.i] = pathAt(plan, t).s })

  let dropOrder = 0
  const glyphs = letters
    .map((l, i) => {
      if (l.ch === ' ') return null
      if (i in printS) return { ...l, i, kind: 'print', box: letterBox(l), s: printS[i] }
      const drop = dropOffset(t - (0.05 + dropOrder++ * 0.075))
      return { ...l, i, kind: 'drop', drop }
    })
    .filter(Boolean)
  const doneCount = glyphs.filter(g => (g.kind === 'print' ? g.s >= 1 : g.drop.landed)).length
  const progress = clamp01(t / DURATION)

  return (
    <>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'out' ? 0 : 1 }}
        transition={{ duration: 0.3, ease }}
        onClick={skip}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: syncing ? 'transparent' : 'var(--bg-void)',
          color: 'var(--text-bright)',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          cursor: 'pointer',
          transition: `background-color 0.4s ease ${Math.round(SYNC_MS * 0.6)}ms`,
          pointerEvents: phase === 'out' ? 'none' : 'auto',
        }}
      >
        <motion.div
          animate={{ opacity: syncing ? 0 : 1 }}
          transition={{ duration: syncing ? 0.08 : 0.3, ease }}
          style={{
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
          }}
        >
          <span style={{ fontWeight: 700, letterSpacing: '0.18em' }}>Sobhita Karri</span>
          <span style={{ color: 'var(--text-muted)' }}>Skip →</span>
        </motion.div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 var(--section-px)',
          minHeight: 0,
        }}>
          <motion.div
            animate={{ opacity: syncing ? 0 : 1 }}
            transition={{ duration: syncing ? 0.12 : 0.3, ease }}
            style={{ width: '100%', maxWidth: 1100 }}
          >
            <svg
              ref={svgRef}
              viewBox={`${left - 130} 20 ${width + 260} 380`}
              style={{ width: '100%', height: 'auto', maxHeight: '100%', overflow: 'visible', display: 'block' }}
              aria-label="Building Sobhita Karri"
              role="img"
            >
              {/* background site — lighter so the name stays the focus */}
              <g style={{ opacity: syncing ? 0 : 0.42, transition: 'opacity 0.3s ease' }}>
                {GRID_LINES}
                <Crane x={at(0, 0.3)} height={250} jib={200} t={t} phase={0} />
                <Crane x={at(12, 0.7)} height={275} jib={225} t={t} phase={2.1} flip />
                <SiteArm x={left - 62} t={t} phase={0.4} />
                <SiteArm x={left + width + 62} t={t} phase={1.9} flip />
                {STATIC_PROPS}
                <Pallet x={left - 88} t={t} />
                <Pallet x={left + width + 90} t={t} />
                <Conveyor t={t} x1={left - 120} x2={left + width + 120} />
              </g>

              <g style={{ opacity: syncing ? 0 : 1, transition: 'opacity 0.3s ease' }}>
                <line x1={left - 130} y1={GROUND} x2={left + width + 130} y2={GROUND} className="ld-ink" />
              </g>

              <g ref={lettersRef} id="loader-letters" style={{ opacity: syncing ? 0 : 1 }}>
                {glyphs.map(g => (g.kind === 'print'
                  ? <PrintedLetter key={g.i} ch={g.ch} x={g.x} i={g.i} box={g.box} s={g.s} />
                  : <DroppedLetter key={g.i} ch={g.ch} x={g.x} w={g.w} drop={g.drop} />
                ))}
              </g>

              <g style={{ opacity: syncing ? 0 : 1, transition: 'opacity 0.25s ease' }}>
                {plans.map(plan => <Builder key={plan.tool} plan={plan} t={t} />)}
              </g>
            </svg>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: syncing ? 0 : 1 }}
          transition={{ duration: syncing ? 0.08 : 0.3, ease }}
          style={{ padding: '0 var(--section-px) 32px' }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 16,
            flexWrap: 'wrap',
            marginBottom: 14,
          }}>
            <div className="type-xs" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Site 01 · Kinematic build · {Math.round(progress * 100)}%
              <span style={{ width: 6, height: 6, background: 'var(--accent)', display: 'inline-block' }} />
            </div>

            <div className="type-xs" style={{ display: 'flex', gap: 14, letterSpacing: '0.08em', flexWrap: 'wrap' }}>
              <span>2R IK</span>
              <span>Gantry XZ</span>
              <span>Ballistic g</span>
              <span>5-bar</span>
              <span>Pulley ΣL</span>
              <span>FBD ΣF = ma</span>
            </div>

            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.8rem',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-bright)',
            }}>
              {String(doneCount).padStart(2, '0')} / {String(glyphs.length || 12).padStart(2, '0')}
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
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {flip && phase !== 'out' && (
          <motion.div key="name-flip" exit={{ opacity: 0 }} transition={{ duration: 0.18 }} aria-hidden>
            {flip.layers.map(layer => (
              <motion.div
                key={layer.key}
                className="type-display"
                initial={{ x: flip.x0, y: flip.y0, scale: flip.s0, opacity: layer.opacity[0] }}
                animate={{ x: 0, y: 0, scale: 1, opacity: layer.opacity }}
                transition={{
                  duration: SYNC_MS / 1000,
                  ease,
                  opacity: { duration: SYNC_MS / 1000, times: layer.times, ease: 'linear' },
                }}
                style={{
                  position: 'fixed',
                  left: flip.to.left,
                  top: flip.to.top,
                  zIndex: 10001,
                  pointerEvents: 'none',
                  margin: 0,
                  padding: 0,
                  transformOrigin: 'top left',
                  fontFamily: flip.fontFamily,
                  fontWeight: flip.fontWeight,
                  fontSize: flip.fontSize,
                  lineHeight: flip.lineHeight,
                  color: 'var(--text-bright)',
                  whiteSpace: 'nowrap',
                  willChange: 'transform, opacity',
                  ...layer.style,
                }}
                onAnimationComplete={layer.final ? land : undefined}
              >
                <span style={{ position: 'relative', top: layer.dy || 0 }}>{layer.text}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
