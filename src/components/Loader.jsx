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
  { id:'ARM',    x:0,    z:0,    w:1.0, d:1.0, maxH:0.22, color:'#2a2a2a', label:'ARM Cortex-M3', delay:0 },
  { id:'SRAM',   x:1.0,  z:-0.5, w:1.2, d:0.3, maxH:0.18, color:'#2461b5', label:'8-64KB SRAM', delay:200 },
  { id:'FLASH',  x:0.9,  z:-0.1, w:1.4, d:0.3, maxH:0.20, color:'#1a4a99', label:'256KB FLASH', delay:300 },
  { id:'PWR',    x:-1.3, z:-0.5, w:0.6, d:0.4, maxH:0.18, color:'#2461b5', label:'Pwr Mgmt', delay:400 },
  { id:'SWD',    x:-0.2, z:-1.6, w:0.6, d:0.3, maxH:0.18, color:'#2461b5', label:'SWD', delay:450 },
  { id:'UDB1',   x:0.5,  z:-1.5, w:0.6, d:0.3, maxH:0.18, color:'#1e8a42', label:'UDB', delay:500 },
  { id:'UDB2',   x:1.2,  z:-1.5, w:0.6, d:0.3, maxH:0.18, color:'#1e8a42', label:'UDB', delay:550 },
  { id:'SPI',    x:1.3,  z:-1.1, w:0.6, d:0.3, maxH:0.18, color:'#1e8a42', label:'SPI', delay:600 },
  { id:'I2C',    x:1.4,  z:-0.7, w:0.6, d:0.3, maxH:0.18, color:'#1e8a42', label:'I2C', delay:650 },
  { id:'TCPWM1', x:-0.2, z: 0.6, w:0.7, d:0.3, maxH:0.18, color:'#1e8a42', label:'TCPWM', delay:700 },
  { id:'TCPWM2', x:-0.1, z: 1.0, w:0.7, d:0.3, maxH:0.18, color:'#1e8a42', label:'TCPWM', delay:750 },
  { id:'ADC1',   x:-0.9, z:-0.1, w:0.7, d:0.3, maxH:0.18, color:'#b55a14', label:'SAR ADC', delay:800 },
  { id:'ADC2',   x:-1.1, z: 0.3, w:0.7, d:0.3, maxH:0.18, color:'#b55a14', label:'SAR ADC', delay:850 },
  { id:'DAC1',   x:-1.0, z: 0.7, w:0.6, d:0.3, maxH:0.18, color:'#b55a14', label:'DAC', delay:900 },
  { id:'DAC2',   x:-0.9, z: 1.1, w:0.6, d:0.3, maxH:0.18, color:'#b55a14', label:'DAC', delay:950 },
  { id:'CMP1',   x:-1.0, z: 1.5, w:0.6, d:0.3, maxH:0.18, color:'#b55a14', label:'CMP', delay:1000 },
  { id:'CAN',    x:-0.7, z:-0.9, w:0.6, d:0.3, maxH:0.18, color:'#9e1f1f', label:'CAN', delay:1100 },
  { id:'LIN',    x:0.4,  z:-0.9, w:0.6, d:0.3, maxH:0.18, color:'#9e1f1f', label:'LIN', delay:1150 },
  { id:'USB',    x:1.3,  z: 0.4, w:0.5, d:0.5, maxH:0.18, color:'#9e1f1f', label:'USB 2.0', delay:1200 },
  { id:'CAP',    x:-1.3, z:-1.0, w:0.7, d:0.3, maxH:0.18, color:'#a07800', label:'CapSense', delay:1300 },
  { id:'DMA',    x:0.8,  z: 0.6, w:0.6, d:0.3, maxH:0.18, color:'#a07800', label:'DMA', delay:1350 },
  { id:'GPIO',   x:-1.2, z:-1.5, w:0.8, d:0.3, maxH:0.18, color:'#7030b0', label:'GPIO x72', delay:1400 },
]

