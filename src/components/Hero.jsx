import { useRef } from 'react'
import { motion } from 'framer-motion'
import { FiArrowDown, FiGithub, FiLinkedin } from 'react-icons/fi'
import TextType from './ui/TextType'
import PixelBlast from './ui/PixelBlast'

const TAGLINES = [
  'RTL Designer.',
  'FPGA Developer.',
  'Digital Design Engineer.',
  'VLSI Enthusiast.',
]

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */
export default function Hero() {

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 68,
      }}
    >
      {/* PixelBlast — Bayer-dithered interactive background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'all' }}>
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#00e5a0"
          patternScale={3}
          patternDensity={1.1}
          pixelSizeJitter={0.4}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.4}
          liquid
          liquidStrength={0.1}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.28}
          transparent
        />
      </div>

      {/* Radial vignette so center text is readable */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 70% 70% at 30% 50%, transparent 0%, rgba(6,6,16,0.82) 80%)',
      }} />

      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
        background: 'linear-gradient(transparent, var(--bg-void))',
        pointerEvents: 'none', zIndex: 2,
      }} />

      {/* CONTENT */}
      <div className="section-wrapper" style={{ paddingTop: 48, paddingBottom: 48, zIndex: 5 }}>
        <div style={{ maxWidth: 680 }}>

          {/* Available badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22,1,0.36,1] }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(0,229,160,0.25)',
              padding: '6px 16px', borderRadius: 100, marginBottom: 28,
              fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
              color: 'var(--accent)',
              background: 'rgba(0,229,160,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{
              width:7, height:7, borderRadius:'50%',
              background:'var(--accent)', boxShadow:'0 0 8px var(--accent)',
              animation:'pulse-dot 2s infinite', display:'inline-block',
            }} />
            Available for opportunities
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.22,1,0.36,1] }}
            className="glitch-text"
            data-text="K S V S Sobhita"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(3rem, 9vw, 6.5rem)',
              fontWeight: 800,
              color: 'var(--text-bright)',
              lineHeight: 1.05, marginBottom: 20,
              letterSpacing: '-0.04em',
            }}
          >
            K S V S Sobhita
          </motion.h1>

          {/* Typewriter — React Bits TextType */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
              color: 'var(--accent)', marginBottom: 28,
              minHeight: '1.8em', display: 'flex', alignItems: 'center', gap: 2,
            }}
          >
            <span style={{ color:'var(--text-muted)', marginRight:10, userSelect:'none' }}>{'>'}</span>
            <TextType
              text={TAGLINES}
              typingSpeed={65}
              deletingSpeed={30}
              pauseDuration={2200}
              showCursor={true}
              cursorCharacter="|"
              cursorClassName=""
              loop={true}
              variableSpeed={{ min: 50, max: 100 }}
              as="span"
              style={{ color: 'var(--accent)' }}
            />
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            style={{
              color: 'var(--text-body)', fontSize: '1.05rem',
              maxWidth: 520, lineHeight: 1.8, marginBottom: 44,
            }}
          >
            Electronics and Communication Engineering student specializing in{' '}
            <span style={{ color:'var(--text-bright)', fontWeight:500 }}>VLSI design</span>,
            RTL development, and functional verification — working at the boundary
            of software logic and physical silicon.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            style={{ display:'flex', gap:14, flexWrap:'wrap', alignItems:'center' }}
          >
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior:'smooth' })}
              className="btn-primary"
            >
              View Projects
            </button>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">
              Download Resume
            </a>
            <div style={{ display:'flex', gap:10, marginLeft:8 }}>
              {[
                { icon:FiGithub,   href:'https://github.com/sobhita-karri',      label:'GitHub' },
                { icon:FiLinkedin, href:'https://linkedin.com/in/sobhita-karri', label:'LinkedIn' },
              ].map(({ icon:Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'center',
                    width:40, height:40, borderRadius:8,
                    border:'1px solid var(--border)', color:'var(--text-muted)',
                    background:'rgba(6,6,16,0.6)', backdropFilter:'blur(8px)',
                    transition:'all 0.2s ease', textDecoration:'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color='var(--accent)'
                    e.currentTarget.style.borderColor='var(--border-light)'
                    e.currentTarget.style.background='var(--accent-faint)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color='var(--text-muted)'
                    e.currentTarget.style.borderColor='var(--border)'
                    e.currentTarget.style.background='rgba(6,6,16,0.6)'
                  }}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85 }}
            style={{
              display:'flex', gap:0, marginTop:64,
              paddingTop:28, borderTop:'1px solid var(--border)', flexWrap:'wrap',
            }}
          >
            {[
              { value:'4+',   label:'Core Projects',    color:'var(--accent)' },
              { value:'10+',  label:'RTL Modules',       color:'var(--blue)' },
              { value:'90%',  label:'Design Efficiency', color:'var(--violet)' },
              { value:'FPGA', label:'Prototyped',        color:'var(--accent)' },
            ].map((s,i) => (
              <div key={i} style={{
                flex:'1 1 100px', padding:'20px 0',
                paddingRight:32,
                borderRight: i<3 ? '1px solid var(--border)' : 'none',
                marginRight: i<3 ? 32 : 0,
              }}>
                <div style={{
                  fontFamily:'Outfit,sans-serif', fontSize:'2rem',
                  fontWeight:700, color:s.color, lineHeight:1, marginBottom:6,
                }}>
                  {s.value}
                </div>
                <div style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y:[0,10,0] }} transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior:'smooth' })}
        style={{
          position:'absolute', bottom:36, left:'50%', transform:'translateX(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center',
          gap:6, cursor:'pointer', zIndex:4,
        }}
      >
        <FiArrowDown size={16} style={{ color:'var(--text-muted)' }} />
        <div style={{ width:1, height:32, background:'linear-gradient(var(--text-faint),transparent)' }} />
      </motion.div>
    </section>
  )
}