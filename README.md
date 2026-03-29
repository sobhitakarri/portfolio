# RTL Engineer Portfolio — K S V S Sobhita

A high-fidelity, transistor-themed portfolio website designed for an RTL Design and FPGA Engineer. The project features a cinematic loading sequence, interactive hardware components, and a clean, technical aesthetic.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Contact Form**: [EmailJS](https://www.emailjs.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

## ✨ Key Features

- **Cinematic Loader**: 4-phase boot sequence including PCB trace drawing, chip zoom (using `404-chip.svg`), and a terminal boot log.
- **Hero Section**: Features interactive logic gate animations and an animated PCB trace background (`hero-pcb-traces.svg`).
- **Skills Matrix**: Categorized technical proficiency display (Verilog & VHDL).
- **Projects**: Filterable project gallery showcasing hardware designs (e.g., Logic Analyzer using FPGA).
- **Terminal Contact Form**: A unique, interactive terminal-style interface for sending messages.
- **Resume Preview**: Integrated PDF viewer for the academic and professional resume.

## 🛠️ Setup & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components/`: React components for each section (Hero, About, Projects, etc.).
- `src/data/`: Centralized JS files for skills and project data.
- `src/hooks/`: Custom React hooks like `useScrollFade` and `useTypewriter`.
- `public/`: Static assets including SVGs and the resume PDF.

---
Built by **K S V S Sobhita**
