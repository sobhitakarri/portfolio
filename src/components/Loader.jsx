import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'

/* ════════════════════════════════════════════════════════════
   DNA HELIX — Three.js WebGL canvas
   Uses window.innerWidth/Height to avoid clientWidth=0 bug
   ════════════════════════════════════════════════════════════ */
function DNAScene({ onPhaseEnd }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const W = window.innerWidth
    const H = window.innerHeight

    /* ── Renderer directly into <canvas> element ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.z = 6

    /* ──────────────────────────────────────────────
       BUILD PARTICLE DATA — 2 helix strands + rungs
    ────────────────────────────────────────────── */
    const STRAND = 200
    const RUNGS  = 60
    const COUNT  = STRAND * 2 + RUNGS

    const origPos = new Float32Array(COUNT * 3)
    const randDir = new Float32Array(COUNT * 3)
    const aPhase  = new Float32Array(COUNT)
    const aColor  = new Float32Array(COUNT * 3)  // named aColor to avoid Three.js auto-inject conflict

    const C_TEAL   = new THREE.Color('#00e5a0')
    const C_BLUE   = new THREE.Color('#38bdf8')
    const C_VIOLET = new THREE.Color('#8b5cf6')

    let idx = 0
    const push = (x, y, z, col) => {
      origPos[idx*3]=x; origPos[idx*3+1]=y; origPos[idx*3+2]=z
      aColor[idx*3]=col.r; aColor[idx*3+1]=col.g; aColor[idx*3+2]=col.b  // stored per-particle
      aPhase[idx] = Math.random() * Math.PI * 2
      const a = Math.random()*Math.PI*2, b = Math.acos(2*Math.random()-1)
      randDir[idx*3]=Math.sin(b)*Math.cos(a)
      randDir[idx*3+1]=Math.sin(b)*Math.sin(a)
      randDir[idx*3+2]=Math.cos(b)
      idx++
    }

    // Strand A
    for (let i = 0; i < STRAND; i++) {
      const t = (i/STRAND - 0.5) * 7
      push(Math.cos(t*1.5)*1.0, t*0.24, Math.sin(t*1.5)*1.0, C_TEAL)
    }
    // Strand B (offset π)
    for (let i = 0; i < STRAND; i++) {
      const t = (i/STRAND - 0.5) * 7
      push(Math.cos(t*1.5+Math.PI)*1.0, t*0.24, Math.sin(t*1.5+Math.PI)*1.0, C_BLUE)
    }
    // Rungs
    for (let i = 0; i < RUNGS; i++) {
      const t = (i/RUNGS - 0.5) * 7
      const fr = i/RUNGS
      push((Math.random()-0.5)*2, t*0.24, (Math.random()-0.5)*2, C_VIOLET.clone().lerp(C_TEAL, fr))
    }

    /* ── BufferGeometry ── */
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(origPos.slice(), 3))
    geo.setAttribute('aOrig',    new THREE.BufferAttribute(origPos, 3))
    geo.setAttribute('aRandDir', new THREE.BufferAttribute(randDir, 3))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(aPhase,  1))
    geo.setAttribute('aColor',   new THREE.BufferAttribute(aColor,  3))

    /* ── ShaderMaterial — GLSL glow dots + explode vortex ── */
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:    { value: 0 },
        uExplode: { value: 0 },
        uFade:    { value: 0 },
      },
      vertexShader: `
        attribute vec3  aOrig;
        attribute vec3  aRandDir;
        attribute float aPhase;
        attribute vec3  aColor;
        uniform   float uTime;
        uniform   float uExplode;
        uniform   float uFade;
        varying   vec3  vColor;
        varying   float vBright;


        void main(){
          vColor = aColor;

          // Gentle breathe
          float b  = sin(uTime * 2.0 + aPhase) * 0.035;
          vec3  p  = aOrig + vec3(b, b*0.5, b);

          // Explode outward + twist vortex
          p += aRandDir * uExplode * 5.5;
          float tw = uExplode * 4.5;
          float ca = cos(tw+aPhase), sa = sin(tw+aPhase);
          p.xz  = vec2(p.x*ca - p.z*sa, p.x*sa + p.z*ca);

          // Collapse to zero on fade
          p *= 1.0 - uFade * 0.7;

          gl_Position  = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

          float pulse  = 0.4 + 0.6 * sin(uTime * 3.0 + aPhase);
          vBright      = pulse;
          gl_PointSize = (2.8 + pulse * 2.0) * (1.0 - uFade * 0.85)
                         * (320.0 / max(-gl_Position.z, 0.1));
        }
      `,
      fragmentShader: `
        varying vec3  vColor;
        varying float vBright;
        uniform float uFade;

        void main(){
          vec2  uv = gl_PointCoord - 0.5;
          float r  = length(uv);
          if(r > 0.5) discard;

          float core = 1.0 - smoothstep(0.0, 0.20, r);
          float halo = 1.0 - smoothstep(0.20, 0.5, r);
          float lum  = core + halo * 0.4 * (0.6 + vBright * 0.4);

          gl_FragColor = vec4(vColor * lum * 1.3, lum * (1.0 - uFade));
        }
      `,
      transparent:  true,
      depthWrite:   false,
      blending:     THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    /* ── Timeline uniforms ── */
    let explodeT = -1, fadeT = -1, phaseDone = false
    const startTime = performance.now()
    let raf

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = (performance.now() - startTime) / 1000
      mat.uniforms.uTime.value = t

      points.rotation.y = t * 0.3

      if (t > 1.6 && explodeT < 0) explodeT = t
      if (explodeT > 0) {
        const ep = Math.min((t - explodeT) / 1.1, 1)
        mat.uniforms.uExplode.value = ep

        if (ep > 0.65 && fadeT < 0) fadeT = t
      }
      if (fadeT > 0) {
        const fp = Math.min((t - fadeT) / 0.75, 1)
        mat.uniforms.uFade.value = fp
        if (fp >= 1 && !phaseDone) { phaseDone = true; onPhaseEnd() }
      }

      renderer.render(scene, camera)
    }
    tick()

    const onResize = () => {
      const nW = window.innerWidth, nH = window.innerHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH, false)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
    }
  }, [onPhaseEnd])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}

