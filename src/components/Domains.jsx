import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'

const DOMAINS = [
  {
    num: '01',
    title: 'Autonomous Systems',
    desc: 'LLM/VLM-based reasoning, dynamic replanning, trajectory validation, and real-time telemetry for autonomous drone frameworks.',
    tags: ['Drones', 'LLM/VLM', 'Planning', 'Telemetry'],
  },
  {
    num: '02',
    title: 'Robot Perception & CV',
    desc: 'Vision-based spatial grounding, object detection, depth estimation, and sensor fusion for robotic perception pipelines.',
    tags: ['OpenCV', 'Depth', 'Segmentation', 'Fusion'],
  },
  {
    num: '03',
    title: 'Embedded & Control',
    desc: 'IMU-based stabilization, PID control, motion planning, and real-time embedded systems for physical robotic platforms.',
    tags: ['IMU', 'PID', 'Arduino', 'Real-time'],
  },
  {
    num: '04',
    title: 'Simulation & HIL',
    desc: 'MATLAB/Simulink hardware-in-the-loop simulation, Gazebo environments, and model-based design for system validation.',
    tags: ['MATLAB', 'Simulink', 'Gazebo', 'ROS 2'],
  },
  {
    num: '05',
    title: 'Digital Hardware & VLSI',
    desc: 'SystemVerilog/Verilog RTL design, FPGA development, protocol debugging, and functional verification for efficient hardware.',
    tags: ['Verilog', 'FPGA', 'RTL', 'Verification'],
  },
  {
    num: '06',
    title: 'HW-SW Integration',
    desc: 'Bridging software intelligence with physical hardware — from FPGA accelerators for CNNs to integrated robotic systems.',
    tags: ['Integration', 'CNN Accel', 'FPGA', 'Systems'],
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function Domains() {
  const titleRef = useScrollFade()

  return (
    <section id="domains" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">

        <div ref={titleRef} className="fade-up">
          <p className="section-label">03 Domains</p>
          <h2 className="section-heading">Core interests</h2>
          <p className="section-desc">
            Where software, hardware, and physical autonomy converge.
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border)' }}>
          {DOMAINS.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.24), duration: 0.5, ease }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr)',
                gap: 12,
                padding: '28px 0',
                borderBottom: '1px solid var(--border)',
              }}
              className="domain-row"
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr',
                gap: 20,
                alignItems: 'start',
              }}>
                <div style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.14em',
                  color: 'var(--text-faint)',
                  paddingTop: 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {d.num}
                  <span style={{ width: 6, height: 6, background: 'var(--accent)', flexShrink: 0 }} />
                </div>

                <div>
                  <h3 className="type-h2" style={{ marginBottom: 8 }}>
                    {d.title}
                  </h3>

                  <p className="type-sm" style={{
                    marginBottom: 14,
                    maxWidth: '54ch',
                  }}>
                    {d.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {d.tags.map(tag => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
