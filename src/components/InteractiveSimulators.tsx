import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Gauge, 
  Maximize2, 
  Zap,
  Hammer,
  TrendingUp,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface SimulatorProps {
  type: 'dibona' | 'carbon-beam' | '3d-printer';
}

export const InteractiveSimulator: React.FC<SimulatorProps> = ({ type }) => {
  // --- 1. Dibona State ---
  const [shoeMode, setShoeMode] = useState<'climbing' | 'dibona' | 'approach'>('dibona');
  const [dibonaTest, setDibonaTest] = useState<'adherence' | 'precision' | 'walking'>('adherence');
  
  // Adherence (Smearing) variables
  const [tiltAngle, setTiltAngle] = useState<number>(30);
  const [isTilting, setIsTilting] = useState<boolean>(false);
  const [hasSlipped, setHasSlipped] = useState<boolean>(false);
  const tiltTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Precision variables
  const [edgeSize, setEdgeSize] = useState<number>(1.25); // cm limits (1.0 to 2.0)

  // --- 2. Carbon Beam State ---
  const [plies, setPlies] = useState<number>(6);
  const [angle, setAngle] = useState<number>(45);
  const [load, setLoad] = useState<number>(500); // Newtons

  // --- 3. 3D Printer State ---
  const [infill, setInfill] = useState<number>(30); // %
  const [layerHeight, setLayerHeight] = useState<number>(0.2); // mm
  const [perimeters, setPerimeters] = useState<number>(3);

  // Clean-up timers on unmount
  useEffect(() => {
    return () => {
      if (tiltTimerRef.current) clearInterval(tiltTimerRef.current);
    };
  }, []);

  // --- DIBONA EXPERIMENTAL CONSTANTS & MEDIANS FROM THE PDF ---
  const SHOE_DATA = {
    climbing: {
      name: 'La Sportiva Mythos (Chausson)',
      slipAngle: 40.2, // Median from PDF 
      precisionSuccess: 90.0, // Success rate % on micro-holds
      medialLateralRatio: 0.79, // High inversion risk
      emgSoleus: 0.23, // Muscle ratio RMS_task / RMS_mvc
      emgTibialis: 0.10,
      emgVastus: 0.20,
      emgBiceps: 0.14,
      discomfortOverall: 49.0, // VAS discomfort % overall on Precision
      discomfortAdherence: 32.0, // VAS %
      discomfortWalking: 45.0
    },
    dibona: {
      name: 'Prototype Hybride "La Dibona"',
      slipAngle: 39.8, // Median 39.8°! 
      precisionSuccess: 73.3, // Lower precision success %
      medialLateralRatio: 0.59, 
      emgSoleus: 0.25,
      emgTibialis: 0.09,
      emgVastus: 0.23,
      emgBiceps: 0.15,
      discomfortOverall: 31.0, // More comfortable overall! (VAS 31% overall)
      discomfortAdherence: 13.0,
      discomfortWalking: 7.0 // Extremely comfortable walking
    },
    approach: {
      name: 'Boreal Drom Mid (Approche)',
      slipAngle: 36.0, // Lower adhesion 36°
      precisionSuccess: 100.0, // Maximum precision 100% due to sole stiffness
      medialLateralRatio: 0.52, // Secure and flat support
      emgSoleus: 0.19,
      emgTibialis: 0.10,
      emgVastus: 0.28,
      emgBiceps: 0.19,
      discomfortOverall: 22.0,
      discomfortAdherence: 10.0,
      discomfortWalking: 8.0
    }
  };

  const activeShoe = SHOE_DATA[shoeMode];

  // --- 1. DIBONA SMERAR / TILT ANIMATION ---
  const handleStartTiltTest = () => {
    if (isTilting) {
      if (tiltTimerRef.current) clearInterval(tiltTimerRef.current);
      setIsTilting(false);
    } else {
      setIsTilting(true);
      setHasSlipped(false);
      setTiltAngle(30);
      
      tiltTimerRef.current = setInterval(() => {
        setTiltAngle((prev) => {
          const nextAngle = prev + 0.2;
          const limit = activeShoe.slipAngle;
          
          if (nextAngle >= limit) {
            clearInterval(tiltTimerRef.current!);
            setIsTilting(false);
            setHasSlipped(true);
            return Math.round(limit * 10) / 10;
          }
          return Math.round(nextAngle * 10) / 10;
        });
      }, 30);
    }
  };

  const handleResetTiltTest = () => {
    if (tiltTimerRef.current) clearInterval(tiltTimerRef.current);
    setIsTilting(false);
    setHasSlipped(false);
    setTiltAngle(30);
  };

  // --- 2. CARBON BEAM COMPUTATIONS (RDM Classical Laminate Flexure) ---
  const getCarbonBeamResults = () => {
    const youngModulus = 135000; // MPa 
    const angleRad = (angle * Math.PI) / 180;
    
    // Effective modulus scales dynamically with fiber rotation angle
    const effE = youngModulus * (Math.pow(Math.cos(angleRad), 4) + 0.12 * Math.pow(Math.sin(angleRad), 4));
    
    const width = 45; // mm (Beam width)
    const thickness = plies * 0.25; // mm thickness per layer
    const inertia = (width * Math.pow(thickness, 3)) / 12; // Modulus of inertia Ixx
    const length = 280; // mm console length

    // Deflection equation f = (F * L^3) / (3 * E * I)
    const deflection = (load * Math.pow(length, 3)) / (3 * effE * inertia);

    // Bending Stress sigma = My / I
    const maxStress = (load * length * (thickness / 2)) / inertia;

    // Tsai-Hill Composite Failure index : scale variables
    const strengthX = 1450; // Longitudinal fracture MPa
    const strengthY = 95;  // Transverse fracture MPa
    const localStressX = maxStress * Math.pow(Math.cos(angleRad), 2);
    const localStressY = maxStress * Math.pow(Math.sin(angleRad), 2);
    const hillIndex = Math.pow(localStressX / strengthX, 2) + Math.pow(localStressY / strengthY, 2);

    let safetyStatus: 'Sécurisé' | 'Critique (Fatigue)' | 'Rupture !' = 'Sécurisé';
    if (hillIndex > 1.0) {
      safetyStatus = 'Rupture !';
    } else if (hillIndex > 0.7) {
      safetyStatus = 'Critique (Fatigue)';
    }

    return {
      deflection: Math.min(45, deflection).toFixed(2),
      maxStress: maxStress.toFixed(0),
      hillIndex: hillIndex.toFixed(3),
      safetyStatus,
      thickness: thickness.toFixed(2),
      stiffness: (effE / 1000).toFixed(1)
    };
  };

  const cBeam = getCarbonBeamResults();

  // --- 3. 3D PRINT SLICER OPTIMIZATION MATH ---
  const get3DPrinterMetrics = () => {
    const baseVolume = 40.0; // Solid cubic cm of the hook
    const densityPLA = 1.24; // g/cm³
    const infillVolume = baseVolume * (infill / 100);
    const perimeterVolume = perimeters * 0.45 * 0.45 * 110 * 0.01; // cm³
    const finalMass = (infillVolume + perimeterVolume) * densityPLA;

    // Printing time depends inversely on layerHeight
    const speedMultiplier = 120; // mm/s
    const printTimeSec = (380 * (infill + perimeters * 12)) / (layerHeight * speedMultiplier);
    const printTimeHr = Math.floor(printTimeSec / 60);
    const printTimeMin = Math.round(printTimeSec % 60);

    // Part strength increases with perimeters and infill, degrades slightly with thick layers
    const compositeStrength = (infill * 0.6) + (perimeters * 15.0) - (layerHeight * 18);
    const maxLoadN = 120 + compositeStrength * 4.2;

    return {
      mass: `${finalMass.toFixed(1)}g`,
      time: `${printTimeHr}h ${printTimeMin}m`,
      maxLoadN: `${Math.round(maxLoadN)} N`,
      cost: `${(finalMass * 0.042).toFixed(2)} €`
    };
  };

  const p3D = get3DPrinterMetrics();

  // --- RENDERING ROUTINES ---

  switch (type) {
    case 'dibona':
      return (
        <div className="bg-neutral-950 rounded-xl p-5 border border-neutral-900 shadow-xl space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-900 pb-3 gap-2">
            <div>
              <h4 className="font-extrabold text-indigo-400 text-sm flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-indigo-400" />
                Dossier Scientifique : Laboratoire de Test "La Dibona"
              </h4>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                Comparatif clinique & biomécanique in-situ (MSc IEMH)
              </p>
            </div>
            
            {/* Choose shoe test model */}
            <div className="flex gap-1 bg-neutral-900 p-0.5 rounded border border-neutral-805 self-start sm:self-center">
              {(['climbing', 'dibona', 'approach'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    handleResetTiltTest();
                    setShoeMode(mode);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold font-mono rounded transition-all shrink-0 ${
                    shoeMode === mode 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'climbing' ? 'Chausson' : mode === 'dibona' ? 'Dibona (Proto)' : 'Approche'}
                </button>
              ))}
            </div>
          </div>

          {/* Test Category Tabs */}
          <div className="flex border-b border-neutral-900 pb-2 mb-2 justify-start overflow-x-auto gap-2">
            {[
              { id: 'adherence', label: 'Adhérence (Smearing)', icon: Gauge },
              { id: 'precision', label: 'Précision (Edging)', icon: Sliders },
              { id: 'walking', label: 'Stabilité & Forces (Walk)', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  handleResetTiltTest();
                  setDibonaTest(tab.id as any);
                }}
                className={`py-1 px-3 text-xs font-semibold font-mono border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  dibonaTest === tab.id
                    ? 'border-indigo-505 text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Visual simulation screen on left */}
            <div className="md:col-span-7 bg-[#050505] rounded-xl border border-neutral-900 aspect-[4/3] relative flex items-center justify-center overflow-hidden">
              
              {/* 1. ADHERENCE TILT TEST VISUALIZER */}
              {dibonaTest === 'adherence' && (
                <div className="w-full h-full p-4 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Analyseur de glissement sur plan d'adhérence</span>
                  
                  {/* Tilting Graphic */}
                  <div className="flex-1 relative flex items-center justify-center">
                    {/* Visual Protractor Background */}
                    <svg className="absolute w-44 h-44 opacity-20 text-indigo-500 pointer-events-none" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
                      <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                      <text x="50" y="48" fill="currentColor" fontSize="6" textAnchor="middle" fontFamily="monospace">RAPPORT ANGLE</text>
                    </svg>

                    {/* Tilting Wood Hold Board */}
                    <div 
                      className="absolute w-56 h-3 bg-neutral-800 rounded transition-transform duration-100 flex items-center justify-center"
                      style={{ transform: `rotate(-${tiltAngle}deg)` }}
                    >
                      {/* Wooden top plate */}
                      <div className="w-full h-1 bg-amber-800/80 rounded" />
                      
                      {/* Climbing shoe representation resting on board */}
                      <div 
                        className={`absolute bottom-3 w-16 h-8 border border-neutral-700 rounded-tr-3xl transition-all duration-300 ${
                          hasSlipped ? 'translate-x-32 opacity-0' : 'translate-x-0'
                        }`}
                        style={{
                          backgroundColor: shoeMode === 'climbing' ? '#1e1b4b' : shoeMode === 'dibona' ? '#0f172a' : '#27272a'
                        }}
                      >
                        {/* Red strap */}
                        <div className="absolute top-1 left-2 w-8 h-1 bg-indigo-500 rounded" />
                        {/* Sole rubber line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-950 rounded-b" />
                        <span className="absolute bottom-2 left-2 text-[6px] text-white font-mono uppercase tracking-widest">{shoeMode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tilting indicators */}
                  <div className="flex justify-between items-center bg-neutral-900/40 p-2.5 rounded border border-neutral-900">
                    <div className="text-left font-mono">
                      <span className="text-[8px] text-slate-500 block">ANGLE ACTUEL</span>
                      <span className={`text-sm font-bold ${hasSlipped ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>{tiltAngle}°</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-[8px] text-slate-500 block">SEUIL DE GLISSE</span>
                      <span className="text-xs font-bold text-indigo-400">{activeShoe.slipAngle}°</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PRECISION EDGING VISUALIZER */}
              {dibonaTest === 'precision' && (
                <div className="w-full h-full p-4 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Essai d'Edging sur Micro-Grattons</span>
                  
                  <div className="flex-1 relative flex flex-col items-center justify-center">
                    {/* Micro hold diagram */}
                    <div className="flex items-end gap-10">
                      {/* Shoe standing on hold */}
                      <div className="space-y-3 flex flex-col items-center">
                        <svg className="w-32 h-24 overflow-visible" viewBox="0 0 100 80">
                          {/* Foot outlines */}
                          <path d="M 10,70 L 60,65 Q 85,60 85,73 L 10,75 Z" fill="#1e293b" stroke="#475569" />
                          {/* Sole point standing on the hold exactly */}
                          <rect x="73" y="73" width={edgeSize * 10} height="2" fill="#ef4444" />
                          {/* Stress indicator line */}
                          <path d="M 75,65 Q 70,50 60,52" stroke="#6366f1" strokeWidth="1" fill="none" strokeDasharray="1" />
                        </svg>
                        
                        <div className="bg-neutral-900 px-2 py-1 rounded border border-neutral-805 text-center">
                          <span className="text-[8px] text-slate-500 font-mono block">STATUT DU PIED</span>
                          <span className={`text-[10px] font-bold font-mono ${activeShoe.precisionSuccess > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {activeShoe.precisionSuccess === 100 
                              ? 'Stabilité absolue 100%' 
                              : `Équilibre fragile : ${activeShoe.precisionSuccess}%`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Interactive Micro Hold selector */}
                      <div className="bg-neutral-900/85 p-3 rounded-lg border border-neutral-800 space-y-2.5 font-mono text-left max-w-[150px]">
                        <span className="text-[8px] text-slate-400 uppercase tracking-widest block">Taille du Gratton :</span>
                        <div className="space-y-1">
                          {[1.0, 1.25, 1.5, 2.0].map((size) => (
                            <button
                              key={size}
                              onClick={() => setEdgeSize(size)}
                              className={`w-full text-left text-[10px] py-1 px-1.5 rounded border transition-all ${
                                edgeSize === size 
                                  ? 'bg-indigo-600 border-indigo-500 text-white font-bold' 
                                  : 'bg-neutral-950 border-neutral-905 text-slate-405 hover:text-slate-200'
                              }`}
                            >
                              {size === 1.0 ? '1.0 cm (Micro)' : size === 1.25 ? '1.25 cm' : size === 1.5 ? '1.5 cm' : '2.0 cm (Large)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 p-2 bg-neutral-900/40 rounded border border-neutral-900 text-left">
                    <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span>
                      {shoeMode === 'dibona' 
                        ? 'Le prototype montre un léger fléchissement structurel sur grattons inférieurs à 1.5 cm dû à la souplesse adaptative nécessaire à la marche.'
                        : shoeMode === 'climbing' 
                        ? 'Le chausson fléchit mais offre un retour sensoriel élevé qui permet d\'ajuster la position.'
                        : 'L\'approche rigide tient le gratton sans déformation grâce à sa plaque de cambrure d\'une rigidité extrême.'
                      }
                    </span>
                  </div>
                </div>
              )}

              {/* 3. WALKING STABILITY VISUALIZER */}
              {dibonaTest === 'walking' && (
                <div className="w-full h-full p-4 flex flex-col justify-between text-left">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Analyse Dynamique de Marche (Plateforme de Force Loadsol)</span>
                  
                  <div className="flex-1 grid grid-cols-2 gap-3 items-center">
                    {/* Simulated Inversion risk chart (Medial-Lateral loading ratio) */}
                    <div className="bg-neutral-900/50 p-3 rounded border border-neutral-900 h-full flex flex-col justify-between">
                      <span className="text-[8px] font-mono text-slate-405 uppercase block">Rapport de force Médio-Latéral (Instabilité)</span>
                      
                      <div className="space-y-2 mt-2">
                        {/* Progress bars comparing the shoes */}
                        {[
                          { key: 'climbing', name: 'Chausson', ratio: 0.79, color: 'bg-red-500' },
                          { key: 'dibona', name: 'La Dibona', ratio: 0.59, color: 'bg-indigo-550' },
                          { key: 'approach', name: 'Approche Boreal', ratio: 0.52, color: 'bg-emerald-500' }
                        ].map((item) => (
                          <div key={item.key} className="space-y-0.5">
                            <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className={shoeMode === item.key ? 'text-white font-bold' : 'text-slate-400'}>
                                {item.name} {shoeMode === item.key ? '•' : ''}
                              </span>
                              <span className="font-bold">{item.ratio}</span>
                            </div>
                            <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-850">
                              <div 
                                className={`${item.color} h-2 rounded-full transition-all duration-505`} 
                                style={{ width: `${item.ratio * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <span className="text-[8px] text-slate-500 font-mono italic block leading-snug mt-1.5">
                        *Un ratio plus élevé indique un appui sur la tranche externe du pied, augmentant le risque d'entorse tibio-tarsienne.
                      </span>
                    </div>

                    {/* Kinovea Tibio-calcaneal oscillation graph */}
                    <div className="bg-neutral-900/50 p-3 rounded border border-neutral-900 h-full flex flex-col justify-between">
                      <span className="text-[8px] font-mono text-slate-405 uppercase block">Oscillation Angulaire de Cheville (Stance Phase)</span>
                      
                      {/* Vector graph depicting angle curve */}
                      <div className="h-20 relative border-b border-l border-neutral-800 mt-2 flex items-end">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
                          {/* Ideal baseline */}
                          <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="2 2" />
                          
                          {/* Live shoe curve */}
                          {shoeMode === 'climbing' ? (
                            // Highly unstable curve
                            <path d="M 0,40 Q 25,10 50,45 T 100,20" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                          ) : shoeMode === 'dibona' ? (
                            // Secure slightly damp curve
                            <path d="M 0,40 Q 25,30 50,42 T 100,38" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                          ) : (
                            // Flat ultra-stiff curve
                            <path d="M 0,40 Q 25,35 50,40 T 100,40" fill="none" stroke="#10b981" strokeWidth="1.5" />
                          )}
                        </svg>
                        
                        <span className="absolute bottom-1 right-1 text-[7px] font-mono text-slate-500">CYCLE %</span>
                      </div>

                      <div className="flex justify-between text-[7px] font-mono text-slate-450">
                        <span>Attaque Talon (0%)</span>
                        <span>Propulsion (100%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Angle scale tick overlay */}
              <div className="absolute top-3 right-3 bg-neutral-900/90 px-2 py-1 rounded text-[9px] font-mono border border-neutral-850 z-20">
                STATUT : COHÉRENCE P-VALUE
              </div>
            </div>

            {/* Right side data & analysis panel */}
            <div className="md:col-span-5 flex flex-col justify-between text-left space-y-4">
              <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-900 space-y-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Métriques de l'échantillon</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-950 p-2 rounded border border-neutral-905">
                    <span className="text-[8px] text-slate-500 font-mono block">MEDIANE LIMITE</span>
                    <span className="text-xs font-bold font-mono text-indigo-400">
                      {dibonaTest === 'adherence' 
                        ? `${activeShoe.slipAngle}°` 
                        : dibonaTest === 'precision' 
                        ? '1.5 cm' 
                        : `${activeShoe.medialLateralRatio}`
                      }
                    </span>
                  </div>
                  <div className="bg-neutral-950 p-2 rounded border border-neutral-905">
                    <span className="text-[8px] text-slate-500 font-mono block">DISCONFORT VAS</span>
                    <span className="text-xs font-bold font-mono text-red-400">
                      {dibonaTest === 'adherence' 
                        ? `${activeShoe.discomfortAdherence}%` 
                        : dibonaTest === 'precision' 
                        ? `${activeShoe.discomfortOverall}%` 
                        : `${activeShoe.discomfortWalking}%`
                      }
                    </span>
                  </div>
                </div>

                {/* EMG Muscle recruitment details */}
                <div className="bg-neutral-950 p-2.5 rounded border border-neutral-905 space-y-2">
                  <span className="text-[8px] text-slate-400 font-mono uppercase tracking-widest block">EMG Actifs (Ratio d'effort musculaire) :</span>
                  
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[9px] font-mono">
                    <div className="flex justify-between border-b border-neutral-900 pb-0.5">
                      <span className="text-slate-500">Soleus (Mollet):</span>
                      <span className="text-slate-300 font-bold">{(activeShoe.emgSoleus * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-0.5">
                      <span className="text-slate-500">Tibialis (Tibia):</span>
                      <span className="text-slate-300 font-bold">{(activeShoe.emgTibialis * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vastus (Cuisse):</span>
                      <span className="text-slate-300 font-bold">{(activeShoe.emgVastus * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biceps Femoris:</span>
                      <span className="text-slate-300 font-bold">{(activeShoe.emgBiceps * 105).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Action Zone */}
              <div>
                {dibonaTest === 'adherence' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleStartTiltTest}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      {isTilting ? 'En cours...' : 'Lancer l\'inclinaison'}
                    </button>
                    <button
                      onClick={handleResetTiltTest}
                      aria-label="Réinitialiser"
                      className="bg-neutral-900 hover:bg-neutral-805 text-slate-200 p-2 rounded transition-colors border border-neutral-800"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-450 font-mono leading-relaxed bg-neutral-900/30 p-3 rounded border border-neutral-900">
                    <span className="text-amber-500 font-bold block text-[9px] uppercase mb-1">💡 NOTE D'INGÉNIERIE :</span>
                    Les mesures EMG confirment l'absence d'adaptation musculaire significative entre les chaussures. La différence de performance provient de la rigidité mécanique pure de la semelle.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    case 'carbon-beam':
      return (
        <div id="carbon-beam-simulator" className="bg-neutral-950 rounded-xl p-5 border border-neutral-900 shadow-xl space-y-4">
          <div className="border-b border-neutral-900 pb-3">
            <h4 className="font-extrabold text-indigo-400 text-sm flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-500" />
              Calculateur de Structure Composite (Critère de Tsai-Hill)
            </h4>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Analyse RDM CLT de flexion d'une poutre caisson sandwich carbone/époxy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Form Sliders */}
            <div className="md:col-span-5 space-y-4 text-left">
              <div className="space-y-3 bg-[#050505] p-3.5 rounded-lg border border-neutral-900">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Paramètres mécaniques</span>

                {/* Plies Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-450">
                    <span>Nombre de Plis Carbone:</span>
                    <span className="text-indigo-400 font-bold">{plies} couches</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="2"
                    value={plies}
                    onChange={(e) => setPlies(Number(e.target.value))}
                    className="w-full accent-indigo-550 bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                    <span>2 (Flexible)</span>
                    <span>12 (Rigide)</span>
                  </div>
                </div>

                {/* Angle Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-450">
                    <span>Anisotropie (Angle fibre):</span>
                    <span className="text-indigo-400 font-bold">{angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="15"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full accent-indigo-550 bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                    <span>0° (Optimal Flexion)</span>
                    <span>90° (Cisaillement)</span>
                  </div>
                </div>

                {/* Force Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-450">
                    <span>Effort appliqué (F_y):</span>
                    <span className="text-indigo-400 font-bold">{load} N</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={load}
                    onChange={(e) => setLoad(Number(e.target.value))}
                    className="w-full accent-indigo-550 bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                    <span>100 N</span>
                    <span>2000 N (Rupture)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="md:col-span-7 flex flex-col justify-between text-left space-y-4">
              {/* Dynamic deforming beam graphics */}
              <div className="bg-[#050505] rounded-lg p-3 border border-neutral-900">
                <span className="text-[9px] font-mono text-slate-500 uppercase block mb-2">Similitude Déformation RDM (Élargie ×10)</span>
                
                <div className="h-14 relative flex items-center justify-center">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-neutral-800 rounded border border-neutral-700" />
                  
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                    {/* Unloaded baseline */}
                    <line x1="16" y1="20" x2="190" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="3" strokeDasharray="2 2" />
                    
                    {/* Bending path */}
                    {(() => {
                      const maxPossibleD = 25;
                      const offsetLimitY = 20 + Math.min(maxPossibleD, Number(cBeam.deflection) * 1.6);
                      const isDanger = cBeam.safetyStatus === 'Rupture !';
                      const isWarning = cBeam.safetyStatus === 'Critique (Fatigue)';
                      
                      return (
                        <>
                          <path 
                            d={`M 16,20 Q 95,20 185,${offsetLimitY}`}
                            stroke={isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#3b82f6'}
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                          />
                          {/* Force Arrow */}
                          <line x1="185" y1={offsetLimitY - 14} x2="185" y2={offsetLimitY} stroke="#f59e0b" strokeWidth="1.5" />
                          <polygon points={`185,${offsetLimitY} 182,${offsetLimitY - 4} 188,${offsetLimitY - 4}`} fill="#f59e0b" />
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Data readouts */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 font-mono block">MODULE DE YOUNG (E)</span>
                  <span className="font-bold text-slate-200 font-mono">{cBeam.stiffness} GPa</span>
                </div>
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 font-mono block">FLÈCHE CALCULEE (f)</span>
                  <span className="font-bold text-indigo-400 font-mono">{cBeam.deflection} mm</span>
                </div>
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 font-mono block">CONTRAINTE MAX (σ)</span>
                  <span className="font-bold text-slate-200 font-mono">{cBeam.maxStress} MPa</span>
                </div>
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] text-slate-500 font-mono block">SÉCURITÉ</span>
                    <span className={`font-bold font-mono text-[10px] uppercase ${
                      cBeam.safetyStatus === 'Rupture !' ? 'text-red-400' : cBeam.safetyStatus === 'Critique (Fatigue)' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {cBeam.safetyStatus}
                    </span>
                  </div>
                  {cBeam.safetyStatus === 'Sécurisé' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Tsai-Hill reading footer */}
              <div className="flex justify-between items-center text-[10px] font-mono p-2 rounded bg-[#050505] border border-neutral-900">
                <span className="text-slate-500">Critère limitant de rupture locale (Hill) :</span>
                <span className={`font-bold ${Number(cBeam.hillIndex) >= 1 ? 'text-red-400 font-mono text-xs' : 'text-indigo-400'}`}>
                  {cBeam.hillIndex}
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    case '3d-printer':
      return (
        <div id="printing-simulation-card" className="bg-neutral-950 rounded-xl p-5 border border-neutral-900 shadow-xl space-y-4">
          <div className="border-b border-neutral-900 pb-3">
            <h4 className="font-extrabold text-indigo-400 text-sm flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-emerald-400" />
              Slicer de Prototypage & Conception 3D FDM
            </h4>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
              Simulation d'effets structurels PLA/Composite selon tranchage Cura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Input fields */}
            <div className="md:col-span-5 space-y-4 text-left">
              <div className="space-y-3.5 bg-[#050505] p-3.5 rounded-lg border border-neutral-900">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Options Cura Slicer</span>

                {/* Infill */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-450">
                    <span>Infill Density (Remplissage) :</span>
                    <span className="text-indigo-400 font-bold">{infill}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={infill}
                    onChange={(e) => setInfill(Number(e.target.value))}
                    className="w-full accent-indigo-550 bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                    <span>10% (Léger)</span>
                    <span>100% (Dense)</span>
                  </div>
                </div>

                {/* Layer Height */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-450">
                    <span>Hauteur de couche :</span>
                    <span className="text-indigo-400 font-bold">{layerHeight} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.3"
                    step="0.02"
                    value={layerHeight}
                    onChange={(e) => setLayerHeight(Number(e.target.value))}
                    className="w-full accent-indigo-550 bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                    <span>0.1 mm (Ultra Fin)</span>
                    <span>0.3 mm (Rapide)</span>
                  </div>
                </div>

                {/* Wall Perimeters */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-450">
                    <span>Nombre de périmètres (Murs) :</span>
                    <span className="text-indigo-400 font-bold">{perimeters} passes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={perimeters}
                    onChange={(e) => setPerimeters(Number(e.target.value))}
                    className="w-full accent-indigo-550 bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-600 font-mono">
                    <span>1 mur</span>
                    <span>6 murs (Blindé)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Outputs */}
            <div className="md:col-span-7 flex flex-col justify-between text-left space-y-4">
              {/* Layer simulation graphic */}
              <div className="bg-[#050505] p-3 rounded-lg border border-neutral-900 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Génération d'infusion structurelle</span>
                  <span className="text-[11px] font-bold text-slate-350 block mt-1 font-mono">Maillage interne gyroïde isotrope</span>
                </div>

                {/* Gyroid SVG projection */}
                <svg className="h-14 w-14 bg-neutral-950 border border-neutral-850 rounded" viewBox="0 0 50 50">
                  {/* Outer printed walls representation */}
                  {Array.from({ length: perimeters }).map((_, i) => (
                    <rect 
                      key={i}
                      x={i * 1.5} y={i * 1.5}
                      width={50 - i * 3} height={50 - i * 3}
                      fill="none" stroke="#6366f1" strokeWidth="0.8"
                      strokeOpacity={0.6}
                    />
                  ))}
                  {/* Infill gyroide wave projections */}
                  {Array.from({ length: Math.round(infill / 10) }).map((_, rIdx) => {
                    const step = 50 / (infill / 8 || 1);
                    return Array.from({ length: Math.round(infill / 10) }).map((_, cIdx) => (
                      <path 
                        key={`gy-${rIdx}-${cIdx}`}
                        d={`M ${cIdx*step} ${rIdx*step} Q ${cIdx*step + step/2} ${rIdx*step - step/4}, ${cIdx*step + step} ${rIdx*step}`}
                        stroke="#f59e0b" strokeWidth="0.8" fill="none" strokeOpacity={0.4}
                      />
                    ));
                  })}
                </svg>
              </div>

              {/* Dynamic properties computed */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 block">MASSE DE PIÈCE</span>
                  <span className="font-bold text-slate-200">{p3D.mass}</span>
                </div>
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 block">DURÉE TOTALE (FDM)</span>
                  <span className="font-bold text-indigo-400">{p3D.time}</span>
                </div>
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 block">LIMITATION CHARGE (Break)</span>
                  <span className="font-bold text-amber-500">{p3D.maxLoadN}</span>
                </div>
                <div className="bg-[#050505] p-2.5 rounded border border-neutral-900">
                  <span className="text-[8px] text-slate-500 block">COÛT DU FILAMENT PLA</span>
                  <span className="font-bold text-slate-200">{p3D.cost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
