import React from "react";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { MapPin, Phone, Mail } from "lucide-react";
import { TextHoverEffect, FooterBackgroundGradient } from "./ui/hover-footer";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { label: "About",    href: "#about" },
      { label: "Skills",   href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Resume",   href: "#resume" },
      { label: "Blog",     href: "#blog" },
    ],
  },
  {
    title: "Helpful Links",
    links: [
      { label: "GitHub",   href: "https://github.com/sobhita-karri",     external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/sobhita-karri", external: true },
      { label: "Contact",  href: "#contact", pulse: true },
    ],
  },
];

const contactInfo = [
  {
    icon: <Mail size={18} className="text-[#00e5a0]" />,
    text: "sobhita1011@gmail.com",
    href: "mailto:sobhita1011@gmail.com",
  },
  {
    icon: <MapPin size={18} className="text-[#00e5a0]" />,
    text: "India",
  },
];

const socialLinks = [
  { icon: <FiGithub   size={20} />, label: "GitHub",   href: "https://github.com/sobhita-karri" },
  { icon: <FiLinkedin size={20} />, label: "LinkedIn", href: "https://linkedin.com/in/sobhita-karri" },
  { icon: <FiMail     size={20} />, label: "Email",    href: "mailto:sobhita1011@gmail.com" },
];

export default function Footer() {
  return (
    <footer
      className="relative rounded-3xl overflow-hidden mx-4 mb-4 mt-0"
      style={{ background: "#060610cc" }}
    >
      <div className="max-w-7xl mx-auto px-8 py-12 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">

          {/* Brand */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span style={{ color: "var(--accent)" }} className="text-3xl font-extrabold">
                &lt;/&gt;
              </span>
              <span className="text-white text-2xl font-bold font-display tracking-wide">
                SOBHITA
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-body)" }}>
              Full-stack developer &amp; systems engineer crafting purposeful
              digital experiences from first principles.
            </p>
            {/* Tech stack badge */}
            <div
              className="flex items-center gap-2 text-xs font-mono"
              style={{ color: "var(--text-faint)" }}
            >
              <span style={{ color: "var(--accent)", opacity: 0.7 }}>{"<"}</span>
              React · Vite · Framer Motion
              <span style={{ color: "var(--accent)", opacity: 0.7 }}>{">"}</span>
            </div>
          </div>

          {/* Link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-base font-semibold mb-5 font-display">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--text-body)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-body)")}
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span
                        className="absolute top-0.5 right-0 w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white text-base font-semibold mb-5 font-display">
              Contact
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--text-body)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-body)")}
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: "var(--text-body)" }}>
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, var(--border-mid) 30%, var(--accent) 50%, var(--border-mid) 70%, transparent 100%)",
            marginBottom: "2rem",
          }}
        />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          {/* Social icons */}
          <div className="flex space-x-3">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                  background: "var(--bg-elevated)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "var(--accent)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,229,160,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "var(--text-muted)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p style={{ color: "var(--text-faint)" }} className="font-mono text-xs">
            © {new Date().getFullYear()} Sobhita Karri · Built with RTL-level precision
          </p>
        </div>
      </div>

      {/* Big hover text — visible on large screens only */}
      <div className="lg:flex hidden h-[28rem] -mt-48 -mb-32">
        <TextHoverEffect text="SOBHITA" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
