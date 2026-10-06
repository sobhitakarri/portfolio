import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi'

const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

const FIELDS = [
  { id: 'name',    type: 'text',     prompt: 'Name' },
  { id: 'email',   type: 'email',    prompt: 'Email' },
  { id: 'message', type: 'textarea', prompt: 'Message' },
]

const CHANNELS = [
  {
    icon: FiGithub,
    label: 'GitHub',
    value: 'github.com/sobhitakarri',
    href: 'https://github.com/sobhitakarri',
  },
  {
    icon: FiLinkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/in/sobhita-karri',
    href: 'https://www.linkedin.com/in/sobhita-karri-a89506316/',
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'sobhita1011@gmail.com',
    href: 'mailto:sobhita1011@gmail.com',
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
      addOutput('All fields required.', '#c45c26')
      return
    }
    setStatus('sending')
    addOutput('Sending message…')

    try {
      const emailjs = await import('@emailjs/browser')
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name: form.name, from_email: form.email, message: form.message,
      }, EMAILJS_KEY)
      setStatus('success')
      addOutput('Message sent.', 'var(--accent)')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      addOutput(err?.text || 'Failed to send. Try LinkedIn or email.', '#c45c26')
    }
  }

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-divider" />
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p className="section-label">06 Contact</p>
          <h2 className="section-heading">Get in touch</h2>
          <p className="section-desc">Open for collaborations, internships, and interesting conversations.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 48,
        }}>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <form onSubmit={handleSubmit}>
              {FIELDS.map(field => (
                <div key={field.id} className="terminal-line">
                  <span className="terminal-prompt">{field.prompt}</span>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="terminal-input"
                      placeholder="Type here…"
                      rows={3}
                      value={form[field.id]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                      style={{ resize: 'none', lineHeight: 1.65 }}
                    />
                  ) : (
                    <input
                      className="terminal-input"
                      type={field.type}
                      placeholder="Type here…"
                      value={form[field.id]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              <div style={{ paddingTop: 24 }}>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'sending'}
                  style={{
                    opacity: status === 'sending' ? 0.7 : 1, gap: 8,
                  }}
                >
                  <FiSend size={13} />
                  {status === 'sending' ? 'Sending…' : 'Send'}
                </button>
              </div>
            </form>

            {output.length > 0 && (
              <div style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid var(--border)',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '0.72rem', lineHeight: 1.8,
              }}>
                {output.map(o => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ color: o.color }}
                  >
                    {o.line}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '0.65rem',
              color: 'var(--text-faint)',
              marginBottom: 8,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              Connect
              <span style={{ width: 6, height: 6, background: 'var(--accent)' }} />
            </div>

            {CHANNELS.map(item => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '18px 0',
                  borderBottom: '1px solid var(--border)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'padding-left 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.paddingLeft = '8px' }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = '0' }}
              >
                <item.icon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <div>
                  <div style={{
                    fontSize: '0.65rem', color: 'var(--text-faint)',
                    marginBottom: 2,
                    fontFamily: 'IBM Plex Mono, monospace',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '0.95rem', fontWeight: 500,
                    color: 'var(--text-bright)',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.value}
                  </div>
                </div>
              </a>
            ))}

            <div style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{
                  width: 6, height: 6,
                  background: 'var(--accent)',
                  animation: 'pulse-dot 2.5s infinite',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontFamily: 'Inter Tight, sans-serif',
                  fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-bright)',
                }}>
                  Available
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Looking for roles in robotics, autonomous systems, and embedded intelligence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
