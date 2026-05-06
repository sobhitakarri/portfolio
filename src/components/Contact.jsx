import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

// EmailJS keys — fill in from emailjs.com
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

const FIELDS = [
  { id: 'name',    type: 'text',     prompt: 'name@portfolio:~$' },
  { id: 'email',   type: 'email',    prompt: 'mail@portfolio:~$' },
  { id: 'message', type: 'textarea', prompt: 'msg@portfolio:~$'  },
]

const CHANNELS = [
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'github.com/sobhita-karri',
    href: 'https://github.com/sobhita-karri',
    color: 'var(--text-bright)',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/sobhita-karri',
    href: 'https://linkedin.com/in/sobhita-karri',
    color: 'var(--blue)',
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'sobhita1011@gmail.com',
    href: 'mailto:sobhita1011@gmail.com',
    color: 'var(--accent)',
  },
]

export default function Contact() {
  const titleRef = useScrollFade()
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [output, setOutput] = useState([])

  const addOutput = (line, color = 'var(--text-muted)') => {
    setOutput(prev => [...prev, { line, color, id: Date.now() + Math.random() }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      addOutput('ERROR: All fields required.', '#ff5f56')
      return
    }
    setStatus('sending')
    addOutput(`> Sending packet to Sobhita...`)
    addOutput(`> Payload: { name: "${form.name}", email: "${form.email}" }`)

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: form.name, from_email: form.email, message: form.message,
      }, EMAILJS_KEY)
      setStatus('success')
      addOutput('PACKET SENT.......... [200 OK]', 'var(--accent)')
      addOutput('>> Message delivered successfully.', 'var(--accent)')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      addOutput(`ERROR [500]: ${err?.text || 'Failed to send. Try LinkedIn.'}`, '#ff5f56')
    }
  }

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p className="section-eyebrow">06. Contact</p>
          <h2 className="section-title">Get in <span className="accent">Touch</span></h2>
          <p className="section-subtitle">Open for internships, collaborations, and hardware chats.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28,
        }}>
          {/* Terminal contact form */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Terminal titlebar */}
            <div style={{
              background: 'var(--bg-surface)',
              padding: '13px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              {['#ff5f56','#ffbd2e','var(--accent)'].map((c,i) => (
                <div key={i} style={{
                  width: 11, height: 11, borderRadius: '50%', background: c,
                  boxShadow: i === 2 ? '0 0 6px rgba(0,229,160,0.4)' : 'none',
                }} />
              ))}
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                marginLeft: 10,
              }}>
                ./contact --send
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '8px 0 20px' }}>
              {FIELDS.map(field => (
                <div key={field.id} className="terminal-line">
                  <span className="terminal-prompt">{field.prompt}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="terminal-input"
                      placeholder={`enter ${field.id}...`}
                      rows={4}
                      value={form[field.id]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                      style={{ resize: 'none', lineHeight: 1.65 }}
                    />
                  ) : (
                    <input
                      className="terminal-input"
                      type={field.type}
                      placeholder={`enter ${field.id}...`}
                      value={form[field.id]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              <div style={{ padding: '18px 20px 0' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    opacity: status === 'sending' ? 0.7 : 1,
                    gap: 8,
                  }}
                >
                  <FiSend size={14} />
                  {status === 'sending' ? 'Transmitting...' : 'Send Message'}
                </button>
              </div>
            </form>

            {/* Terminal output log */}
            {output.length > 0 && (
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '14px 20px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                lineHeight: 1.8,
                background: 'rgba(0,0,0,0.2)',
              }}>
                {output.map(o => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: o.color }}
                  >
                    {o.line}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Channels card */}
            <div className="card" style={{ padding: '22px 24px' }}>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                marginBottom: 18,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                // Transmission Channels
              </div>
              {CHANNELS.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 0',
                    borderBottom: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s ease',
                    borderRadius: 4,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.paddingLeft = '10px'
                    e.currentTarget.style.borderColor = 'rgba(0,229,160,0.2)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.paddingLeft = '0'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: 9,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: item.color,
                    flexShrink: 0,
                  }}>
                    <item.icon size={16} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      marginBottom: 2,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--text-bright)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Status card */}
            <div style={{
              padding: '20px 24px',
              borderRadius: 10,
              border: '1px solid rgba(0,229,160,0.18)',
              background: 'linear-gradient(135deg, rgba(0,229,160,0.05), rgba(56,189,248,0.04))',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginBottom: 10,
              }}>
                <span style={{
                  width: 9, height: 9, borderRadius: '50%',
                  background: 'var(--accent)',
                  boxShadow: '0 0 10px var(--accent)',
                  animation: 'pulse-dot 2s infinite',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}>
                  Open to Opportunities
                </span>
              </div>
              <p style={{ color: 'var(--text-body)', fontSize: '0.83rem', lineHeight: 1.7 }}>
                Looking for internships and research roles in RTL design,
                ASIC verification, and low-level embedded systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
