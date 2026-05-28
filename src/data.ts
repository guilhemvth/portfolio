import { Project, Experience, Education, SkillGroup } from './types';

export const personalInfo = {
  name: 'Guilhem Vauthier',
  title: 'Ingénieur en Innovation Sportive & Biomécanique',
  email: 'guilhem.vth@gmail.com',
  phone: '06 52 42 44 30',
  address: '12 Impasse du général de Montcalm, 12100 Millau',
  linkedin: 'https://linkedin.com/in/guilhem-vauthier',
  description: 'Ingénieur polyvalent spécialisé dans la biomécanique, la conception mécanique (CAO/MEF) et l\'innovation sportive. Passionné de sports outdoor (escalade, trail), d\'ingénierie physique et de prototypage composite.',
  avatarUrl: null // No picture from filesystem, will generate a high-quality SVG layout or CSS visualizer!
};

export const projects: Project[] = [
  {
    id: 'chaussure-escalade',
    title: 'Chaussure d’approche hybride Marche/Escalade',
    shortDesc: 'Conception et prototypage d’une chaussure d’approche à semelle amovible pour concilier marche d’approche et escalade.',
    longDesc: 'Dans le cadre d\'un projet de fin d\'études libre, nous avons imaginé, breveté moralement et prototypé une chaussure d\'approche ultra-polyvalente. Grâce à un ingénieux système de semelle de marche amovible par emboîtement autobloquant, l\'utilisateur peut retirer la structure rigide de randonnée pour dévoiler une semelle fine de chausson d\'escalade hautement adhérente. Nous avons mené une étude biomécanique poussée pour tester l\'amorti (impacts au talon), la rigidité torsionnelle, la précision sur grattons, l\'ajustement ergonomique et le confort thermique en comparant nos prototypes avec des modèles de référence du marché.',
    category: 'biomechanics',
    tags: ['Innovation Sportive', 'Prototypage Physique', 'Biomécanique', 'Ergonomie'],
    tools: ['Impression 3D', 'Analyse d\'efforts', 'Biomécanique', 'Protocols de test'],
    metrics: { value: '+42%', label: 'de compacité en sac d\'expédition' },
    keyTakeaways: [
      'Création d’un double chaussant brevetable alliant stabilité d\'une botte et souplesse d\'un chausson.',
      'Validation de la liaison semelle-chaussant sous couples de flexion sévères.',
      'Tests de glissement et de frottement réalisés sur plan incliné normé.'
    ],
    interactiveType: 'descender'
  },
  {
    id: 'biomecanique-taekwondo',
    title: 'Analyse des Moments de Cheville au Taekwondo',
    shortDesc: 'Mesure par caméras de capture de mouvement (Qualisys) et mécanique inverse des efforts articulaires lors de coups de pied.',
    longDesc: 'Étude biomécanique visant à analyser l\'incidence des blessures ligamentaires à la cheville d\'appui lors de la réalisation de coups de pied circulaires rapides (Dollyo Chagi). Le protocole intègre 8 caméras infrarouges de motion capture Qualisys repérant des marqueurs réfléchissants anatomiques et une plateforme de force AMTI mesurant la réaction au sol. Un modèle cinématique et dynamique en mécanique inverse codé en Python permet de calculer l\'évolution temporelle des moments articulaires (flexion, torsion) de la cheville d\'appui durant la phase d\'armement et de pivot.',
    category: 'biomechanics',
    tags: ['Motion Capture', 'Mécanique Inverse', 'Analyse EMG', 'Santé Sportive'],
    tools: ['Qualisys', 'Plateforme de force', 'Python (SciPy/NumPy)', 'Analyse de mouvement'],
    metrics: { value: '180 Nm', label: 'Moment de torsion crête mesuré' },
    keyTakeaways: [
      'Mise en évidence d\'un couplage critique de torsion-flexion lors de la rotation d\'appui.',
      'Sujet instrumenté avec 21 marqueurs passifs rétro-réfléchissants.',
      'Recommandations ergonomiques formulées pour l\'entraînement post-remise en forme.'
    ],
    interactiveType: 'taekwondo'
  },
  {
    id: 'descendeur-automatique',
    title: 'Descendeur d’Escalade à Freinage Hydraulique',
    shortDesc: 'Prédimensionnement d\'un assureur/descendeur d\'escalade basé sur le laminage hydrodynamique pour vitesse constante.',
    longDesc: 'Étude de concept et dimensionnement analytique d\'un équipement d\'assurage individuel à freinage autonome par fluide visqueux. Plutôt que de reposer sur des cames de friction métalliques sujettes à l\'usure thermique, l\'amortissement repose sur le laminage hydraulique (pertes de charge singulières et régulières) d\'une huile silicone à haut indice de viscosité à travers une section calibrée variable. L\'appareil assure une descente fluide et autorégulée indifférente au poids du grimpeur.',
    category: 'mechanics',
    tags: ['Sécurité Verticale', 'Mécanique des Fluides', 'CAO', 'Dimensionnement'],
    tools: ['Catia V5', 'Excel Solver', 'Rhéologie', 'RDM'],
    metrics: { value: '1.2 m/s', label: 'Vitesse de descente autorégulée' },
    keyTakeaways: [
      'Calcul des coefficients de pertes de charge réparties et modélisation des orifices.',
      'Détermination des gradients de cisaillement du fluide visqueux sous gradient thermique (20°C à 80°C).',
      'Modélisation 3D complète des enveloppes étanches sur Catia V5.'
    ],
    interactiveType: 'descender'
  },
  {
    id: 'robot-tripteron',
    title: 'Conception et Dimensionnement d’un Triptéron',
    shortDesc: 'Modélisation cinématique et dimensionnement d’un manipulateur parallèle à 3 degrés de liberté pour haute précision.',
    longDesc: 'Le triptéron est un robot à structure parallèle offrant trois translations pures sans rotation. Chaque bras manipulateur est composé d\'un système à glissière actionné par courroie/moteur électrique et de deux liaisons pivots orthogonales en cascade. Nous avons écrit les équations de fermeture géométrique pour résoudre la cinématique inverse, dimensionné les flasques mécaniques, arbres et paliers sous couple maximal, et optimisé les ratios de réduction pour minimiser l\'inertie apparente du système.',
    category: 'mechanics',
    tags: ['Robotique Parallèle', 'Théorie des Mécanismes', 'Dimensionnement', 'CAO'],
    tools: ['Catia V5', 'Excel', 'Liaisons cinématiques', 'Calcul de couple'],
    metrics: { value: '0.05 mm', label: 'Précision spatiale calculée' },
    keyTakeaways: [
      'Établissement du modèle géométrique direct et inverse (MGD/MGI) sur Excel analytique.',
      'Sélection et vérification des moteurs pas-à-pas et courroies crantées sous chargement de 50 N.',
      'Conception détaillée des liaisons pivots découplées d\'arbres.'
    ],
    interactiveType: 'tripteron'
  },
  {
    id: 'optimisation-poutre',
    title: 'Optimisation Topologique et Analyse de Déformation DICe',
    shortDesc: 'Allègement de structure de poutre par éléments finis, fabrication laser et mesure de déformations par corrélation d\'images (DICe).',
    longDesc: 'Projet complet visant à alléger une console de support soumise à un cas de charge excentré. Nous avons réalisé l\'optimisation topologique de la poutre en configurant des zones d\'ancrage fixes et le volume d\'enveloppe admissible sur Altair Inspire. La poutre optimisée a été découpée au laser dans du panneau MDF. Avant l\'essai de traction destructive, un mouchetis de contraste a été peint sur la pièce. Un système de suivi de points par corrélation d\'images numériques (DICe) a permis de cartographier finement les champs de déformation réels et de valider notre modèle d\'éléments finis.',
    category: 'simulation',
    tags: ['Optimisation Topologique', 'RDM Expérimentale', 'Laser Cut', 'Éléments Finis'],
    tools: ['Altair Inspire', 'Catia V5', 'DICe (Image Correlation)', 'Machines d\'essais'],
    metrics: { value: '-45%', label: 'de masse pour une rigidité préservée' },
    keyTakeaways: [
      'Maîtrise complète de la chaîne d\'allègement : de la CAO à la rupture physique.',
      'Utilisation d\'appareils photo réflex pour la capture des micro-déplacements.',
      'Recalage du modèle de rigidité analytique sur la courbe force-flèche expérimentale.'
    ],
    interactiveType: 'topological-beam'
  },
  {
    id: 'poutre-carbone-hill',
    title: 'Dimensionnement d’une Poutre Composite Carbone',
    shortDesc: 'Calcul multicritère d’une structure sandwich en carbone/époxy soumise à la flexion selon le critère de Hill.',
    longDesc: 'Calcul théorique et par éléments finis du drapage optimal d’une poutre caisson soumise à des sollicitations de flexion et de torsion combinées. Le travail consistait à optimiser le nombre de plis de fibres de carbone bidirectionnelles et leur orientation (0°/45°/90°). Nous avons appliqué la théorie classique du drapage (CLT) pour extraire la matrice de rigidité couplée, et calculé les coefficients de sécurité locaux selon le critère de Hill aux limites d’élasticité interlaminaire.',
    category: 'composites',
    tags: ['Composites', 'Éléments Finis', 'Théorie du Drapage', 'Rupture Matériaux'],
    tools: ['Patran / Nastran', 'Excel (Calcul matriciel)', 'Critère de rupture de Hill'],
    metrics: { value: '6 Plis', label: 'Drapage symétrique optimisé' },
    keyTakeaways: [
      'Modélisation 2D Shell multicouches sous MSC Nastran.',
      'Calcul des contraintes dans le repère de chaque pli carbone.',
      'Aide à la conception pour gain de poids structurel aéronautique.'
    ],
    interactiveType: 'carbon-beam'
  },
  {
    id: 'manche-basse-composite',
    title: 'Lutherie Composite : Manche de Basse en Reine Carbone',
    shortDesc: 'Conception d’un moule en fibre de verre et stratification sous vide d’un manche de guitare basse composite.',
    longDesc: 'Projet alliant ingénierie des matériaux et lutherie instrumentale. L\'objectif était de concevoir un manche de guitare basse robuste, insensible aux variations d\'humidité ou de température, supprimant le besoin de barre de réglage en acier (truss rod). Nous avons usiné et réalisé un moule en fibre de verre à joint plat, puis procédé au drapage de fibres de carbone et résine époxy sous vide d\'air. Le produit fini combine haute résonance acoustique et stabilité d\'accordage remarquable.',
    category: 'composites',
    tags: ['Lutherie', 'Acoustique Matériaux', 'Drapage composite', 'Infusion sous vide'],
    tools: ['Fibre de Carbone & Époxy', 'Fibre de verre (moule)', 'Découpe laser (inserts)', 'Acoustique'],
    metrics: { value: '-30%', label: 'de flexion sous tension de cordes (45kg)' },
    keyTakeaways: [
      'Élaboration d’un noyau d\'allègement interne en mousse polyuréthane structurelle.',
      'Finition de surface brillante sans pores par application de gelcoat époxy de haute qualité.',
      'Analyse de sustain et de spectre harmonique du manche comparativement à l\'érable.'
    ],
    interactiveType: '3d-printer'
  },
  {
    id: 'flambement-poutre-cloquet',
    title: 'Stabilité aux Cloquages de Poutre & Flambement',
    shortDesc: 'Optimisation d’une poutre sous critères de flambage local et conception d’une maquette pédagogique.',
    longDesc: 'Étude analytique et numérique des instabilités élastiques (flambement global et cloquage local des parois minces) d\'une poutre profilée en I. Afin de vulgariser et démontrer physiquement ces phénomènes complexes en milieu académique, nous avons conçu et fabriqué de toutes pièces une maquette pédagogique articulée. Celle-ci intègre un vérin à vis calibré et des jauges de déformation reliées à un système d\'acquisition pour afficher en temps réel la charge critique d\'Euler.',
    category: 'simulation',
    tags: ['Instabilité Élastique', 'RDM', 'Maquette Didactique', 'Abaqus'],
    tools: ['Abaqus FEA', 'Hypermesh', 'Catia V5', 'Maxima (Formulation symbolique)'],
    metrics: { value: '4.8 kN', label: 'Force critique de cloquage théorique' },
    keyTakeaways: [
      'Résolution d\'équations de flambage local par méthode de Ritz sous Maxima.',
      'Maquette mécanique démontable intégrant une notice d\'assemblage type meuble suédois.',
      'Corrélation d\'essais avec les modèles d\'analyse linéaire de flambement (Buckling Abaqus).'
    ],
    interactiveType: 'fracture'
  },
  {
    id: 'cinematographe',
    title: 'Re-conception Moderne d\'un Cinématographe',
    shortDesc: 'Actualisation mécanique du mécanisme d\'entraînement de film 35mm à griffe à vitesse alternative.',
    longDesc: 'Inspirés par l\'invention originale des frères Lumière, nous avons redéveloppé la cinématique de transformation de mouvement continu en mouvement alternatif saccadé permettant de projeter 24 images par seconde de film argentique. La cinématique (triangle de Reuleaux et cadre à excentrique de came) a été ébauchée analytiquement, puis numérisée en CAO et enfin imprimée en 3D avec assemblage d\'axes rectifiés en acier et manivelle en laiton.',
    category: 'mechanics',
    tags: ['Mécanismes Rétro', 'Cinématique CAO', 'Prototypage 3D', 'Histoire Technique'],
    tools: ['Catia V5', 'Excel cinématique', 'Impression 3D FDM', 'Ajustements mécaniques'],
    metrics: { value: '24 ips', label: 'Cadence de projection synchronisée' },
    keyTakeaways: [
      'Maîtrise de la cinématique plane et des forces d\'inertie sur la griffe d\'entraînement.',
      'Optimisation des jeux mécaniques de fonctionnement glissants pour pièces polymères 3D.',
      'Assemblage physique complet validé sur bande de test perforée.'
    ],
    interactiveType: 'tripteron'
  },
  {
    id: 'fissuration-panneaux',
    title: 'Aéro-Structure : Tolérance aux Dommages et Rupture',
    shortDesc: 'Modélisation de la cinétique de fissure sous fatigue vibratoire et probabilité de défaillance d’une flotte.',
    longDesc: 'Dans un cadre de maintenance aéronautique préventive, nous avons développé un code de calcul de propagation de fissure de fatigue (loi de Paris) affectant des panneaux de fuselage d\'avions de transport civils. En appliquant des spectres de chargement réels représentatifs de cycles de vol (décollage, pressurisation, turbulences, atterrissage), nous avons calculé la taille critique à la rupture fragile et déterminé par simulations de Monte-Carlo la probabilité de ruine d\'une flotte de 500 appareils sur un plan d\'inspection donné.',
    category: 'simulation',
    tags: ['Aéronautique', 'Loi de Paris', 'Rupture Fatigue', 'Fiabilité / Statistique'],
    tools: ['Excel', 'Calcul de Fiabilité', 'Loi de Paris', 'Monte-Carlo'],
    metrics: { value: '< 10^-7', label: 'Probabilité de défaillance par cycle de vol' },
    keyTakeaways: [
      'Calcul des facteurs d\'intensité de contraintes (K_I) pour fissures débouchantes.',
      'Étude d\'impact d\'un doublement de l\'intervalle des visites d\'inspection de maintenance.',
      'Intégration d\'une distribution statistique de tailles initiales de défauts d\'usinage.'
    ],
    interactiveType: 'fracture'
  },
  {
    id: 'pollution-2d',
    title: 'Simulation d’Advection-Diffusion d’un Polluant dans l’Air',
    shortDesc: 'Développement d’un solveur numérique Python de transport de masse de gaz polluant en milieu urbain canalisé.',
    longDesc: 'Modélisation bidimensionnelle spatio-temporelle de l\'écoulement et du transport de concentration de dioxyde d\'azote (NO2) émis par une usine côtière. Le modèle intègre une vitesse de vent uniforme directionnelle (terme d\'advection) et des coefficients de turbulence atmosphérique (termes de diffusion). Nous avons programmé une discrétisation par différences finies (schéma FTCS ou Upwind stable), ce qui permet de prévoir l\'expansion du panache urbain au cours du temps.',
    category: 'simulation',
    tags: ['Simulation Mathématique', 'Solveur EDP', 'Turbulence', 'Environnement'],
    tools: ['Python', 'Matplotlib (Graphiques)', 'NumPy (Matrices)', 'Analyse numérique'],
    metrics: { value: '99.8%', label: 'de conservation de masse d\'advection' },
    keyTakeaways: [
      'Garantie du respect du critère de stabilité de Courant-Friedrichs-Lewy (CFL).',
      'Modélisation de conditions de limites ouvertes de type absorption.',
      'Interface interactive générée affichant l\'impact topographique du vent.'
    ],
    interactiveType: 'pollution'
  },
  {
    id: 'parametres-impression-3d',
    title: 'Optimisation Poids / Vitesse en Impression 3D',
    shortDesc: 'Recherche multicritère pour maximiser la résistance mécanique tout en divisant le temps d’impression d’une poutre creuse.',
    longDesc: 'Afin d\'industrialiser la fabrication additive d\'un support fonctionnel, nous avons mené une étude quantitative d\'optimisation sur slicer Cura et logiciel CAO Catia. Nous avons fait varier de manière paramétrique la hauteur de couche (0.12 à 0.28 mm), le taux de remplissage gyroïde ou rectiligne (15% à 60%), le nombre de parois d\'enveloppe (perimeters) et la vitesse de buse, puis testé la rupture mécanique de chaque éprouvette obtenue. Une surface de réponse optimale a permis d\'identifier la configuration rêvée.',
    category: 'mechanics',
    tags: ['Fabrication Additive', 'Design for AM', 'Cura', 'Plans d\'Expériences'],
    tools: ['Catia V5', 'Ultimaker Cura', 'Caractérisation physique', 'Plans d\'expériences'],
    metrics: { value: '-35% tps', label: 'de fabrication pour rigidité identique' },
    keyTakeaways: [
      'Mise en évidence du rôle prépondérant du nombre de périmètres sur la résistance en flexion.',
      'Utilisation d\'un motif de remplissage de type gyroïde facilitant la résistance isotrope.',
      'Rédaction d\'un guide interne d\'éco-fabrication des pièces de laboratoire.'
    ],
    interactiveType: '3d-printer'
  }
];

