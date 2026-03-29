import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'

const TAGLINES = [
  'RTL Designer.',
  'FPGA Developer.',
  'Digital Design Engineer.',
  'VLSI Enthusiast.',
]

/* Floating logic gate symbols background */
function LogicGateSVG({ symbol, x, y, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, opacity: 0.06 }}
      animate={{ y: [0, -16, 0], opacity: [0.06, 0.1, 0.06] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg width="48" height="36" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {symbol === 'AND' && <>
          <path d="M4 4 L24 4 Q44 4 44 18 Q44 32 24 32 L4 32 Z" stroke="#00ff88" strokeWidth="1.5" fill="none" />
          <line x1="0" y1="10" x2="4" y2="10" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="0" y1="26" x2="4" y2="26" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="44" y1="18" x2="48" y2="18" stroke="#00ff88" strokeWidth="1.5" />
        </>}
        {symbol === 'OR' && <>
          <path d="M4 4 Q14 4 20 4 Q44 4 44 18 Q44 32 20 32 Q14 32 4 32 Q14 18 4 4 Z" stroke="#00ff88" strokeWidth="1.5" fill="none" />
          <line x1="0" y1="10" x2="8" y2="10" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="0" y1="26" x2="8" y2="26" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="44" y1="18" x2="48" y2="18" stroke="#00ff88" strokeWidth="1.5" />
        </>}
        {symbol === 'XOR' && <>
          <path d="M8 4 Q18 4 24 4 Q44 4 44 18 Q44 32 24 32 Q18 32 8 32 Q18 18 8 4 Z" stroke="#00ff88" strokeWidth="1.5" fill="none" />
          <path d="M4 4 Q10 18 4 32" stroke="#00ff88" strokeWidth="1.5" fill="none" />
          <line x1="0" y1="10" x2="8" y2="10" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="0" y1="26" x2="8" y2="26" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="44" y1="18" x2="48" y2="18" stroke="#00ff88" strokeWidth="1.5" />
        </>}
        {symbol === 'NOT' && <>
          <path d="M4 4 L4 32 L36 18 Z" stroke="#00ff88" strokeWidth="1.5" fill="none" />
          <circle cx="39" cy="18" r="3" stroke="#00ff88" strokeWidth="1.5" fill="none" />
          <line x1="0" y1="18" x2="4" y2="18" stroke="#00ff88" strokeWidth="1.5" />
          <line x1="42" y1="18" x2="48" y2="18" stroke="#00ff88" strokeWidth="1.5" />
        </>}
      </svg>
    </motion.div>
  )
}

const GATE_POSITIONS = [
  { symbol: 'AND', x: 8,  y: 15, delay: 0 },
  { symbol: 'OR',  x: 85, y: 20, delay: 1 },
  { symbol: 'XOR', x: 70, y: 70, delay: 2 },
  { symbol: 'NOT', x: 15, y: 75, delay: 1.5 },
  { symbol: 'AND', x: 50, y: 10, delay: 3 },
  { symbol: 'OR',  x: 30, y: 85, delay: 0.8 },
  { symbol: 'XOR', x: 90, y: 55, delay: 2.5 },
]

export default function Hero() {
  const typed = useTypewriter(TAGLINES, 60, 35, 2000)

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 80,
      }}
    >
      {/* Floating logic gates */}
      {GATE_POSITIONS.map((g, i) => (
        <LogicGateSVG key={i} {...g} />
      ))}

      {/* PCB Traces Background Layer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1, y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          backgroundImage: 'url("/hero-pcb-traces.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pointerEvents: 'none',
        }}
      >
        {/* Logic Pulses traveling through traces */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ left: '-10%', top: `${20 + i * 15}%`, opacity: 0 }}
            animate={{ 
              left: '110%', 
              opacity: [0, 1, 1, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 2.5, 
              ease: 'linear' 
            }}
            style={{
              position: 'absolute',
              width: 100,
              height: 1,
              background: 'linear-gradient(90deg, transparent, #00ff88, transparent)',
              boxShadow: '0 0 10px #00ff88',
              zIndex: 2,
            }}
          />
        ))}
      </motion.div>

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="section-wrapper" style={{ paddingTop: 40, paddingBottom: 40, zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {/* Pre-title badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid #00ff8844',
              padding: '6px 14px',
              borderRadius: 2,
              marginBottom: 24,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              color: '#00ff88',
              background: 'rgba(0,255,136,0.05)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'blink 1s step-end infinite' }} />
            Available for opportunities
          </motion.div>

          {/* Glitch Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="glitch-text"
            data-text="K S V S Sobhita"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              fontWeight: 700,
              color: '#c9d1d9',
              lineHeight: 1,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}
          >
            K S V S Sobhita
          </motion.h1>

          {/* Typewriter tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              color: '#00ff88',
              marginBottom: 32,
              minHeight: '2em',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ color: '#8892a4', marginRight: 8 }}>{'>'}</span>
            {typed}
            <span style={{ animation: 'blink 1s step-end infinite', color: '#00ff88', marginLeft: 2 }}>_</span>
          </motion.div>

          {/* Bio line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{
              color: '#8892a4',
              fontSize: '1rem',
              maxWidth: 520,
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            Electronics and Communication Engineering student specializing in VLSI design, RTL development, and functional verification.
            Experienced with FPGA-based digital design and hardware debugging.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-circuit filled"
            >
              View Projects
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-circuit"
            >
              Download Resume
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            style={{
              display: 'flex',
              gap: 40,
              marginTop: 60,
              paddingTop: 32,
              borderTop: '1px solid #1e2030',
              flexWrap: 'wrap',
            }}
          >
            {[
              { value: '4+',   label: 'Core Projects' },
              { value: '10+',  label: 'RTL Modules' },
              { value: '90%',  label: 'Design Efficiency' },
              { value: 'FPGA', label: 'Prototyped' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '1.6rem', color: '#00ff88', fontWeight: 600 }}>
                  {s.value}
                </div>
                <div style={{ color: '#8892a4', fontSize: '0.8rem', marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(transparent, #0a0a0f)',
        pointerEvents: 'none',
      }} />

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute', bottom: 32, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 6,
          color: '#8892a4',
          fontSize: '0.7rem',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <span style={{ letterSpacing: '0.1em' }}>SCROLL</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(#8892a4, transparent)',
        }} />
      </motion.div>
    </section>
  )
}
