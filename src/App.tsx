import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Download,
  Send,
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  Check,
  X,
  Compass,
  ChevronRight,
  Shield,
  Activity,
  Cpu,
  Database,
  Gauge,
  Sliders,
  CheckCircle2,
  Sparkles,
  ChevronUp,
  Mountain,
  Hammer,
  Layers
} from 'lucide-react';

import { Project, Experience, Education } from './types';
import { projects, experiences, educations, skillGroups, personalInfo } from './data';
import { SpecialtyTriangle } from './components/SpecialtyTriangle';
import { InteractiveSimulator } from './components/InteractiveSimulators';

function LogoVG({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 110" className={className} fill="currentColor">
      {/* V left slanted bar - adjusted for exact match with rounded tips */}
      <path d="M 18,10 C 23,10 27,13 32,22 L 54,61 C 56,65 52,69 48,69 C 45,69 43,67 41,63 L 20,25 C 17,21 16,14 18,10 Z" />
      {/* Top central dot */}
      <circle cx="66" cy="18" r="8.5" />
      {/* Central circular sphere with vertical split ('O'/'G' dynamic eye) */}
      <g>
        {/* Left half of the circle */}
        <path d="M 95,29 A 21,21 0 0,0 95,71 A 11,21 0 0,1 95,29 Z" />
        {/* Right half of the circle */}
        <path d="M 95,29 A 11,21 0 0,1 95,71 A 21,21 0 0,0 95,29 Z" />
      </g>
      {/* Right dot */}
      <circle cx="127" cy="34" r="5" />
      {/* Tail under circle */}
      <path d="M 80,72 C 80,77 84,81 92,84 L 110,88 C 114,89 116,87 116,84 C 116,80 112,77 106,75 L 85,71 C 82,70 80,71 80,72 Z" />
      {/* Footer dot */}
      <circle cx="106" cy="97" r="5" />
    </svg>
  );
}

