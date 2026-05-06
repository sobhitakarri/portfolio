import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'

const STATS = [
  { label: 'GPA',    value: '7.55 / 10.0',   icon: '◈', color: 'var(--accent)' },
  { label: 'Year',   value: '2023 – Present', icon: '◉', color: 'var(--blue)' },
  { label: 'Focus',  value: 'VLSI & RTL',    icon: '◎', color: 'var(--violet)' },
  { label: 'FPGA',   value: 'Basys-3',        icon: '◌', color: 'var(--accent)' },
]

const TOOLS = [
  'Vivado', 'Quartus', 'Keil uVision',
  'Proteus', 'LTspice', 'Arduino IDE', 'MATLAB',
]

export default function About() {
  const titleRef = useScrollFade()
  const bioRef   = useScrollFade(0.12)
  const statsRef = useScrollFade(0.2)

  return (
    <section id="about" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">

        {/* Header */}
        <div ref={titleRef} className="fade-up">
          <p className="section-eyebrow">01. About</p>
          <h2 className="section-title">Who I <span className="accent">Am</span></h2>
          <p className="section-subtitle">Engineer at the boundary of software logic and physical silicon.</p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 48,
          alignItems: 'start',
        }}>

          {/* Bio column */}
          <div ref={bioRef} className="fade-up">
            <div style={{
              lineHeight: 1.9,
              color: 'var(--text-body)',
              fontSize: '0.97rem',
            }}>
              <p style={{ marginBottom: 20 }}>
                I'm{' '}
                <span style={{ color: 'var(--text-bright)', fontWeight: 600 }}>K S V S Sobhita</span>, an
                Electronics and Communication Engineering undergraduate specializing in VLSI design,
                RTL development, and functional verification. My work focuses on FPGA-based digital
                design using SystemVerilog, protocol-level hardware debugging, and discrete circuit implementation.
              </p>
              <p style={{ marginBottom: 20 }}>
                I have hands-on experience with industry-standard EDA flows and I am passionate about
                contributing to silicon development and verification pipelines. From designing modular
                logic analyzers to building laser-based communication systems, I enjoy solving complex
                hardware challenges.
              </p>
              <p>
                Currently looking for a front-end VLSI or RTL design role where I can apply my skills
                in RTL design, functional verification, and FPGA prototyping.
              </p>
            </div>

            {/* Tool badges */}
            <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {TOOLS.map(t => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
          </div>

          {/* Stats column */}
          <div ref={statsRef} className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="card"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 10,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: s.color,
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--text-bright)',
                    lineHeight: 1.2,
                  }}>
                    {s.value}
                  </div>
                  <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    marginTop: 3,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {s.label}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Open to work banner */}
            <div style={{
              padding: '16px 20px',
              borderRadius: 10,
              border: '1px solid rgba(0, 229, 160, 0.2)',
              background: 'linear-gradient(135deg, rgba(0,229,160,0.06), rgba(56,189,248,0.04))',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <span style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--accent)',
                animation: 'pulse-dot 2s infinite',
                display: 'inline-block',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600 }}>
                  Open to Opportunities
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>
                  RTL Design · ASIC Verification · FPGA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