function createLabelTexture(text, bgColor) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = 'bold 48px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(text, 256, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 4
  return texture
}

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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100)
    camera.position.set(0, 4, 4.5)
    camera.lookAt(0, 0, 0)

    /* ── 3-Point PBR Lighting ── */
    const hemi = new THREE.HemisphereLight(0xfff8e7, 0x1a1a2e, 1.0)
    scene.add(hemi)

    // Key: warm overhead (fills chip from top-left)
    const keyLight = new THREE.DirectionalLight(0xfff5d0, 3.5)
    keyLight.position.set(4, 9, 3)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 2048
    keyLight.shadow.mapSize.height = 2048
    keyLight.shadow.bias = -0.0003
    keyLight.shadow.camera.near = 0.1
    keyLight.shadow.camera.far = 30
    keyLight.shadow.camera.left = -6
    keyLight.shadow.camera.right = 6
    keyLight.shadow.camera.top = 6
    keyLight.shadow.camera.bottom = -6
    scene.add(keyLight)

    // Rim: cold blue from behind to separate chip from bg
    const rimLight = new THREE.DirectionalLight(0x8ab4e8, 1.8)
    rimLight.position.set(-3, 2, -5)
    scene.add(rimLight)

    // Bounce: subtle warm orange from low-front (fakes PCB bounce)
    const bounceLight = new THREE.PointLight(0xff8833, 0.6, 8)
    bounceLight.position.set(0, -0.5, 2.5)
    scene.add(bounceLight)

    /* ── IC Body ── */
    const bodyGeo = new THREE.BoxGeometry(4.2, 0.2, 4.2)
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85, metalness: 0.15 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = -0.1
    body.receiveShadow = true
    scene.add(body)

    /* ── Gold Dots (Vias) ── */
    const dotMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.2, metalness: 0.9 })
    const dotGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 8)
    for(let x = -1.8; x <= 1.8; x += 0.4) {
      for(let z = -1.8; z <= 1.8; z += 0.4) {
        if (Math.abs(x) > 1.4 || Math.abs(z) > 1.4) {
          const dot = new THREE.Mesh(dotGeo, dotMat)
          dot.position.set(x, 0.005, z)
          scene.add(dot)
        }
      }
    }

    /* ── Gull-Wing Pins (L-shaped, 2 boxes per pin) ── */
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.25, metalness: 0.95 })
    const PITCH = 0.2, BODY_EDGE = 2.1, FOOT_REACH = 0.5
    for (let i = -1.8; i <= 1.8; i += PITCH) {
      // Each side: vertical leg + horizontal foot
      const sides = [
        { axis:'z', sign: 1 },  // front
        { axis:'z', sign:-1 },  // back
        { axis:'x', sign: 1 },  // right
        { axis:'x', sign:-1 },  // left
      ]
      sides.forEach(({ axis, sign }) => {
        // Vertical leg
        const legGeo = new THREE.BoxGeometry(
          axis==='z' ? 0.07 : 0.07,
          0.22,
          axis==='z' ? 0.07 : 0.07
        )
        const leg = new THREE.Mesh(legGeo, pinMat)
        if (axis==='z') leg.position.set(i, -0.01, sign * BODY_EDGE)
        else             leg.position.set(sign * BODY_EDGE, -0.01, i)
        leg.receiveShadow = true
        leg.castShadow   = true
        scene.add(leg)

        // Horizontal foot
        const footGeo = new THREE.BoxGeometry(
          axis==='z' ? 0.07 : FOOT_REACH,
          0.04,
          axis==='z' ? FOOT_REACH : 0.07
        )
        const foot = new THREE.Mesh(footGeo, pinMat)
        const footOffset = BODY_EDGE + FOOT_REACH / 2
        if (axis==='z') foot.position.set(i, -0.12, sign * footOffset)
        else             foot.position.set(sign * footOffset, -0.12, i)
        foot.receiveShadow = true
        scene.add(foot)
      })
    }

    /* ── Build block meshes ── */
    const blockMeshes = {}
    const blockTargetH = {}
    BLOCKS.forEach(b => {
      const topTex = createLabelTexture(b.label, b.color)
      // Side: matte molded plastic — rougher, slight sheen
      const matSide = new THREE.MeshStandardMaterial({
        color: b.color, roughness: 0.72, metalness: 0.0,
        transparent: true, opacity: 0.0
      })
      // Top: slight gloss to show the label texture cleanly
      const matTop = new THREE.MeshStandardMaterial({
        map: topTex, roughness: 0.45, metalness: 0.05,
        transparent: true, opacity: 0.0
      })
      const materials = [matSide, matSide, matTop, matSide, matSide, matSide]
      const geo = new THREE.BoxGeometry(b.w, 0.001, b.d)
      const mesh = new THREE.Mesh(geo, materials)
      mesh.position.set(b.x, 0.005, b.z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      scene.add(mesh)
      blockMeshes[b.id] = { mesh, materials, b }
      blockTargetH[b.id] = 0
    })

    /* ── Animate block rise after delay ── */
    BLOCKS.forEach(b => {
      setTimeout(() => { blockTargetH[b.id] = b.maxH }, b.delay)
    })

    /* ── Progress counter ── */
    let progress = 0
    const totalDuration = 2800
    const startTime = performance.now()
    let raf, done = false

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
        const newH = Math.min(curH + tH * 0.04, tH)
        const sc   = newH / bm.mesh.geometry.parameters.height
        bm.mesh.scale.y = sc
        bm.mesh.position.y = newH / 2 + 0.005
        
        const ramp = Math.min(sc / (tH / bm.b.maxH), 1)
        bm.materials.forEach(m => { m.opacity = ramp })
      })

      /* Gentle cinematic sway (close-up) */
      const t = performance.now() * 0.0003
      camera.position.x = Math.sin(t * 0.7) * 1.5
      camera.position.z = 4.2 + Math.cos(t) * 0.8
      camera.position.y = 3.5 + Math.sin(t * 0.5) * 0.4
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)

      if (progress >= 1 && !done) {
        done = true
        setTimeout(onDone, 600)
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