export const experiences: Experience[] = [
  {
    id: 'stage-cnrs',
    title: 'Stage de Fin de Master – IEMH',
    company: 'CNRS (Centre National de la Recherche Scientifique) - Toulouse',
    period: 'Fév. 2025 – Juil. 2025',
    location: 'Toulouse (31/34), France',
    highlights: [
      'Conception mécatronique et validation clinique d’une chaussure innovante instrumentée multi-capteurs pour l\'analyse biomécanique in-situ.',
      'Intégration et alignement de capteurs magnétiques submillimétriques dans la semelle élastomère et modélisation expérimentale géométrique.',
      'Comparaison croisée des efforts collectés in-shoe avec les données nominales mesurées sur plateforme de force de laboratoire.'
    ],
    category: 'professional'
  },
  {
    id: 'stage-excent',
    title: 'Stage de Fin de Master – GMA',
    company: 'eXcent - Groupe d\'Ingénierie Industriel',
    period: 'Fév. 2024 – Juil. 2024',
    location: 'Nantes (44), France',
    highlights: [
      'Conception mécanique CAO et intégration de systèmes outilleurs industriels spécifiques pour des clients majeurs tels qu\'Airbus et Manitou.',
      'Calculs de pré-dimensionnement de structures portantes, de bâtis soudés et choix technologiques de composants cinématiques.',
      'Optimisation des flux complexes de production et d\'industrialisation d\'outillages d\'assemblage de fuselages aéronautiques.'
    ],
    category: 'professional'
  },
  {
    id: 'jobs-estivaux',
    title: 'Expériences Multi-secteurs / Jobs Estivaux',
    company: 'Diverses Entreprises',
    period: 'Juin 2017 – Juil. 2021',
    location: 'Millau (12), France',
    highlights: [
      'Collecte et manutention rigoureuse des déchets ménagers urbains, service propreté publique de Millau.',
      'Conditionnement, emballage automatisé et découpe de fromages de terroirs sous contraintes d\'horaires postés 3x8 (Roquefort, LouPérac, Valbreso).',
      'Assurance qualité permanente, traçabilité agroalimentaire et préparation rigoureuse de commandes logistiques.',
      'Entretien sylvicole d\'espaces paysagers, maraîchage manuel intensif et mise en rayon.'
    ],
    category: 'other'
  }
];