/* ════════════════════════════════════════════════════════════
   CHIP FLOORPLAN 3D — IC die with rising functional blocks
   + signal particles routing between them (Three.js / WebGL)
   ════════════════════════════════════════════════════════════ */
const BLOCKS = [
  { id:'CORE',   x:0,    z:0,    w:1.4, d:1.4, maxH:0.55, color:'#00e5a0', label:'PROC CORE',  delay:0    },
  { id:'CACHE',  x:-1.3, z:0,    w:0.7, d:0.9, maxH:0.35, color:'#38bdf8', label:'L2 CACHE',   delay:300  },
  { id:'BRAM',   x:1.3,  z:0,    w:0.7, d:0.9, maxH:0.35, color:'#8b5cf6', label:'BRAM',       delay:500  },
  { id:'DSP',    x:0,    z:-1.3, w:0.9, d:0.6, maxH:0.28, color:'#f59e0b', label:'DSP',        delay:700  },
  { id:'PLL',    x:-1.3, z:-1.1, w:0.5, d:0.5, maxH:0.22, color:'#e2e8f0', label:'PLL',        delay:900  },
  { id:'GPIO',   x:1.3,  z:-1.1, w:0.5, d:0.5, maxH:0.18, color:'#38bdf8', label:'GPIO',       delay:1100 },
  { id:'IO_N',   x:0,    z: 1.5, w:2.8, d:0.22,maxH:0.1,  color:'#00e5a0', label:'IO RING N',  delay:1300 },
  { id:'IO_S',   x:0,    z:-1.9, w:2.8, d:0.22,maxH:0.1,  color:'#00e5a0', label:'IO RING S',  delay:1400 },
]

