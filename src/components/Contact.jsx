import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScrollFade } from '../hooks/useScrollFade'

// EmailJS keys — fill in your own from emailjs.com
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'

const FIELDS = [
  { id: 'name',    label: 'name',    type: 'text',  prompt: 'user@portfolio:~$ enter name' },
  { id: 'email',   label: 'email',   type: 'email', prompt: 'user@portfolio:~$ enter email' },
  { id: 'message', label: 'message', type: 'textarea', prompt: 'user@portfolio:~$ enter message' },
]

export default function Contact() {
  const titleRef = useScrollFade()
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [status, setStatus]   = useState('idle') // idle | sending | success | error
  const [output, setOutput]   = useState([])

  const addOutput = (line, color = '#8892a4') => {
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
      // Dynamic import so the build works even without EmailJS keys
      const emailjs = await import('@emailjs/browser')
      await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
        from_name:  form.name,
        from_email: form.email,
        message:    form.message,
      }, EMAILJS_KEY)

      setStatus('success')
      addOutput('PACKET SENT.......... [200 OK]', '#00ff88')
      addOutput('>> Message delivered successfully.', '#00ff88')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      addOutput(`ERROR [500]: ${err?.text || 'Failed to send. Try LinkedIn.'}`, '#ff5f56')
    }
  }

  return (
    <section id="contact" style={{ position: 'relative', zIndex: 2 }}>
      <div className="section-wrapper">
        <div ref={titleRef} className="fade-up">
          <p style={{ color: '#00ff88', fontFamily: 'JetBrains Mono', fontSize: '0.8rem', marginBottom: 8, letterSpacing: '0.15em' }}>
            // 06. CONTACT
          </p>
          <h2 className="section-title">Get in <span className="accent">Touch</span></h2>
          <p className="section-subtitle">Open for internships, collaborations, and hardware chats.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 32,
        }}>
          {/* Terminal Form */}
          <div className="ic-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Terminal titlebar */}
            <div style={{
              background: '#13131f',
              padding: '12px 20px',
              borderBottom: '1px solid #1e2030',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff88' }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8892a4', marginLeft: 12 }}>
                ./contact --send
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '8px 0 20px' }}>
              {FIELDS.map(field => (
                <div key={field.id} className="terminal-line">
                  <span className="terminal-prompt">
                    {field.id === 'name'    ? 'name@portfolio:~$'  :
                     field.id === 'email'   ? 'mail@portfolio:~$'  :
                                              'msg@portfolio:~$'}
                  </span>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="terminal-input"
                      placeholder={field.prompt}
                      rows={3}
                      value={form[field.id]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                      style={{ resize: 'none', lineHeight: 1.6 }}
                    />
                  ) : (
                    <input
                      className="terminal-input"
                      type={field.type}
                      placeholder={field.placeholder || `enter ${field.label}`}
                      value={form[field.id]}
                      onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                    />
                  )}
                </div>
              ))}

              {/* Submit */}
              <div style={{ padding: '16px 16px 0' }}>
                <button
                  type="submit"
                  className="btn-circuit filled"
                  disabled={status === 'sending'}
                  style={{ width: '100%', justifyContent: 'center', opacity: status === 'sending' ? 0.7 : 1 }}
                >
                  {status === 'sending' ? '[ TRANSMITTING... ]' : '[ TRANSMIT ]'}
                </button>
              </div>
            </form>

            {/* Terminal output */}
            {output.length > 0 && (
              <div style={{
                borderTop: '1px solid #1e2030',
                padding: '12px 16px',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.72rem',
                lineHeight: 1.8,
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

          {/* Info panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ic-card" style={{ padding: '24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8892a4', marginBottom: 16, letterSpacing: '0.1em' }}>
                // TRANSMISSION CHANNELS
              </div>
              {[
                { icon: '⟨/⟩', label: 'GitHub',   value: 'github.com/sobhita-karri', href: 'https://github.com/sobhita-karri' },
                { icon: '◈',   label: 'LinkedIn',  value: 'linkedin.com/in/sobhita-karri', href: 'https://linkedin.com/in/sobhita-karri' },
                { icon: '✉',   label: 'Email',     value: 'sobhita1011@gmail.com', href: 'mailto:sobhita1011@gmail.com' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 0',
                    borderBottom: '1px solid #1e2030',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
                >
                  <span style={{ color: '#00ff88', fontSize: '1rem', width: 20, textAlign: 'center' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: '#8892a4' }}>{item.label}</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#c9d1d9' }}>{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="ic-card" style={{ padding: '20px 24px' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: '#8892a4', marginBottom: 12, letterSpacing: '0.1em' }}>
                // STATUS
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: 'JetBrains Mono', fontSize: '0.82rem', color: '#c9d1d9',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 8px #00ff88' }} />
                Open to opportunities
              </div>
              <p style={{ color: '#8892a4', fontSize: '0.8rem', marginTop: 10, lineHeight: 1.7 }}>
                Looking for internships and research roles in RTL design, ASIC verification, and low-level systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
