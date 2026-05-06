import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTypewriter } from '../hooks/useTypewriter'
import { FiArrowDown, FiGithub, FiLinkedin } from 'react-icons/fi'
import * as THREE from 'three'

const TAGLINES = [
  'RTL Designer.',
  'FPGA Developer.',
  'Digital Design Engineer.',
  'VLSI Enthusiast.',
]

/* ═══════════════════════════════════════════════
   THREE.JS — Neural-network node mesh background
   Mouse repulsion + particle flow on edges
   ═══════════════════════════════════════════════ */
function NeuralBackground() {
  const mountRef  = useRef(null)
  const mouseRef  = useRef(new THREE.Vector2(9999, 9999))

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const W = mount.clientWidth, H = mount.clientHeight

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.set(0, 0, 5)

    /* ── NODES ── */
    const NODE_COUNT = 80
    const nodes  = []
    const SPREAD = 4.5

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x:  (Math.random() - 0.5) * SPREAD * 2,
        y:  (Math.random() - 0.5) * SPREAD,
        z:  (Math.random() - 0.5) * 2,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.003,
        phase: Math.random() * Math.PI * 2,
      })
    }

    /* ── EDGES (connect nearby nodes) ── */
    const CONNECT_DIST = 1.6
    const MAX_EDGES    = 300

    /* Line geometry — updated every frame */
    const lineGeo = new THREE.BufferGeometry()
    const linePts = new Float32Array(MAX_EDGES * 2 * 3)  // 2 verts per edge
    const lineClr = new Float32Array(MAX_EDGES * 2 * 3)
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePts, 3))
    lineGeo.setAttribute('color',    new THREE.BufferAttribute(lineClr, 3))

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent:  true,
      opacity:      0.35,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    /* ── NODE DOTS (shader) ── */
    const nodePos   = new Float32Array(NODE_COUNT * 3)
    const nodePhase = new Float32Array(NODE_COUNT)
    nodes.forEach((n, i) => {
      nodePos[i*3]=n.x; nodePos[i*3+1]=n.y; nodePos[i*3+2]=n.z
      nodePhase[i]=n.phase
    })
    const dotGeo = new THREE.BufferGeometry()
    dotGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3))
    dotGeo.setAttribute('aPhase',   new THREE.BufferAttribute(nodePhase, 1))

    const dotMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */`
        attribute float aPhase;
        uniform float uTime;
        varying float vPulse;
        void main() {
          vPulse = 0.5 + 0.5 * sin(uTime * 2.5 + aPhase);
          gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (3.0 + vPulse * 3.5) * (200.0 / -gl_Position.z);
        }
      `,
      fragmentShader: /* glsl */`
        varying float vPulse;
        void main() {
          vec2  uv = gl_PointCoord - 0.5;
          float r  = length(uv);
          if (r > 0.5) discard;
          float g  = 1.0 - smoothstep(0.0, 0.5, r);
          g = pow(g, 1.3);
          // mix teal → blue based on pulse
          vec3 col = mix(vec3(0.0, 0.898, 0.627), vec3(0.22, 0.74, 0.98), vPulse);
          gl_FragColor = vec4(col * g, g * 0.85);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    const dots = new THREE.Points(dotGeo, dotMat)
    scene.add(dots)

    /* ── FLOW PARTICLES (travel along edges) ── */
    const FLOW_COUNT = 50
    const flowGeo  = new THREE.BufferGeometry()
    const flowPos  = new Float32Array(FLOW_COUNT * 3)
    const flowData = Array.from({ length: FLOW_COUNT }, () => ({
      edgeA: 0, edgeB: 1, t: Math.random(), speed: 0.002 + Math.random() * 0.004,
    }))
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3))
    const flowMat = new THREE.PointsMaterial({
      color: 0x8b5cf6, size: 0.06,
      transparent: true, opacity: 0.7,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const flow = new THREE.Points(flowGeo, flowMat)
    scene.add(flow)

    /* ── mouse tracking ── */
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / W)  * 2 - 1
      const ny = -((e.clientY - rect.top)  / H) * 2 + 1
      // project to world at z=0
      mouseRef.current.set(nx * SPREAD, ny * SPREAD * (H / W))
    }
    mount.addEventListener('mousemove', onMouseMove)

    /* ── Animation loop ── */
    const clock = new THREE.Clock()
    let edgePairs = []
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      dotMat.uniforms.uTime.value = t

      const mx = mouseRef.current.x, my = mouseRef.current.y
      const REPEL = 1.2, REPEL_STR = 0.006

      /* Move nodes */
      nodes.forEach((n, i) => {
        // Gentle float
        n.x += n.vx + Math.sin(t * 0.4 + n.phase) * 0.0005
        n.y += n.vy + Math.cos(t * 0.3 + n.phase) * 0.0004

        // Bounce walls
        if (n.x > SPREAD || n.x < -SPREAD) n.vx *= -1
        if (n.y > SPREAD * 0.5 || n.y < -SPREAD * 0.5) n.vy *= -1

        // Mouse repulsion
        const dx = n.x - mx, dy = n.y - my
        const d  = Math.sqrt(dx*dx + dy*dy)
        if (d < REPEL && d > 0.01) {
          const force = (REPEL - d) / REPEL * REPEL_STR
          n.x += (dx / d) * force
          n.y += (dy / d) * force
        }

        nodePos[i*3]=n.x; nodePos[i*3+1]=n.y; nodePos[i*3+2]=n.z
      })
      dotGeo.attributes.position.needsUpdate = true

      /* Rebuild edges */
      edgePairs = []
      let ep = 0
      for (let a = 0; a < NODE_COUNT && ep < MAX_EDGES; a++) {
        for (let b = a+1; b < NODE_COUNT && ep < MAX_EDGES; b++) {
          const dx = nodes[a].x-nodes[b].x
          const dy = nodes[a].y-nodes[b].y
          const d  = Math.sqrt(dx*dx+dy*dy)
          if (d < CONNECT_DIST) {
            const alpha = 1 - d/CONNECT_DIST
            // teal → blue color
            const r = 0.0, g = 0.898 * alpha, bl = 0.627 + alpha * 0.35
            linePts[ep*6]  =nodes[a].x; linePts[ep*6+1]=nodes[a].y; linePts[ep*6+2]=nodes[a].z
            linePts[ep*6+3]=nodes[b].x; linePts[ep*6+4]=nodes[b].y; linePts[ep*6+5]=nodes[b].z
            lineClr[ep*6]  =r;   lineClr[ep*6+1]=g;   lineClr[ep*6+2]=bl
            lineClr[ep*6+3]=r;   lineClr[ep*6+4]=g;   lineClr[ep*6+5]=bl
            edgePairs.push([a, b])
            ep++
          }
        }
      }
      // Zero out unused slots
      for (let i = ep; i < MAX_EDGES; i++) {
        linePts.fill(0, i*6, i*6+6)
        lineClr.fill(0, i*6, i*6+6)
      }
      lineGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.color.needsUpdate    = true
      lineGeo.setDrawRange(0, ep * 2)

      /* Move flow particles along edges */
      flowData.forEach((f, i) => {
        f.t += f.speed
        if (f.t > 1) {
          f.t = 0
          if (edgePairs.length > 0) {
            const eIdx = Math.floor(Math.random() * edgePairs.length)
            f.edgeA = edgePairs[eIdx][0]
            f.edgeB = edgePairs[eIdx][1]
          }
          f.speed = 0.002 + Math.random() * 0.005
        }
        const na = nodes[f.edgeA], nb = nodes[f.edgeB]
        if (na && nb) {
          flowPos[i*3]   = na.x + (nb.x-na.x)*f.t
          flowPos[i*3+1] = na.y + (nb.y-na.y)*f.t
          flowPos[i*3+2] = na.z + (nb.z-na.z)*f.t
        }
      })
      flowGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nW=mount.clientWidth, nH=mount.clientHeight
      camera.aspect=nW/nH; camera.updateProjectionMatrix()
      renderer.setSize(nW,nH)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      mount.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={mountRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'all' }} />
  )
}

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */
export default function Hero() {
  const typed = useTypewriter(TAGLINES, 65, 30, 2200)

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
      {/* THREE.JS NEURAL MESH — full behind everything */}
      <NeuralBackground />

      {/* Radial fade so center text is readable */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(ellipse 70% 70% at 30% 50%, transparent 0%, rgba(6,6,16,0.75) 80%)',
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

          {/* Typewriter */}
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
            {typed}
            <span style={{ animation:'blink 1s step-end infinite', color:'var(--accent)', marginLeft:2 }}>|</span>
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