const ROUTES = [
  ['CORE','CACHE'],['CORE','BRAM'],['CORE','DSP'],
  ['CACHE','IO_N'],['BRAM','GPIO'],['PLL','CORE'],['DSP','IO_S'],
]

function ChipFloorplan3D({ onDone }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = window.innerWidth, H = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100)
    camera.position.set(0, 5.5, 5)
    camera.lookAt(0, 0, 0)

    /* ── Lighting ── */
    scene.add(new THREE.AmbientLight(0x111122, 1.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6)
    dirLight.position.set(3, 8, 4)
    scene.add(dirLight)

    /* ── Die substrate (flat PCB base) ── */
    const subGeo = new THREE.BoxGeometry(3.6, 0.05, 4.4)
    const subMat = new THREE.MeshStandardMaterial({ color:0x0a0a1a, roughness:0.8, metalness:0.3 })
    const substrate = new THREE.Mesh(subGeo, subMat)
    substrate.position.y = -0.025
    scene.add(substrate)

    /* ── Grid lines on substrate ── */
    const gridHelper = new THREE.GridHelper(4, 20, 0x1e2038, 0x1e2038)
    gridHelper.position.y = 0.01
    scene.add(gridHelper)

    /* ── Build block meshes ── */
    const blockMeshes = {}
    const blockTargetH = {}
    BLOCKS.forEach(b => {
      const col = new THREE.Color(b.color)
      // Main filled block
      const geo  = new THREE.BoxGeometry(b.w, 0.001, b.d)
      const mat  = new THREE.MeshStandardMaterial({
        color: col, roughness:0.3, metalness:0.6,
        emissive: col, emissiveIntensity: 0.0,
        transparent: true, opacity: 0.0,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(b.x, 0, b.z)
      scene.add(mesh)

      // Wireframe edges
      const edges   = new THREE.EdgesGeometry(new THREE.BoxGeometry(b.w, 0.001, b.d))
      const edgeMat = new THREE.LineBasicMaterial({ color: col, transparent:true, opacity:0 })
      const wire    = new THREE.LineSegments(edges, edgeMat)
      wire.position.set(b.x, 0, b.z)
      scene.add(wire)

      blockMeshes[b.id] = { mesh, wire, mat, edgeMat, col, b }
      blockTargetH[b.id] = 0
    })

    /* ── Animate block rise after delay ── */
    BLOCKS.forEach(b => {
      setTimeout(() => { blockTargetH[b.id] = b.maxH }, b.delay)
    })

    /* ── Routing trace lines ── */
    const traceGroup = new THREE.Group()
    scene.add(traceGroup)
    const traceLines = []
    ROUTES.forEach(([aId, bId]) => {
      const ba = BLOCKS.find(x=>x.id===aId)
      const bb = BLOCKS.find(x=>x.id===bId)
      if (!ba || !bb) return
      const pts = [
        new THREE.Vector3(ba.x, 0.02, ba.z),
        new THREE.Vector3((ba.x+bb.x)/2, 0.02, (ba.z+bb.z)/2 + 0.1),
        new THREE.Vector3(bb.x, 0.02, bb.z),
      ]
      const curve = new THREE.CatmullRomCurve3(pts)
      const tGeo  = new THREE.BufferGeometry().setFromPoints(curve.getPoints(32))
      const tMat  = new THREE.LineBasicMaterial({
        color: new THREE.Color(BLOCKS.find(x=>x.id===aId).color),
        transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending,
      })
      const line = new THREE.Line(tGeo, tMat)
      traceGroup.add(line)
      traceLines.push({ line, tMat, curve, ba, bb })
    })

    /* ── Flow particles on routing traces ── */
    const flowParticles = traceLines.map(tr => ({
      ...tr,
      t: Math.random(),
      speed: 0.004 + Math.random() * 0.004,
    }))
    const flowGeo = new THREE.BufferGeometry()
    const flowPos = new Float32Array(flowParticles.length * 3)
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3))
    const flowMat = new THREE.PointsMaterial({
      size: 0.08, color: 0x00e5a0,
      transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const flowPoints = new THREE.Points(flowGeo, flowMat)
    scene.add(flowPoints)

    /* ── Progress counter ── */
    let progress = 0
    const totalDuration = 2800
    const startTime = performance.now()
    let raf, done = false

    /* ── Labels (HTML overlay — positioned via project) ── */
    // We'll skip HTML labels to keep it pure WebGL

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const elapsed = performance.now() - startTime
      progress = Math.min(elapsed / totalDuration, 1)

      /* Rise blocks */
      BLOCKS.forEach(b => {
        const bm = blockMeshes[b.id]
        const tH = blockTargetH[b.id]
        if (tH === 0) return
        const curH = bm.mesh.scale.y === 1 ? 0.001 : bm.mesh.geometry.parameters.height * bm.mesh.scale.y
        // Lerp height via scale
        const newH = Math.min((bm.mesh.geometry.parameters.height * bm.mesh.scale.y || 0.001) + tH * 0.04, tH)
        const sc   = newH / bm.mesh.geometry.parameters.height
        bm.mesh.scale.y = sc
        bm.mesh.position.y = newH / 2
        bm.wire.scale.y   = sc
        bm.wire.position.y = newH / 2

        const ramp = Math.min(sc / (tH / bm.b.maxH), 1)
        bm.mat.opacity = ramp * 0.75
        bm.mat.emissiveIntensity = ramp * 0.4
        bm.edgeMat.opacity = ramp * 0.9
      })

      /* Fade in routing traces after first 4 blocks rise */
      const traceFade = Math.max(0, Math.min((progress - 0.45) / 0.3, 1))
      traceLines.forEach(tr => { tr.tMat.opacity = traceFade * 0.5 })
      flowMat.opacity = traceFade * 0.85

      /* Move flow particles */
      flowParticles.forEach((fp, i) => {
        fp.t += fp.speed
        if (fp.t > 1) fp.t = 0
        const pt = fp.curve.getPoint(fp.t)
        flowPos[i*3]=pt.x; flowPos[i*3+1]=0.05; flowPos[i*3+2]=pt.z
      })
      flowGeo.attributes.position.needsUpdate = true

      /* Slow camera orbit */
      const angle = performance.now() * 0.0003
      camera.position.x = Math.sin(angle) * 6.5
      camera.position.z = Math.cos(angle) * 5.5
      camera.position.y = 4.5 + Math.sin(angle * 0.5) * 0.5
      camera.lookAt(0, 0.4, 0)

      renderer.render(scene, camera)

      if (progress >= 1 && !done) {
        done = true
        setTimeout(onDone, 400)
      }
    }
    tick()

    const onResize = () => {
      const nW=window.innerWidth, nH=window.innerHeight
      camera.aspect=nW/nH; camera.updateProjectionMatrix()
      renderer.setSize(nW,nH,false)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [onDone])

  return (
    <>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }} />
      {/* Progress ring overlay */}
      <div style={{
        position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)',
        fontFamily:'JetBrains Mono,monospace', fontSize:'0.68rem',
        color:'rgba(0,229,160,0.5)', letterSpacing:'0.15em', textAlign:'center',
        pointerEvents:'none',
      }}>
        <div style={{ color:'rgba(0,229,160,0.35)', fontSize:'0.6rem', marginBottom:4 }}>
          IC FLOORPLAN SYNTHESIS
        </div>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN LOADER
   ════════════════════════════════════════════════════════════ */
