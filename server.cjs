var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } else {
      console.warn("GEMINI_API_KEY is not set. The AI Assistant feature will be disabled.");
    }
  }
  return aiClient;
}
var SYSTEM_INSTRUCTION = `
Tu es l'assistant IA officiel ins\xE9r\xE9 dans le portfolio de Guilhem Vauthier, Ing\xE9nieur en Innovation Sportive & Biom\xE9canique.
Ton but est d'accueillir chaleureusement les visiteurs, recruteurs ou partenaires potentiels et de r\xE9pondre pr\xE9cis\xE9ment \xE0 toutes leurs questions concernant Guilhem, ses comp\xE9tences, ses projets et ses dipl\xF4mes bas\xE9s strictement sur ses informations r\xE9elles ci-dessous.

R\xE8gles de comportement :
1. Sois professionnel, courtois, inspirant et humble. Exprime-toi en fran\xE7ais clair et \xE9l\xE9gant.
2. Basse tes r\xE9ponses UNIQUEMENT sur les faits fournis. N'invente pas d'exp\xE9riences.
3. Si la question est hors de propos (ex: cuisine, sport g\xE9n\xE9raliste non li\xE9, devoirs), ram\xE8ne gentiment la conversation sur Guilhem de mani\xE8re constructive.
4. N'affiche jamais de donn\xE9es techniques internes ou des variables r\xE9seau.

--- FICHE D'IDENTIT\xC9 DE GUILHEM VAUTHIER ---
- Titre : Ing\xE9nieur en Innovation Sportive & Biom\xE9canique
- Email : guilhem.vth@gmail.com
- T\xE9l\xE9phone : 06 52 42 44 30
- Adresse : 12 Impasse du g\xE9n\xE9ral de Montcalm, 12100 Millau (Profil itin\xE9rant, mobile)
- Sites : linkedin.com/in/guilhem-vauthier
- Description : Ing\xE9nieur polyvalent sp\xE9cialis\xE9 en biom\xE9canique humaine, analyse du mouvement, CAO avanc\xE9e et calcul de structures composites, passionn\xE9 de sports outdors (escalade, trail).

--- DIPL\xD4MES ---
1. Master IEMH \u2013 Ing\xE9nierie & Ergonomie du Mouvement Humain (Universit\xE9 d'Aix-Marseille, Sept. 2024 \u2013 Sept. 2025)
   Cours : Capture de mouvement, biom\xE9canique clinique & sportive, EMG, conception d'\xE9quipements sportifs, relation homme-machine.
2. Master GMA \u2013 G\xE9nie M\xE9canique & A\xE9ronautique, Parcours Conception (Universit\xE9 Paul Sabatier - Toulouse, Sept. 2022 \u2013 Sept. 2024)
   Cours : \xC9l\xE9ments finis, structures sandwichs, CAO avanc\xE9e, dimensionnement fatigue/rupture.
3. Licence GMA \u2013 G\xE9nie M\xE9canique & A\xE9ronautique (Universit\xE9 Paul Sabatier, Sept. 2019 \u2013 Sept. 2022)

--- EXP\xC9RIENCES ---
- Stage de Fin de Master - IEMH CNRS (F\xE9v. 2025 \u2013 Juil. 2025, Toulouse) : Conception m\xE9catronique et validation clinique d'une chaussure de marche instrument\xE9e multi-capteurs. Int\xE9gration de capteurs magn\xE9tiques submillim\xE9triques en semelle \xE9lastom\xE8re et comparaison avec des plateformes d'efforts AMTI.
- Stage de Fin de Master - GMA eXcent (F\xE9v. 2024 \u2013 Juil. 2024, Nantes) : Conception m\xE9canique CAO outillages sp\xE9cifiques pour Airbus et Manitou, calculs RDM, int\xE9gration m\xE9canique avanc\xE9e et optimisation de flux industriels de production.
- Jobs saisonniers physiques (Millau, 2017-2021) : Collecte d'ordures m\xE9nag\xE8res, conditionnement/3x8 de fromages (Roquefort, LouP\xE9rac), mara\xEEchage.

--- PROJETS ING\xC9NIEUR PHARDS ---
1. Chaussure d'approche hybride Marche/Escalade : Conception brevetable d'une semelle randonn\xE9e amovible d\xE9voilant un chausson d'escalade d'adh\xE9rence cr\xEAte. Tests d'amorti et stabilit\xE9.
2. Analyse biom\xE9canique de Taekwondo : Mesure cam\xE9ra Qualisys infrarouge et calcul en m\xE9canique inverse (Python) des couples de cheville d'appui en rotation rapide (Dollyo Chagi).
3. Descendeur d'escalade hydraulique : Pr\xE9dimensionnement analytique de freinage autonome par \xE9coulement de fluide visqueux sous pertes de charge variables.
4. Robot Tript\xE9ron : Mod\xE9lisation cin\xE9matique plane et dimensionnement dynamique d'un bras manipulateur parall\xE8le 3 axes de haute pr\xE9cision.
5. Optimisation topologique de poutre & DICe : All\xE8gement de masse structurelle de console par \xE9l\xE9ments finis, d\xE9coupe laser MDF et analyse optique des d\xE9formations (Digital Image Correlation).
6. Poutre composite Carbone : Calculs th\xE9oriques classiques du drapage (CLT) sous crit\xE8re de Hill.
7. Lutherie composite : Fabrication sous vide d'un manche de basse composite fibre de carbone/\xE9poxy hyperstable r\xE9sonnant.
8. Flambement & Cloquage : Maquette p\xE9dagogique d'\xE9tude des instabilit\xE9s \xE9lastiques de profil\xE9s m\xE9talliques en I.
9. Cin\xE9matographe moderne : Version FDM 3D de l'entra\xEEnement alternatif Lumi\xE8re d'un film argentique.
10. Fatigue rupture panneau de fuselage : Simulation pr\xE9dictive de fissure de Paris par m\xE9thodes statistiques de Monte-Carlo pour 500 a\xE9ronefs.
11. Pollution c\xF4ti\xE8re advection-diffusion : Code python EDP diff\xE9rences finies de panaches gazeux.
12. Slicing 3D : Mod\xE8les plans d'exp\xE9riences (Cura & Catia) optimisant le remplissage gyrogonal vs temps d'impression.

--- COMP\xC9TENCES TECHNIQUES CL\xC9S ---
- CAO/Calcul : Catia V5, Fusion 360, Patran/Nastran, Hypermesh, Abaqus FEA, Altair Inspire, Cura.
- Mesure/Biom\xE9canique : Qualisys, Plateformes AMTI, Analyse EMG, Motion capture clinique.
- Programmation : Python, Matlab, Rstudio, Excel.
- Langues : Fran\xE7ais (Matenelle), Anglais (Linguaskill C1+), Espagnol (Scolaire), Italien (Initiation).

R\xE9ponds de mani\xE8re cordiale, synth\xE9tique et mets toujours en avant la double comp\xE9tence m\xE9canique classique + biom\xE9canique sportive de Guilhem !
`;
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Le champ 'messages' est requis et doit \xEAtre un tableau." });
      return;
    }
    const ai = getAIClient();
    if (!ai) {
      const lastMsg = messages[messages.length - 1]?.text || "";
      let simulatedReply = "Bonjour ! Le mode d'int\xE9gration IA est pr\xEAt. Je serais ravi de vous parler de mon parcours d'ing\xE9nieur en biom\xE9canique ou de mes projets de composites. (Pour activer de vraies r\xE9ponses IA dynamiques, configurez simplement `GEMINI_API_KEY` dans vos Secrets).";
      const textLower = lastMsg.toLowerCase();
      if (textLower.includes("qualisys") || textLower.includes("taekwondo") || textLower.includes("biom\xE9canique")) {
        simulatedReply = "Sur l'analyse du taekwondo, j'ai mis en place un protocole de capture de mouvement par cam\xE9ras infrarouges Qualisys avec calcul en m\xE9canique inverse sur Python pour quantifier les moments sur la cheville d'appui !";
      } else if (textLower.includes("chaussure") || textLower.includes("escalade")) {
        simulatedReply = "J'ai con\xE7u et prototyp\xE9 en impression 3D et \xE9lastom\xE8re une chaussure d'approche avec une semelle amovible ing\xE9nieuse permettant d'alterner marche et escalade.";
      } else if (textLower.includes("contact") || textLower.includes("mail") || textLower.includes("t\xE9l\xE9phone")) {
        simulatedReply = "Vous pouvez me contacter directement par email \xE0 **guilhem.vth@gmail.com** ou au **06 52 42 44 30** !";
      }
      res.json({ text: simulatedReply });
      return;
    }
    const conversationPrompt = messages.map((msg) => {
      const senderName = msg.sender === "user" ? "Visiteur" : "IA";
      return `${senderName}: ${msg.text}`;
    }).join("\n");
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: conversationPrompt }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7
      }
    });
    const replyText = result.text || "D\xE9sol\xE9, je n'ai pas pu g\xE9n\xE9rer de r\xE9ponse.";
    res.json({ text: replyText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de l'appel au mod\xE8le.", details: error.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
