import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } else {
      console.warn("GEMINI_API_KEY is not set. The AI Assistant feature will be disabled.");
    }
  }
  return aiClient;
}

// System instructions containing Guilhem Vauthier's detailed engineering resume
const SYSTEM_INSTRUCTION = `
Tu es l'assistant IA officiel inséré dans le portfolio de Guilhem Vauthier, Ingénieur en Innovation Sportive & Biomécanique.
Ton but est d'accueillir chaleureusement les visiteurs, recruteurs ou partenaires potentiels et de répondre précisément à toutes leurs questions concernant Guilhem, ses compétences, ses projets et ses diplômes basés strictement sur ses informations réelles ci-dessous.

Règles de comportement :
1. Sois professionnel, courtois, inspirant et humble. Exprime-toi en français clair et élégant.
2. Basse tes réponses UNIQUEMENT sur les faits fournis. N'invente pas d'expériences.
3. Si la question est hors de propos (ex: cuisine, sport généraliste non lié, devoirs), ramène gentiment la conversation sur Guilhem de manière constructive.
4. N'affiche jamais de données techniques internes ou des variables réseau.

--- FICHE D'IDENTITÉ DE GUILHEM VAUTHIER ---
- Titre : Ingénieur en Innovation Sportive & Biomécanique
- Email : guilhem.vth@gmail.com
- Téléphone : 06 52 42 44 30
- Adresse : 12 Impasse du général de Montcalm, 12100 Millau (Profil itinérant, mobile)
- Sites : linkedin.com/in/guilhem-vauthier
- Description : Ingénieur polyvalent spécialisé en biomécanique humaine, analyse du mouvement, CAO avancée et calcul de structures composites, passionné de sports outdors (escalade, trail).

--- DIPLÔMES ---
1. Master IEMH – Ingénierie & Ergonomie du Mouvement Humain (Université d'Aix-Marseille, Sept. 2024 – Sept. 2025)
   Cours : Capture de mouvement, biomécanique clinique & sportive, EMG, conception d'équipements sportifs, relation homme-machine.
2. Master GMA – Génie Mécanique & Aéronautique, Parcours Conception (Université Paul Sabatier - Toulouse, Sept. 2022 – Sept. 2024)
   Cours : Éléments finis, structures sandwichs, CAO avancée, dimensionnement fatigue/rupture.
3. Licence GMA – Génie Mécanique & Aéronautique (Université Paul Sabatier, Sept. 2019 – Sept. 2022)

--- EXPÉRIENCES ---
- Stage de Fin de Master - IEMH CNRS (Fév. 2025 – Juil. 2025, Toulouse) : Conception mécatronique et validation clinique d'une chaussure de marche instrumentée multi-capteurs. Intégration de capteurs magnétiques submillimétriques en semelle élastomère et comparaison avec des plateformes d'efforts AMTI.
- Stage de Fin de Master - GMA eXcent (Fév. 2024 – Juil. 2024, Nantes) : Conception mécanique CAO outillages spécifiques pour Airbus et Manitou, calculs RDM, intégration mécanique avancée et optimisation de flux industriels de production.
- Jobs saisonniers physiques (Millau, 2017-2021) : Collecte d'ordures ménagères, conditionnement/3x8 de fromages (Roquefort, LouPérac), maraîchage.

--- PROJETS INGÉNIEUR PHARDS ---
1. Chaussure d'approche hybride Marche/Escalade : Conception brevetable d'une semelle randonnée amovible dévoilant un chausson d'escalade d'adhérence crête. Tests d'amorti et stabilité.
2. Analyse biomécanique de Taekwondo : Mesure caméra Qualisys infrarouge et calcul en mécanique inverse (Python) des couples de cheville d'appui en rotation rapide (Dollyo Chagi).
3. Descendeur d'escalade hydraulique : Prédimensionnement analytique de freinage autonome par écoulement de fluide visqueux sous pertes de charge variables.
4. Robot Triptéron : Modélisation cinématique plane et dimensionnement dynamique d'un bras manipulateur parallèle 3 axes de haute précision.
5. Optimisation topologique de poutre & DICe : Allègement de masse structurelle de console par éléments finis, découpe laser MDF et analyse optique des déformations (Digital Image Correlation).
6. Poutre composite Carbone : Calculs théoriques classiques du drapage (CLT) sous critère de Hill.
7. Lutherie composite : Fabrication sous vide d'un manche de basse composite fibre de carbone/époxy hyperstable résonnant.
8. Flambement & Cloquage : Maquette pédagogique d'étude des instabilités élastiques de profilés métalliques en I.
9. Cinématographe moderne : Version FDM 3D de l'entraînement alternatif Lumière d'un film argentique.
10. Fatigue rupture panneau de fuselage : Simulation prédictive de fissure de Paris par méthodes statistiques de Monte-Carlo pour 500 aéronefs.
11. Pollution côtière advection-diffusion : Code python EDP différences finies de panaches gazeux.
12. Slicing 3D : Modèles plans d'expériences (Cura & Catia) optimisant le remplissage gyrogonal vs temps d'impression.

--- COMPÉTENCES TECHNIQUES CLÉS ---
- CAO/Calcul : Catia V5, Fusion 360, Patran/Nastran, Hypermesh, Abaqus FEA, Altair Inspire, Cura.
- Mesure/Biomécanique : Qualisys, Plateformes AMTI, Analyse EMG, Motion capture clinique.
- Programmation : Python, Matlab, Rstudio, Excel.
- Langues : Français (Matenelle), Anglais (Linguaskill C1+), Espagnol (Scolaire), Italien (Initiation).

Réponds de manière cordiale, synthétique et mets toujours en avant la double compétence mécanique classique + biomécanique sportive de Guilhem !
`;