export default function App() {
  // Theme management: Default to dark theme for premium engineering vibe, togglable
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Active Category filter
  const [activeCategory, setActiveCategory] = useState<'all' | 'biomechanics' | 'mechanics' | 'composites' | 'simulation'>('all');

  // Selected project for modal overlay details
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Active tab inside CV panels
  const [resumeTab, setResumeTab] = useState<'experience' | 'education' | 'skills'>('experience');

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Download simulation state
  const [downloadingCV, setDownloadingCV] = useState<boolean>(false);

  // Scroll to top visibility
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Synced background classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Monitor scroll height
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleDownloadCV = () => {
    setDownloadingCV(true);
    setTimeout(() => {
      setDownloadingCV(false);
      
      // We will trigger a real download of our elegant print layout CV
      const link = document.createElement('a');
      link.href = 'https://raw.githubusercontent.com/GuilhemVth/CV/main/CV_Guilhem_Vauthier_Biomecanique.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const submitContactForm = (e: FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactSubmitted(false);
    }, 4500);
  };

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div id="app-container" className={`min-h-screen font-sans antialiased transition-colors duration-500 overflow-x-hidden ${
      darkMode ? 'bg-[#0A0A0A] text-slate-100' : 'bg-[#F9FAFB] text-slate-900'
    }`}>
      {/* Decorative High-Tech Grid & Background Glows */}
      <div className="absolute top-0 left-0 right-0 h-[700px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none blur-[100px] z-0" />
      
      {/* FIXED HEADER WITH PROFESSIONAL SEGMENT SCROLLS */}
      <nav id="navbar" className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode ? 'bg-[#0A0A0A]/80 border-neutral-900/80 text-white' : 'bg-white/80 border-slate-200/80 text-slate-905'
      }`}>
        <div id="nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div id="nav-logo" className="flex items-center gap-3">
            <div id="logo-icon" className="h-10 w-10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <LogoVG className="h-full w-auto" />
            </div>
            <div id="logo-text" className="hidden sm:block text-left">
              <span className="font-extrabold text-sm block tracking-wide">Guilhem Vauthier</span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-wider block uppercase">Ingénieur Innovation R&D</span>
            </div>
          </div>

          <div id="nav-actions" className="flex items-center gap-3 sm:gap-6">
            <div id="nav-links" className="hidden md:flex space-x-6 text-[11px] font-mono font-bold tracking-wider uppercase">
              <a href="#projets" className="hover:text-indigo-400 transition-colors">Portfolio</a>
              <a href="#specialties-interactive-card" className="hover:text-indigo-400 transition-colors">Triangle d'Aptitude</a>
              <a href="#parcours" className="hover:text-indigo-400 transition-colors">Curriculum</a>
              <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact</a>
            </div>

            {/* Dark/Light mode toggle widget */}
            <button
              id="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded border transition-all duration-200 hover:scale-105 ${
                darkMode ? 'border-neutral-800 bg-neutral-900 text-amber-400 hover:bg-neutral-800' : 'border-slate-200 bg-slate-100 text-indigo-700 hover:bg-slate-200'
              }`}
              title="Permuter le thème"
              aria-label="Permuter le thème"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Primary resume trigger - direct download anchor tag to bypass inner sandboxed iframe constraints */}
            <a
              id="btn-cv"
              href="https://raw.githubusercontent.com/GuilhemVth/CV/main/CV_Guilhem_Vauthier_Biomecanique.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-mono font-bold flex items-center gap-1.5 px-3.5 py-2 rounded transition-all duration-200 active:scale-95 cursor-pointer ${
                darkMode ? 'bg-neutral-900 border border-neutral-800 hover:border-indigo-500/30 text-slate-100 hover:border-indigo-500/50' : 'bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-900'
              }`}
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              <span>Consulter CV PDF</span>
            </a>
          </div>
        </div>
      </nav>

      <main id="main-content" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 z-10 space-y-24">
        
        {/* HERO HEADER AREA - ACCENT INDUSTRIAL DESIGN */}
        <section id="hero-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-4">
          <div id="hero-meta" className="lg:col-span-7 space-y-6 text-left">
            <div id="hero-badge" className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-550/10 border border-indigo-500/20 rounded-full text-xs font-mono text-indigo-400">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Master IEMH & GMA • Profil Pluridisciplinaire
            </div>

            <h1 id="hero-title" className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-none text-white font-sans">
              Mécanique et biomécanique <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                déclinées pour la performance.
              </span>
            </h1>

            <p id="hero-subtitle" className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {personalInfo.description} Ma double expertise me permet d'équilibrer rigoureusement la théorie du dimensionnement matériel avec les exigences complexes d'adaptation au corps humain.
            </p>

            {/* Micro details contact cards */}
            <div id="hero-coordinations" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono pt-2">
              <a href="mailto:guilhem.vth@gmail.com" className="flex items-center gap-2 group hover:text-indigo-400">
                <div className="h-7 w-7 bg-indigo-500/10 rounded flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/30 shrink-0">
                  <Mail className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span>{personalInfo.email}</span>
              </a>
              <a href="tel:0652424430" className="flex items-center gap-2 group hover:text-indigo-400">
                <div className="h-7 w-7 bg-indigo-500/10 rounded flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/30 shrink-0">
                  <Phone className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span>{personalInfo.phone}</span>
              </a>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="h-7 w-7 bg-indigo-500/10 rounded flex items-center justify-center border border-indigo-500/20 shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span>{personalInfo.address}</span>
              </div>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group hover:text-indigo-400">
                <div className="h-7 w-7 bg-indigo-500/10 rounded flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/30 shrink-0">
                  <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span>LinkedIn / guilhem-vauthier</span>
              </a>
            </div>

            <div id="hero-ctas" className="flex flex-wrap gap-3.5 pt-4">
              <a
                href="#projets"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-xs tracking-wider uppercase px-5 py-3 rounded transition-all shadow-md flex items-center gap-1.5 shadow-indigo-600/10"
              >
                <span>Explorer les projets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#parcours"
                className={`border font-mono text-xs font-bold tracking-wider uppercase px-5 py-3 rounded flex items-center gap-1.5 transition-all ${
                  darkMode ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-slate-200' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-805'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5 text-indigo-400" />
                <span>Expérience CV</span>
              </a>
            </div>
          </div>

          {/* Interactive Specialty Triangle placed on Hero Right column */}
          <div id="hero-graphic" className="lg:col-span-5 flex justify-center w-full">
            <SpecialtyTriangle darkMode={darkMode} />
          </div>
        </section>

        {/* PROJECTS PORTFOLIO ACCORDION / BENTO GRID */}
        <section id="projets" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div id="portfolio-meta" className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4 text-left">
              <div id="portfolio-title-group" className="space-y-2">
                <h2 id="portfolio-title" className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                  <Compass className="h-6 w-6 text-indigo-500" />
                  Projets d'Ingénierie & R&D
                </h2>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Sélection de projets de recherche, de conception R&D avancée et de modélisation physique.
                </p>
              </div>

              {/* Custom interactive segmented visual filters - No emojis */}
              <div id="portfolio-filters" className="flex flex-wrap gap-1 bg-neutral-900 border border-neutral-805 p-1 rounded-lg">
                {[
                  { id: 'all', label: 'Tous' },
                  { id: 'biomechanics', label: 'Biomécanique & Sport' },
                  { id: 'mechanics', label: 'Conception CAO' },
                  { id: 'composites', label: 'Matériaux Composites' },
                  { id: 'simulation', label: 'Calculs & Structures' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-indigo-650 text-white shadow shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Staggered Portfolio Items layout */}
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProjects.map((project, idx) => {
                  const catStyles = {
                    biomechanics: 'text-rose-450 border-rose-500/10 bg-rose-500/5',
                    mechanics: 'text-blue-450 border-blue-500/10 bg-blue-500/5',
                    composites: 'text-amber-450 border-amber-500/10 bg-amber-500/5',
                    simulation: 'text-emerald-450 border-emerald-500/10 bg-emerald-500/5'
                  }[project.category];

                  return (
                    <motion.article
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, ease: "easeOut", delay: (idx % 3) * 0.08 }}
                      onClick={() => setSelectedProject(project)}
                      className={`group relative rounded-xl border p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-indigo-500/50 ${
                        darkMode
                          ? 'bg-neutral-900/40 border-neutral-900 hover:bg-neutral-900/80 shadow-black/40'
                          : 'bg-white border-slate-200 hover:bg-slate-50/50 shadow-slate-100'
                      }`}
                    >
                      <div className="space-y-3.5 text-left">
                        <div className="flex justify-between items-start">
                          <span className={`px-2.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest uppercase border ${catStyles}`}>
                            {
                              {
                                biomechanics: 'Biomécanique & Sport',
                                mechanics: 'Conception & CAO',
                                composites: 'Matériaux Composites',
                                simulation: 'Calcul & Structures'
                              }[project.category]
                            }
                          </span>
                          {project.metrics && (
                            <div className="text-right">
                              <span className="text-indigo-400 font-extrabold font-mono text-[11px] block">{project.metrics.value}</span>
                              <span className="text-[7px] text-slate-500 font-mono block uppercase">{project.metrics.label}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-extrabold text-sm group-hover:text-indigo-400 transition-colors line-clamp-2 uppercase tracking-wide">
                          {project.title}
                        </h3>

                        <p className={`text-xs line-clamp-3 leading-relaxed ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {project.shortDesc}
                        </p>
                      </div>

                      <div className="pt-4 space-y-3 text-left">
                        {/* Sub-tools tags */}
                        <div className="flex flex-wrap gap-1">
                          {project.tools.slice(0, 3).map((tool) => (
                            <span key={tool} className={`text-[9px] font-mono px-2 py-0.5 rounded border ${
                              darkMode ? 'bg-[#0A0A0A] text-slate-400 border-neutral-850' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {tool}
                            </span>
                          ))}
                          {project.tools.length > 3 && (
                            <span className="text-[9px] font-mono text-indigo-400 font-bold px-1 py-0.5">+{project.tools.length - 3}</span>
                          )}
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 group-hover:text-indigo-350 transition-colors">
                          <span>Consulter les détails</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </section>

        {/* DETAILED DIRECT ACCESS SIMULATION DRAWER PANEL */}
        <AnimatePresence>
          {selectedProject && (
            <div id="project-modal" className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-black/85 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                id="modal-container"
                className={`relative rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 p-5 sm:p-7 border flex flex-col justify-between ${
                  darkMode ? 'bg-[#0A0A0A] border-neutral-805 text-slate-100 shadow-2xl shadow-indigo-650/5' : 'bg-white border-slate-300 text-slate-905'
                }`}
              >
                {/* Close modal */}
                <button
                  id="modal-close"
                  onClick={() => setSelectedProject(null)}
                  className={`absolute top-4 right-4 p-1.5 rounded-full border transition-all hover:scale-105 ${
                    darkMode ? 'border-neutral-805 hover:bg-neutral-900 text-slate-400 hover:text-white' : 'border-slate-250 hover:bg-slate-100 text-slate-605'
                  }`}
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-6 text-left">
                  <div className="space-y-1.5 max-w-[85%]">
                    <span className="text-[10px] font-mono text-indigo-450 font-bold uppercase tracking-widest block">
                      Recherche & Développement applicative
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight">{selectedProject.title}</h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                    {/* Left Column: Context & Detail */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider block font-extrabold">Contexte de Recherche & Concept</span>
                        <p className={`text-xs sm:text-sm leading-relaxed ${
                          darkMode ? 'text-slate-305' : 'text-slate-650'
                        }`}>
                          {selectedProject.longDesc}
                        </p>
                      </div>
                    </div>

                    {/* Right Column: Outcomes, Metrics & Technologies */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Highlighted Metric if present */}
                      {selectedProject.metrics && (
                        <div className="p-4 rounded-xl border bg-indigo-550/5 border-indigo-500/20 text-left">
                          <span className="text-[10px] uppercase font-mono text-indigo-400 block mb-1 font-extrabold">Rendement / Métrique clé</span>
                          <span className="text-2xl font-black font-mono tracking-tight text-white block">
                            {selectedProject.metrics.value}
                          </span>
                          <span className="text-xs text-slate-450 block mt-0.5">
                            {selectedProject.metrics.label}
                          </span>
                        </div>
                      )}

                      {/* Key deliverables */}
                      <div className="space-y-3 bg-neutral-900/40 p-4 rounded-xl border border-neutral-900">
                        <span className="text-[9px] uppercase font-mono text-indigo-400 font-extrabold tracking-widest block">Livrables scientifiques</span>
                        <ul className="space-y-2">
                          {selectedProject.keyTakeaways.map((takeaway, tIdx) => (
                            <li key={tIdx} className="text-xs flex items-start gap-2 text-slate-300 leading-relaxed">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tools applied */}
                      <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-3 text-[11px] font-mono">
                        <div>
                          <span className="text-slate-505 uppercase block text-[9px] font-bold">Discipline</span>
                          <span className="font-semibold text-slate-300 capitalize">
                            {
                              {
                                biomechanics: 'Biomécanique & Sport',
                                mechanics: 'Conception & CAO',
                                composites: 'Matériaux Composites',
                                simulation: 'Calcul & Structures'
                              }[selectedProject.category] || selectedProject.category
                            }
                          </span>
                        </div>
                        <div className="border-t border-neutral-900 pt-2.5">
                          <span className="text-slate-505 uppercase block text-[9px] mb-1.5 font-bold">Softwares & Méthodes appliqués</span>
                          <div className="flex gap-1 flex-wrap">
                            {selectedProject.tools.map((t) => (
                              <span key={t} className="bg-indigo-500/10 text-indigo-455 px-2.5 py-1 rounded border border-indigo-500/20 text-[9px] uppercase tracking-wider font-bold">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* HIGH LEGIBILITY CURRICULUM CV SEGMENT */}
        <section id="parcours" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div id="parcours-header" className="space-y-2 mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-2">
                <Briefcase className="h-6 w-6 text-indigo-500" />
                Parcours Académique & Expériences
              </h2>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Naviguez entre mes stages recherche en laboratoires, mes diplômes d'ingénieur et mon bagage technique polyvalent.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {/* CV Segment Tabs (No Emojis) */}
              <div className={`flex p-1 rounded-xl justify-center max-w-lg mx-auto border transition-all duration-300 ${
                darkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-slate-100/80 border-slate-200'
              }`}>
                {[
                  { id: 'experience', label: 'Expériences & Stages', icon: Briefcase },
                  { id: 'education', label: 'Diplômes & Facultés', icon: GraduationCap },
                  { id: 'skills', label: 'Compétences Techniques', icon: Sliders }
                ].map((tab) => {
                  const isActive = resumeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setResumeTab(tab.id as any)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold font-mono tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative active:scale-95 hover:scale-[1.02] ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-black'
                          : darkMode 
                            ? 'text-slate-400 hover:text-white hover:bg-neutral-900/60 border border-transparent'
                            : 'text-slate-600 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-tab-glow"
                          className="absolute inset-0 rounded-lg bg-indigo-600/5 ring-1 ring-indigo-500/30 -z-10 pointer-events-none"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <tab.icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'}`} />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.id === 'experience' ? 'Stages' : tab.id === 'education' ? 'Études' : 'Comp.'}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB CONTENT WITH ENHANCED ANIMATION, COLOR SEPARATION AND HIGHER SPACING */}
              <AnimatePresence mode="wait">
                {resumeTab === 'experience' && (
                  <motion.div
                    key="experience-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6 text-left"
                  >
                    {experiences.map((exp, idx) => (
                      <motion.div 
                        key={exp.id} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: idx * 0.08 }}
                        className={`relative rounded-xl border p-6 transition-all overflow-hidden group hover:shadow-md ${
                          darkMode 
                            ? 'border-neutral-900 bg-neutral-900/30 border-neutral-850/60' 
                            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                        }`}
                      >
                        {/* Interactive lateral accent line for separation */}
                        <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-indigo-500 rounded-l" />
                        
                        {/* Glow inside back */}
                        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                        {/* Header layout */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                          <div className="space-y-1 pl-1.5">
                            <h3 className="font-extrabold text-base tracking-wide text-white flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                              {exp.title}
                            </h3>
                            <div className={`text-xs font-mono font-bold ${
                              exp.id === 'stage-cnrs' ? 'text-indigo-400' : exp.id === 'stage-excent' ? 'text-purple-400' : 'text-amber-500'
                            }`}>
                              {exp.company}
                            </div>
                          </div>

                          {/* Location / Period badges */}
                          <div className="flex flex-wrap gap-1.5 text-[10px] font-mono sm:text-right self-start sm:self-auto pl-1.5 sm:pl-0 animate-fade-in">
                            <span className={`px-2.5 py-1 border rounded flex items-center gap-1 shrink-0 transition-all ${
                              darkMode ? 'bg-neutral-950 border-neutral-850 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-605'
                            }`}>
                              <Activity className="h-3 w-3 text-indigo-550" />
                              {exp.period}
                            </span>
                            <span className={`px-2.5 py-1 border rounded flex items-center gap-1 shrink-0 transition-all ${
                              darkMode ? 'bg-neutral-950 border-neutral-850 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-605'
                            }`}>
                              <MapPin className="h-3 w-3 text-indigo-550" />
                              {exp.location}
                            </span>
                          </div>
                        </div>

                        {/* Specialty pill tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4 pl-1.5">
                          {exp.id === 'stage-cnrs' && (
                            <>
                              <span className="text-[9px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">Recherche CNRS</span>
                              <span className="text-[9px] font-mono uppercase bg-rose-500/10 text-rose-450 border border-rose-500/20 px-2 py-0.5 rounded">Validation Clinique</span>
                              <span className="text-[9px] font-mono uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">Mécatronique</span>
                            </>
                          )}
                          {exp.id === 'stage-excent' && (
                            <>
                              <span className="text-[9px] font-mono uppercase bg-purple-500/10 text-purple-450 border border-purple-500/20 px-2 py-0.5 rounded">Airbus & Aéronautique</span>
                              <span className="text-[9px] font-mono uppercase bg-blue-500/10 text-blue-450 border border-blue-500/20 px-2 py-0.5 rounded">CAO Catia V5</span>
                              <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-450 border border-amber-500/20 px-2 py-0.5 rounded">Bâtis Soudés RDM</span>
                            </>
                          )}
                          {exp.id === 'jobs-estivaux' && (
                            <>
                              <span className="text-[9px] font-mono uppercase bg-orange-500/10 text-orange-450 border border-orange-500/20 px-2 py-0.5 rounded">Adaptabilité active</span>
                              <span className="text-[9px] font-mono uppercase bg-neutral-500/10 text-slate-350 border border-slate-505/20 px-2 py-0.5 rounded">Rôles industriels 3x8</span>
                              <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-2 py-0.5 rounded">Traçabilité & Qualité</span>
                            </>
                          )}
                        </div>

                        {/* Bullet Highlights - HIGH LEGIBILITY WORKDOWN WITH ACCENT WORDS IN HIGH LIGHTS */}
                        <div className="space-y-3.5 border-l border-neutral-850 pl-4 ml-2 pb-1">
                          {exp.highlights.map((bullet, bIdx) => {
                            const words = bullet.split(' ');
                            const boldHeader = words.slice(0, 3).join(' ');
                            const remaining = words.slice(3).join(' ');

                            return (
                              <div key={bIdx} className="relative group/bullet text-xs leading-relaxed">
                                {/* Colored dot aligned to lines */}
                                <div className={`absolute -left-[20.5px] top-1.5 h-2 w-2 rounded-full border ${
                                  darkMode ? 'border-neutral-950 bg-indigo-500' : 'border-slate-100 bg-indigo-650'
                                }`} />
                                <p>
                                  <strong className={`font-extrabold tracking-wide block sm:inline mr-1 ${
                                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                                  }`}>
                                    {boldHeader}
                                  </strong>
                                  <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{remaining}</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {resumeTab === 'education' && (
                  <motion.div
                    key="education-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5 text-left"
                  >
                    {educations.map((edu, idx) => (
                      <motion.div 
                        key={edu.id} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: idx * 0.08 }}
                        className={`relative rounded-xl border p-5 flex flex-col sm:flex-row gap-5 items-start justify-between overflow-hidden group hover:shadow-md ${
                          darkMode 
                            ? 'border-neutral-900 bg-neutral-900/30 border-neutral-850/60' 
                            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                        }`}
                      >
                        <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-purple-500 rounded-l" />

                        {/* Left: Custom SVG School brand logo equivalent badge */}
                        <div className="shrink-0">
                          {edu.id === 'master-iemh' ? (
                            /* Aix Marseille Sport Sciences Emblem */
                            <div className="h-14 w-14 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center p-1.5">
                              <span className="text-[9px] font-mono font-black text-emerald-400">amU</span>
                              <div className="w-5 h-0.5 bg-emerald-400 my-0.5" />
                              <span className="text-[6px] font-mono text-slate-400 uppercase text-center font-bold">Sport Sc.</span>
                            </div>
                          ) : (
                            /* GMA - Toulouse Jacqueline Auriol Emblem with aircraft vector */
                            <div className="h-14 w-14 rounded-lg bg-orange-500/10 border border-orange-550/20 flex flex-col items-center justify-center p-1 relative overflow-hidden">
                              <span className="text-[9px] font-mono font-black text-orange-400">MFJA</span>
                              {/* Minimal wings outline vector */}
                              <svg className="w-6 h-4 text-orange-400/50" viewBox="0 0 20 10">
                                <path d="M 2,5 L 18,5 M 10,2 L 18,5 L 10,8 Z" stroke="currentColor" strokeWidth="0.8" fill="none" />
                              </svg>
                              <span className="text-[6px] font-mono text-slate-400 uppercase text-center font-bold">GMA Tolosa</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-white">{edu.degree}</h3>
                            <div className="text-xs font-mono font-bold text-indigo-400 mt-0.5">{edu.school}</div>
                          </div>

                          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {edu.description}
                          </p>
                        </div>

                        {/* Period Badge */}
                        <div className={`text-[10px] font-mono self-start sm:self-auto py-1 px-2.5 rounded border shrink-0 ${
                          darkMode ? 'bg-neutral-950 border-neutral-850 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-605'
                        }`}>
                          {edu.period}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {resumeTab === 'skills' && (
                  <motion.div
                    key="skills-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
                  >
                    {skillGroups.map((group, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: idx * 0.08 }}
                        className={`p-5 rounded-xl border space-y-4 ${
                          darkMode ? 'border-neutral-900 bg-neutral-900/30 border-neutral-855/60' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                        }`}
                      >
                        <h3 className="font-extrabold text-xs uppercase tracking-widest text-indigo-400 border-b border-neutral-850 pb-2">
                          {group.category}
                        </h3>

                        <div className="space-y-4">
                          {group.skills.map((skill, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <div className={`flex justify-between items-center text-[11px] font-mono ${
                                darkMode ? 'text-slate-300' : 'text-slate-700 font-semibold'
                              }`}>
                                <span>{skill.name}</span>
                                <span className={`font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{skill.level}%</span>
                              </div>
                              <div className={`w-full h-1.5 rounded-full overflow-hidden border ${
                                darkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-slate-100 border-slate-200'
                              }`}>
                                <motion.div 
                                  className="bg-indigo-600 h-1.5 rounded-full" 
                                  initial={{ width: "0%" }}
                                  whileInView={{ width: `${skill.level}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1.1, ease: "easeOut", delay: sIdx * 0.08 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>

        {/* BIOMECHANICS OUTDOOR LAB PASSIONS SECTION - NO EMOJIS */}
        <section id="interets" className="scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-125px" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xl font-extrabold flex items-center justify-center gap-1.5 uppercase tracking-wide">
                <Award className="h-5 w-5 text-indigo-400" />
                Activités & Synergies Techniques
              </h3>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                L'amour de la montagne, de l'artisanat et des structures physiques alimente continuellement mon ingéniosité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left text-xs">
              <div className={`p-5 rounded-xl border relative overflow-hidden transition-all hover:border-indigo-500/30 ${
                darkMode ? 'bg-neutral-900/20 border-neutral-900' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                  <Mountain className="h-4 w-4 text-indigo-400" />
                  <span className="font-extrabold font-mono text-[10px] tracking-widest uppercase block">
                    Alpinisme & Escalade
                  </span>
                </div>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-605'}`}>
                  Pratique intensive sur les falaises de la Jonte et du Caroux. Une compréhension immédiate de l’importance du frottement, de la tenue des ancrages et du vieillissement mécanique des engins d'assurance.
                </p>
              </div>

              <div className={`p-5 rounded-xl border relative overflow-hidden transition-all hover:border-indigo-505/30 ${
                darkMode ? 'bg-neutral-900/20 border-neutral-900' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                  <Hammer className="h-4 w-4 text-indigo-405" />
                  <span className="font-extrabold font-mono text-[10px] tracking-widest uppercase block">
                    Conception Artisanale
                  </span>
                </div>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-605'}`}>
                  Usinage du bois massif pour des structures de lutherie ou du mobilier sur mesure. Un terrain d’essai idéal pour apprécier concrètement l'anisotropie naturelle des fibres celluloses comparées aux composites aéronautiques carbone/époxy.
                </p>
              </div>

              <div className={`p-5 rounded-xl border relative overflow-hidden transition-all hover:border-indigo-505/30 ${
                darkMode ? 'bg-neutral-900/20 border-neutral-900' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center gap-2 mb-3 text-indigo-400">
                  <Layers className="h-4 w-4 text-indigo-405" />
                  <span className="font-extrabold font-mono text-[10px] tracking-widest uppercase block">
                    Matériaux & Lutherie
                  </span>
                </div>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-605'}`}>
                  Guitare basse et composition vibratoire. Une fusion de l’acoustique des ondes propagées et de la science des polymères, concrétisée par le moulage par infusion sous vide de manches en résine époxy armée carbone.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* TOUCH CHANNELS DIRECT CONNECTOR & CONTACT FORM */}
        <section id="contact" className="scroll-mt-20 border-t border-neutral-900 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-4xl mx-auto text-left">
            {/* Direct details info */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="font-extrabold text-lg text-white">Contact Direct</h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Disponible pour toute discussion technique concernant l’innovation matérielle sportive, l’évaluation de protocole clinique ou le calcul de structures composites.
              </p>

              <div className="space-y-3 pt-2 text-xs font-mono">
                <div className="flex items-center gap-2 group">
                  <Mail className="h-4 w-4 text-indigo-455 shrink-0" />
                  <a href="mailto:guilhem.vth@gmail.com" className="hover:text-indigo-400 underline">{personalInfo.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-indigo-455 shrink-0" />
                  <a href="tel:0652424430" className="hover:text-indigo-400">{personalInfo.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-455 shrink-0" />
                  <span className="text-slate-350">Millau / Mobilité France & Étranger</span>
                </div>
              </div>
            </div>

            {/* Micro email form */}
            <div className="md:col-span-7">
              <form onSubmit={submitContactForm} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-505 uppercase block">Votre nom</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full text-xs rounded border border-neutral-850 bg-[#050505]/60 p-2.5 focus:border-indigo-500 text-slate-100 placeholder-slate-600"
                      placeholder="e.g. Marie Curie"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-505 uppercase block">Courriel de contact</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full text-xs rounded border border-neutral-850 bg-[#050505]/60 p-2.5 focus:border-indigo-500 text-slate-100 placeholder-slate-600"
                      placeholder="e.g. marie.curie@univ.fr"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase block">Message / Proposition de mission</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full text-xs rounded border border-neutral-850 bg-[#050505]/60 p-2.5 focus:border-indigo-500 text-slate-100 placeholder-slate-600"
                    placeholder="Détaillez votre projet ou offre d'emploi..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-bold font-mono text-xs tracking-wider uppercase py-2.5 px-4 rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>Transmettre ma demande</span>
                </button>

                {contactSubmitted && (
                  <div className="bg-emerald-500/10 border border-emerald-505/20 text-emerald-400 text-xs p-3.5 rounded flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>Félicitations ! Votre message a été simulé et est prêt pour la transmission.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-605 mt-16 font-mono font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} GUILHEM VAUTHIER. TOUS DROITS RÉSERVÉS — CONCEPTION ET CODE SUR MESURE.
          </div>
        </section>
      </main>

      {/* FLOATING ACTION SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 h-9 w-9 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 cursor-pointer"
            aria-label="Retour en haut"
            title="Retour en haut"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
