import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, Database, Brain, Sparkles, ChevronRight, Check } from 'lucide-react';

interface SpecialtyNode {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  accentClass: string;
  description: string;
  subDomains: string[];
  tools: string[];
  associatedProjects: string[];
  coordinates: { x: number; y: number };
}

export const SpecialtyTriangle: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [activeNodeId, setActiveNodeId] = useState<string>('biomech');

  const nodes: SpecialtyNode[] = [
    {
      id: 'biomech',
      title: 'Biomécanique & Mouvement Humain',
      icon: Activity,
      color: '#6366f1', // indigo-500
      accentClass: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20',
      description: 'Analyse quantitative et qualitative de la motricité humaine. Étude clinique et ergonomique des interactions homme-équipement pour optimiser la performance sportive et prévenir les lésions.',
      subDomains: [
        'Analyse Cinématique (Capture de Mouvement Qualisys)',
        'Analyse Dynamique (Plateformes d’efforts AMTI / Forceplates)',
        'Électromyographie (EMG musculaire de surface Delsys)',
        'Pressions Plantaires (Semelles de force instrumentées Loadsol)',
        'Évaluation Clinique & Protocoles de Fatigue/Inconfort'
      ],
      tools: ['Qualisys QTM', 'Loadsol Software', 'RStudio (Stats)', 'KINOVEA', 'Python (SciPy)'],
      associatedProjects: ['Chaussure d\'approche hybride Dibona', 'Analyse du Taekwondo (Dollyo Chagi)'],
      coordinates: { x: 50, y: 15 } // Top of SVGTriangle
    },
    {
      id: 'conception',
      title: 'Conception & Prototypage Physique',
      icon: Cpu,
      color: '#c084fc', // purple-400
      accentClass: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20',
      description: 'Modélisation tridimensionnelle géométrique avancée, conception d\'outillages complexes et mise en pratique de procédés de fabrication avancés (composites sous vide et fabrication additive).',
      subDomains: [
        'Conception Assistée par Ordinateur (CAO volumique & surfacique)',
        'Stratification de Matériaux Composites (Carbone / Époxy)',
        'Infusion, Moulage à joint plat & Drapage sous vide d’air',
        'Fabrication Additive (Tranchage Cura, Impression FDM/SLA)',
        'Prototypage Rapide d’Équipements Sportifs Réels'
      ],
      tools: ['Catia V5', 'Fusion 360', 'Ultimaker Cura', 'Drapage Carbone/Verre', 'Usinage/Laser'],
      associatedProjects: ['Chaussure d\'approche hybride Dibona', 'Lutherie Composite (Manche de guitare basse)', 'Cinématographe moderne'],
      coordinates: { x: 15, y: 75 } // Bottom Left
    },
    {
      id: 'calcul',
      title: 'Calcul de Structures & MEF',
      icon: Database,
      color: '#f59e0b', // amber-500
      accentClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20',
      description: 'Prédimensionnement analytique de structures élastiques (RDM) et modélisation par éléments finis. Optimisation topologique pour la réduction de masse aéronautique et sportive.',
      subDomains: [
        'Analyse Moléculaire par Éléments Finis (FEA / MEF)',
        'Optimisation Topologique sous contraintes de chargement',
        'Résistance des Matériaux (RDM) classique',
        'Tolérance aux Dommages (Loi de Paris, propagation de fissure)',
        'Théories de rupture des composites (Sandwichs, critère de Hill)'
      ],
      tools: ['Patran / Nastran', 'Abaqus FEA', 'Altair Inspire', 'Hypermesh', 'Maxima (Symbolique)'],
      associatedProjects: ['Poutre sandwich composite carbone', 'Poutre cloquet & flambement', 'Panneaux aéronautiques fissurés'],
      coordinates: { x: 85, y: 75 } // Bottom Right
    }
  ];

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const activeNode = nodes.find(n => n.id === activeNodeId) || nodes[0];

  return (
    <div id="specialties-interactive-card" className="flex flex-col gap-4 sm:gap-6 w-full animate-fade-in">
      {/* Dynamic Schematic Interactive Triangle (SVG) */}
      <div className="relative w-full max-w-[260px] xs:max-w-[300px] sm:max-w-[340px] aspect-square rounded-2xl border flex items-center justify-center overflow-hidden p-4 sm:p-5 mx-auto shadow-xl transition-all duration-300 bg-neutral-950/40 border-neutral-900 hover:border-neutral-800">
        
        {/* Absolute Glowing aura circles inside background */}
        <div className="absolute inset-4 border border-dashed rounded-full pointer-events-none opacity-10 border-indigo-500 animate-[spin_60s_linear_infinite]" />
        <div className="absolute inset-16 border border-dashed rounded-full pointer-events-none opacity-15 border-purple-400 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute inset-28 border rounded-full pointer-events-none opacity-5 border-slate-500" />

        {/* Dynamic Glowing background aligned behind the active node */}
        <div 
          className="absolute h-28 w-28 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
          style={{
            backgroundColor: activeNode.color,
            left: `${activeNode.coordinates.x}%`,
            top: `${activeNode.coordinates.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />

        {/* Vector Schematic Frame and interactive points */}
        <svg className="w-full h-full overflow-visible z-10" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="indigo-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <linearGradient id="purple-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="amber-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connected Grid Lines (Glow paths) */}
          <line x1="50" y1="15" x2="15" y2="75" stroke={activeNodeId === 'biomech' || activeNodeId === 'conception' ? 'url(#indigo-purple)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
          <line x1="15" y1="75" x2="85" y2="75" stroke={activeNodeId === 'conception' || activeNodeId === 'calcul' ? 'url(#purple-amber)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />
          <line x1="85" y1="75" x2="50" y2="15" stroke={activeNodeId === 'calcul' || activeNodeId === 'biomech' ? 'url(#amber-indigo)' : 'rgba(255,255,255,0.1)'} strokeWidth="1" />

          {/* Internal projection lines */}
          <line x1="50" y1="15" x2="50" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <line x1="15" y1="75" x2="50" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <line x1="85" y1="75" x2="50" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <circle cx="50" cy="55" r="1.5" fill="rgba(255,255,255,0.2)" />

          {/* Interactive Vertex Nodes */}
          {nodes.map((node) => {
            const isActive = activeNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onClick={() => setActiveNodeId(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Outward Ring Pulsing Glow with safe framer-motion centering */}
                {isActive && (
                  <motion.circle 
                    cx={node.coordinates.x} 
                    cy={node.coordinates.y} 
                    r="6" 
                    fill="none" 
                    stroke={node.color} 
                    strokeWidth="1.2" 
                    initial={{ scale: 1, opacity: 0.9 }}
                    animate={{ scale: 2.8, opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeOut"
                    }}
                    style={{ transformOrigin: `${node.coordinates.x}px ${node.coordinates.y}px` }}
                  />
                )}

                {/* Outer Ring boundary - with exact centered transformOrigins */}
                <motion.circle 
                  cx={node.coordinates.x} 
                  cy={node.coordinates.y} 
                  r="7" 
                  fill="#0a0a0a" 
                  stroke={isActive ? node.color : (isHovered ? '#ffffff' : 'rgba(255,255,255,0.2)')} 
                  strokeWidth={isActive ? '2' : '1'} 
                  animate={{
                    scale: isHovered ? 1.25 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  style={{ transformOrigin: `${node.coordinates.x}px ${node.coordinates.y}px` }}
                />

                {/* Inner color dot - with exact centered transformOrigins */}
                <motion.circle 
                  cx={node.coordinates.x} 
                  cy={node.coordinates.y} 
                  r="3.5" 
                  fill={node.color}
                  animate={{
                    scale: isHovered ? 1.25 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  style={{ transformOrigin: `${node.coordinates.x}px ${node.coordinates.y}px` }}
                />

                {/* Text labels at vertices */}
                <text
                  x={node.coordinates.x}
                  y={node.coordinates.y === 15 ? 7 : 85}
                  fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.5)'}
                  fontSize="4.5"
                  fontFamily="monospace"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="transition-all duration-300 pointer-events-none tracking-widest uppercase"
                >
                  {node.id === 'biomech' ? 'BIOMÉCANIQUE / SANTÉ' : node.id === 'conception' ? 'CONCEPTION / CAO' : 'CALCUL / MEF'}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Small overlay badge stating the purpose */}
        <div className="absolute top-2 left-3 flex items-center gap-1.5 px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded-sm text-[8px] font-mono text-slate-500 uppercase tracking-widest z-20">
          <Sparkles className="h-2 w-2 text-indigo-400 animate-pulse" />
          <span>Triangle des Compétences</span>
        </div>

        {/* Center label */}
        <div className="absolute bottom-2 text-[8px] font-mono text-slate-600 uppercase tracking-wider text-center z-10">
          Cliquez sur les pôles pour explorer
        </div>
      </div>

      {/* Selected Node Details Container with Entrance Motion Animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeNode.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 bg-[#0A0A0A]/40 border-neutral-900"
        >
          {/* Header section with accent color Badge */}
          <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
            <div className="flex items-center gap-2">
              <div 
                className="h-8 w-8 rounded-lg flex items-center justify-center border"
                style={{ 
                  backgroundColor: `${activeNode.color}20`,
                  borderColor: `${activeNode.color}40`,
                  color: activeNode.color
                }}
              >
                <activeNode.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide text-white">{activeNode.title}</h4>
                <span className="text-[9px] font-mono text-slate-500 uppercase">Axe d’expertise majeur</span>
              </div>
            </div>
          </div>

          {/* Description text */}
          <p className="text-xs text-slate-400 leading-relaxed text-left">
            {activeNode.description}
          </p>

          {/* Subdomains / sub-skills lists */}
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Champs de connaissances :</span>
            <div className="space-y-1">
              {activeNode.subDomains.map((sub, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                  <div className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: activeNode.color }} />
                  <span>{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tools Badge cluster */}
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Outils & Softwares :</span>
            <div className="flex flex-wrap gap-1">
              {activeNode.tools.map((t, idx) => (
                <span 
                  key={idx} 
                  className="text-[9px] font-mono px-2 py-0.5 rounded border border-neutral-800 bg-[#0A0A0A] text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Connected research projects */}
          <div className="space-y-1 text-left pt-2 border-t border-neutral-850">
            <span className="text-[9px] font-mono text-slate-500 uppercase block">Projets applicatifs reliés :</span>
            <p className="text-[11px] font-medium text-slate-300 italic">
              {activeNode.associatedProjects.join(' • ')}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