// API endpoint for portfolio Q&A chatbot
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Le champ 'messages' est requis et doit être un tableau." });
      return;
    }

    const ai = getAIClient();
    if (!ai) {
      // Return a simulated, friendly offline message if key is missing
      const lastMsg = messages[messages.length - 1]?.text || "";
      let simulatedReply = "Bonjour ! Le mode d'intégration IA est prêt. Je serais ravi de vous parler de mon parcours d'ingénieur en biomécanique ou de mes projets de composites. (Pour activer de vraies réponses IA dynamiques, configurez simplement `GEMINI_API_KEY` dans vos Secrets).";
      
      const textLower = lastMsg.toLowerCase();
      if (textLower.includes('qualisys') || textLower.includes('taekwondo') || textLower.includes('biomécanique')) {
        simulatedReply = "Sur l'analyse du taekwondo, j'ai mis en place un protocole de capture de mouvement par caméras infrarouges Qualisys avec calcul en mécanique inverse sur Python pour quantifier les moments sur la cheville d'appui !";
      } else if (textLower.includes('chaussure') || textLower.includes('escalade')) {
        simulatedReply = "J'ai conçu et prototypé en impression 3D et élastomère une chaussure d'approche avec une semelle amovible ingénieuse permettant d'alterner marche et escalade.";
      } else if (textLower.includes('contact') || textLower.includes('mail') || textLower.includes('téléphone')) {
        simulatedReply = "Vous pouvez me contacter directement par email à **guilhem.vth@gmail.com** ou au **06 52 42 44 30** !";
      }

      res.json({ text: simulatedReply });
      return;
    }

    // Convert message list to a format suitable for Gemini or construct a single context prompt
    // Let's summarize the conversation history for a clean prompt
    const conversationPrompt = messages.map(msg => {
      const senderName = msg.sender === 'user' ? 'Visiteur' : 'IA';
      return `${senderName}: ${msg.text}`;
    }).join('\n');

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        { text: conversationPrompt }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const replyText = result.text || "Désolé, je n'ai pas pu générer de réponse.";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de l'appel au modèle.", details: error.message });
  }
});

// Setup Dev/Prod Assets server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
