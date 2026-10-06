import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'

const TOOLS = [
  'ROS 2', 'Python', 'C/C++', 'MATLAB', 'Simulink',
  'OpenCV', 'PyTorch', 'Gazebo', 'Verilog', 'SystemVerilog',
]

const FOCUS = [
  { label: 'Core Focus', value: 'Robotics & Autonomy' },
  { label: 'Research', value: 'LLM/VLM + Drones' },
  { label: 'Hardware', value: 'FPGA · Embedded · RTL' },
  { label: 'Tools', value: 'ROS 2 · Gazebo · MATLAB' },
]

export default function About() {
  const titleRef = useScrollFade()
  const bodyRef  = useScrollFade(0.12)

  return (
    <section id="about" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">

        <div ref={titleRef} className="fade-up">
          <p className="section-label">02 About</p>
          <h2 className="section-heading">
            Building the physical side of intelligence.
          </h2>
        </div>

        <div ref={bodyRef} className="fade-up fade-up-delay-1" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(36px, 6vw, 64px)',
          alignItems: 'start',
        }}>

          <div className="type-body" style={{ color: 'var(--text-body)' }}>
            <p style={{ marginBottom: 18, fontSize: 'var(--fs-lead)', lineHeight: 1.6 }}>
              I&apos;m <span style={{ color: 'var(--text-bright)', fontWeight: 600 }}>Sobhita Karri</span>,
              an Electronics & Communication Engineering undergraduate working at the intersection of
              {' '}<span style={{ color: 'var(--text-bright)' }}>robotics, autonomous systems, and embedded intelligence</span>,
              with a foundation in digital hardware and VLSI.
            </p>
            <p style={{ marginBottom: 18, color: 'var(--text-muted)' }}>
              Current work focuses on autonomous robotic systems that bring together perception,
              reasoning, planning, and real-time control — including an{' '}
              <span style={{ color: 'var(--text-bright)' }}>autonomous drone framework</span>{' '}
              with LLM/VLM reasoning, vision-based spatial grounding, dynamic replanning,
              and MATLAB/Simulink hardware-in-the-loop simulation.
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Hands-on experience also includes IMU-based stabilization and motion control
              through a self-balancing two-wheeler project.
            </p>

            <div style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TOOLS.map(t => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {FOCUS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  padding: '20px 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div className="type-xs" style={{ marginBottom: 6 }}>
                  {s.label}
                </div>
                <div className="type-h2">
                  {s.value}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{
                width: 6, height: 6,
                background: 'var(--accent)',
                display: 'inline-block',
                animation: 'pulse-dot 2.5s infinite',
                flexShrink: 0,
              }} />
              <div>
                <div className="type-sm" style={{ color: 'var(--text-bright)', fontWeight: 600 }}>
                  Open to opportunities
                </div>
                <div className="type-xs" style={{ marginTop: 4, letterSpacing: '0.08em' }}>
                  Robotics · Autonomous Systems · Embedded
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