export const educations: Education[] = [
  {
    id: 'master-iemh',
    degree: 'Master IEMH – Ingénierie & Ergonomie du Mouvement Humain',
    school: 'Université d\'Aix-Marseille',
    period: 'Sept. 2024 – Sept. 2025',
    description: 'Formation de pointe axée sur la capture de mouvement, la biomécanique clinique et sportive, l\'EMG, la conception d\'équipements sportifs et de santé, l\'interaction homme-machine.'
  },
  {
    id: 'master-gma',
    degree: 'Master GMA – Génie Mécanique & Aéronautique (Spécialité Conception)',
    school: 'Université Paul Sabatier - Toulouse III',
    period: 'Sept. 2022 – Sept. 2024',
    description: 'Approfondissement des méthodes de calcul d\'éléments finis (Abaqus, Patran/Nastran), CAO avancée (Catia V5), structures sandwiches, matériaux composites, tolérance aux dommages.'
  },
  {
    id: 'licence-gma',
    degree: 'Licence GMA – Génie Mécanique & Aéronautique',
    school: 'Université Paul Sabatier - Toulouse III',
    period: 'Sept. 2019 – Sept. 2022',
    description: 'Socle scientifique solide : RDM, dynamique des solides, thermodynamique, matériaux métalliques et polymères, cinématique et automatisme.'
  }
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Biomécanique & Mesure',
    skills: [
      { name: 'Motion Capture (Qualisys)', level: 90, iconName: 'activity' },
      { name: 'Analyse d\'effort (Plateformes)', level: 85, iconName: 'gauge animate-pulse' },
      { name: 'Analyse EMG (Activité musculaire)', level: 78, iconName: 'heart-pulse' },
      { name: 'Mécanique inverse & Cinématique', level: 82, iconName: 'refresh-cw' },
      { name: 'Métrologie & Capteurs', level: 80, iconName: 'binary' }
    ]
  },
  {
    category: 'Calcul & CFD/FEA',
    skills: [
      { name: 'Patran / Nastran (Calcul spatial)', level: 80, iconName: 'grid' },
      { name: 'Abaqus / Hypermesh', level: 85, iconName: 'layers' },
      { name: 'Altair Inspire (Optimisation)', level: 92, iconName: 'sparkles' },
      { name: 'Python & Matlab (Solveurs / EDP)', level: 88, iconName: 'terminal' },
      { name: 'Rstudio & Statistiques', level: 75, iconName: 'bar-chart' }
    ]
  },
  {
    category: 'Conception & Matériaux',
    skills: [
      { name: 'Catia V5 & Fusion 360', level: 92, iconName: 'box' },
      { name: 'Matériaux Composites (Drapage/Moule)', level: 88, iconName: 'feather' },
      { name: 'Fabrication Additive (Cura/Slicing)', level: 90, iconName: 'printer' },
      { name: 'Usinage & Découpe Laser', level: 85, iconName: 'zap' }
    ]
  }
];

export const interests = [
  { id: 'sport', title: 'Sports Outdoors', desc: 'Pratique intensive de l\'escalade, de l\'alpinisme d\'approche, de la course à pied en sentier (trail).', icon: 'hiking' },
  { id: 'bricolage', title: 'Menuiserie / Bricolage', desc: 'Façonnage d\'objets en bois recyclé, conception de petits meubles en contreplaqué d\'ébénisterie, mécanique moto.', icon: 'wood' },
  { id: 'musique', title: 'Musique (Lutherie & Guitare)', desc: 'Guitare électrique et basse de composition, techniques d\'enregistrement, création d\'instruments en carbone.', icon: 'music' }
];
