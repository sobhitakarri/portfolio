import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'

const STATS = [
  { label: 'GPA',         value: '7.55 / 10.0', icon: '◈' },
  { label: 'Year',        value: '2023 - Present', icon: '◉' },
  { label: 'Focus',       value: 'VLSI & RTL',    icon: '◎' },
  { label: 'FPGA',        value: 'Basys-3',      icon: '◌' },
]

const TOOLS = ['Vivado', 'Quartus', 'Keil uVision', 'Proteus', 'LTspice', 'Arduino IDE', 'MATLAB']

export default function About() {
  const bioRef = useScrollFade()
  const cardRef = useScrollFade(0.1)

  return (
    <section id="about" style={{ background: 'rgba(15,15,26,0.5)', position: 'relative', zIndex: 2 }}>
      <div className="section-wrapper">
        <div ref={bioRef} className="fade-up">
          <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.15em' }}>
            // 01. ABOUT
          </p>
          <h2 className="section-title">
            Who I <span className="accent">Am</span>
          </h2>
          <p className="section-subtitle">Engineer at the boundary of software logic and physical silicon.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          alignItems: 'start',
        }}>
          {/* Bio */}
          <div ref={bioRef} className="fade-up">
            <div style={{ lineHeight: 1.9, color: '#8892a4', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: 20 }}>
                I'm <span style={{ color: '#c9d1d9', fontWeight: 500 }}>K S V S Sobhita</span>, an Electronics and Communication Engineering
                undergraduate specializing in VLSI design, RTL development, and functional verification. My work focuses on 
                FPGA-based digital design using SystemVerilog, protocol-level hardware debugging, and discrete circuit implementation.
              </p>
              <p style={{ marginBottom: 20 }}>
                I have hands-on experience with industry-standard EDA flows and I am passionate about contributing to silicon 
                development and verification pipelines. From designing modular logic analyzers to building laser-based communication 
                systems, I enjoy solving complex hardware challenges.
              </p>
              <p>
                Currently, I am looking for a front-end VLSI or RTL design role where I can apply my skills in RTL design, 
                functional verification, and FPGA prototyping.
              </p>
            </div>

            {/* Tool badges */}
            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TOOLS.map(t => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