export default function Loader({ onComplete }) {
  const [phase,    setPhase]    = useState('dna')   // dna | log
  const [showSkip, setShowSkip] = useState(false)
  const [exiting,  setExiting]  = useState(false)

  const doExit = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(onComplete, 650)
  }, [exiting, onComplete])

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#060610',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── THREE.JS DNA CANVAS ── */}
          <AnimatePresence>
            {phase === 'dna' && (
              <motion.div key="dna-wrap"
                style={{ position:'absolute', inset:0, zIndex:0 }}
                exit={{ opacity:0 }} transition={{ duration:0.5 }}
              >
                <DNAScene onPhaseEnd={() => setPhase('log')} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── THREE.JS CHIP FLOORPLAN CANVAS ── */}
          <AnimatePresence>
            {phase === 'log' && (
              <motion.div key="chip-wrap"
                style={{ position:'absolute', inset:0, zIndex:0 }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.6 }}
              >
                <ChipFloorplan3D onDone={doExit} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vignette — lighter for chip phase so 3D is visible */}
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none', zIndex:1,
            background: phase === 'log'
              ? 'radial-gradient(ellipse at center, transparent 50%, #060610 100%)'
              : 'radial-gradient(ellipse at center, transparent 20%, #060610 85%)',
            transition: 'background 0.6s ease',
          }}/>

          {/* ── CENTER UI ── */}
          <div style={{ position:'relative', zIndex:10, textAlign:'center' }}>
            <AnimatePresence mode="wait">

              {phase === 'dna' && (
                <motion.div key="dna-ui"
                  initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
                  exit={{opacity:0,scale:0.9}}
                  transition={{delay:0.3, duration:0.6, ease:[0.22,1,0.36,1]}}
                >
                  <div style={{
                    fontFamily:'JetBrains Mono,monospace',
                    fontSize:'0.6rem', color:'rgba(0,229,160,0.25)',
                    letterSpacing:'0.35em', textTransform:'uppercase', marginBottom:12,
                  }}>
                    Sobhita Chip Inc. · REV 1.0
                  </div>

                  <div style={{
                    fontFamily:'Outfit,sans-serif', fontWeight:800,
                    fontSize:'clamp(3rem,9vw,6rem)',
                    letterSpacing:'-0.04em', lineHeight:1,
                    background:'linear-gradient(135deg,#00e5a0 0%,#38bdf8 50%,#8b5cf6 100%)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                    backgroundClip:'text',
                    filter:'drop-shadow(0 0 40px rgba(0,229,160,0.55))',
                  }}>
                    SONNB
                  </div>

                  <motion.div
                    initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.9}}
                    style={{
                      fontFamily:'JetBrains Mono,monospace',
                      fontSize:'0.72rem', color:'rgba(90,100,120,0.8)',
                      letterSpacing:'0.22em', marginTop:14,
                    }}
                  >
                    RTL · FPGA · VLSI
                  </motion.div>
                </motion.div>
              )}

              {phase === 'log' && (
                <motion.div key="chip-ui"
                  initial={{opacity:0}} animate={{opacity:1}}
                  transition={{duration:0.5}}
                  style={{ position:'absolute', inset:0, pointerEvents:'none' }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Corner brackets */}
          {[
            {top:20,left:20,   borderTopWidth:2,borderLeftWidth:2},
            {top:20,right:20,  borderTopWidth:2,borderRightWidth:2},
            {bottom:20,left:20, borderBottomWidth:2,borderLeftWidth:2},
            {bottom:20,right:20,borderBottomWidth:2,borderRightWidth:2},
          ].map((s,i)=>(
            <div key={i} style={{
              position:'absolute', width:28, height:28,
              borderStyle:'solid', borderColor:'rgba(0,229,160,0.15)',
              borderWidth:0, ...s,
            }}/>
          ))}

          {/* Skip */}
          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={doExit}
                style={{
                  position:'absolute', bottom:28, right:28,
                  background:'transparent',
                  border:'1px solid rgba(0,229,160,0.18)',
                  color:'rgba(90,100,120,0.8)',
                  fontFamily:'JetBrains Mono,monospace',
                  fontSize:'0.7rem', padding:'8px 18px',
                  borderRadius:6, cursor:'pointer',
                  letterSpacing:'0.1em', transition:'all 0.2s',
                  zIndex:20,
                }}
                onMouseEnter={e=>{
                  e.currentTarget.style.borderColor='#00e5a0'
                  e.currentTarget.style.color='#00e5a0'
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.borderColor='rgba(0,229,160,0.18)'
                  e.currentTarget.style.color='rgba(90,100,120,0.8)'
                }}
              >
                skip intro
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
