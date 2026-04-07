import { NextRequest, NextResponse } from 'next/server';

let zaiInstance: any = null;
let sdkAvailable = true;

async function getZAI() {
  if (!sdkAvailable) return null;
  if (!zaiInstance) {
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      zaiInstance = await ZAI.create();
    } catch (err) {
      console.warn('z-ai-web-dev-sdk not available, using fallback responses:', err);
      sdkAvailable = false;
      return null;
    }
  }
  return zaiInstance;
}

function generateFallbackResponse(userMessage: string, messages: Array<{role: string; content: string}>): string {
  const msg = userMessage.toLowerCase();
  
  // Greeting patterns
  if (/^(bonjour|salut|hello|hi|bonsoir|good morning|good evening|hey)/i.test(msg)) {
    const greetings = [
      "Bonjour ! 👋 Je suis l'assistant virtuel de DRONEK SARL. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos services de foresterie, cartographie par drone, agroforesterie et agriculture.",
      "Bienvenue chez DRONEK ! 🌿 Je suis là pour répondre à vos questions sur nos services. N'hésitez pas à me demander des informations sur la cartographie par drone, la foresterie durable, l'agroforesterie ou nos formations.",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Services inquiry
  if (/service/.test(msg)) {
    return `DRONEK propose 4 domaines de services principaux :\n\n🌲 **Foresterie** : Inventaire forestier, aménagement, reboisement, calcul de biomasse et de stock de carbone, production de plants en pépinière.\n\n🛸 **Drone & Cartographie** : Cartographie par drone, orthomosaïque, carte d'occupation du sol, télédétection et traitement d'image.\n\n🌱 **Agroforesterie** : Formation et sensibilisation, production de plants agroforestiers en pépinière.\n\n🌾 **Agriculture** : Audit agricole, formation des coopératives, bonnes pratiques agricoles, diversification des revenus.\n\nQuel service vous intéresse le plus ?`;
  }
  
  // Drone/mapping
  if (/(drone|cartograph|mapping|carte|ortho)/i.test(msg)) {
    return `🛸 Notre service de **Drone et Cartographie** est l'un de nos pôles d'expertise majeurs :\n\n• Cartographie par drone haute résolution\n• Conception d'orthomosaïques géoréférencées\n• Cartes d'occupation du sol\n• Télédétection et traitement d'image satellite\n\nNous utilisons une flotte de drones de dernière génération avec des capteurs multispectraux et LiDAR pour une précision centimétrique. Nos ingénieurs certifiés réalisent des missions sur toute la Côte d'Ivoire.\n\nSouhaitez-vous en savoir plus sur nos tarifs ou nos projets de cartographie ?`;
  }
  
  // Forestry
  if (/(forêt|forest|bois|arb|rebois|biomasse|carbone)/i.test(msg)) {
    return `🌲 DRONEK est spécialisé en **gestion durable des forêts** :\n\n• Inventaire forestier et faunique complet\n• Aménagement forestier durable\n• Reboisement avec espèces locales adaptées\n• Calcul de biomasse forestière\n• Mesure et suivi des stocks de carbone (REDD+)\n• Production de plants forestiers en pépinière\n\nNos ingénieurs forestiers diplômés de l'INP-HB ont réalisé plus de 150 projets à travers la Côte d'Ivoire, incluant l'inventaire du Parc National de Taï.\n\nPour un devis personnalisé, contactez-nous à contact@dronek.ci ou au +225 07 XX XX XX XX.`;
  }
  
  // Agroforestry
  if (/(agroforest)/i.test(msg)) {
    return `🌱 Notre service d'**Agroforesterie** comprend :\n\n• Formation et sensibilisation aux pratiques agroforestières\n• Production de plants agroforestiers de qualité en pépinière\n• Conception de systèmes agroforestiers intégrés\n\nNous promouvons des systèmes qui combinent production agricole et conservation des arbres, contribuant à la sécurité alimentaire et à la préservation de l'environnement.\n\nNos deux pépinières (Abidjan : 5 ha / 100 000 plants/an, Yamoussoukro : 3 ha / 60 000 plants/an) assurent une production de plants de qualité toute l'année.`;
  }
  
  // Agriculture
  if (/(agricult|coopér|coop|culture|récolt|formation)/i.test(msg)) {
    return `🌾 Notre service **Agriculture** offre :\n\n• Audit agricole complet de vos exploitations\n• Formation des coopératives en agroéconomie\n• Formation aux bonnes pratiques agricoles durables\n• Appui à la diversification des revenus\n\nNos formations ont permis d'augmenter les rendements de 25 à 40% en moyenne chez les agriculteurs formés. Nous accompagnons notamment les coopératives cacaoyères du Sud-Ouest de la Côte d'Ivoire.\n\nIntéressé par une formation ? Consultez notre catalogue ou contactez-nous !`;
  }
  
  // Contact/pricing
  if (/(contact|téléphon|phone|email|adresse|localisation|devis|prix|tarif|coût|coût)/i.test(msg)) {
    return `📍 **Contact DRONEK SARL** :\n\n• **Adresse** : Abidjan Cocody 216 Logements, 15 BP 116 Abidjan 15\n• **Téléphone** : +225 07 XX XX XX XX\n• **Email** : contact@dronek.ci\n• **Horaires** : Lun-Ven 8h00-17h00\n• **Site web** : www.dronek.ci\n\nPour un devis personnalisé, n'hésitez pas à nous contacter directement par email ou téléphone. Nos conseillers vous répondront sous 24h.`;
  }
  
  // Training
  if (/(format|cours|stage|apprentissage|certif)/i.test(msg)) {
    return `📚 **Nos Formations** :\n\n1. **Bonnes Pratiques Agricoles** — 5 jours, Débutant\n2. **Cartographie par Drone** — 7 jours, Intermédiaire\n3. **Gestion Forestière Durable** — 10 jours, Avancé\n4. **Agroforesterie Pratique** — 5 jours, Débutant\n\nToutes nos formations sont certifiantes et combinent sessions en présentiel et modules en ligne. Les effectifs sont limités (20 max, 10 pour les formations drone) pour un suivi personnalisé.\n\nInscrivez-vous via notre site ou contactez-nous à contact@dronek.ci !`;
  }
  
  // Partnership
  if (/(partenari|partenaire|collabor|oipr|sodefor|fao|pnud|bad)/i.test(msg)) {
    return `🤝 DRONEK collabore avec des organismes de référence :\n\n• **OIPR** — Office Ivoirien des Parcs et Réserves\n• **SODEFOR** — Société de Développement des Forêts\n• **FAO** — Organisation des Nations Unies pour l'Alimentation\n• **PNUD** — Programme des Nations Unies pour le Développement\n• **BAD** — Banque Africaine de Développement\n• **MINSEDD** — Ministère de l'Environnement\n\nCes partenariats nous permettent de mener des projets d'envergure comme l'inventaire du Parc National de Taï et les projets REDD+.`;
  }
  
  // Thank you
  if (/(merci|thank|remerci)/i.test(msg)) {
    return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. L'équipe DRONEK est à votre disposition. Vous pouvez aussi nous contacter directement à contact@dronek.ci ou visiter notre site www.dronek.ci pour plus d'informations.";
  }
  
  // About DRONEK
  if (/(dronek|qui êtes|à propos|about|entreprise|société|sarl)/i.test(msg)) {
    return `🏢 **DRONEK SARL** est une entreprise ivoirienne fondée en 2017, spécialisée dans les technologies innovantes pour la gestion durable des forêts et de l'agriculture.\n\n**Chiffres clés** :\n• 8+ années d'expertise\n• 150+ projets réalisés\n• 50+ partenaires\n• 4 secteurs d'activité\n\nNotre équipe d'ingénieurs certifiés utilise des drones de dernière génération et des outils de cartographie haute précision pour offrir des solutions durables et performantes.\n\nSiège : Abidjan Cocody 216 Logements, Côte d'Ivoire`;
  }
  
  // Default fallback
  return `Merci pour votre question ! Je vous invite à :\n\n1️⃣ Consulter notre site web **www.dronek.ci** pour plus de détails\n2️⃣ Nous contacter directement à **contact@dronek.ci** ou au **+225 07 XX XX XX XX**\n3️⃣ Visiter nos pages Services, Projets et Formation sur ce site\n\nNos experts vous répondront sous 24h pour toute demande spécifique. Y a-t-il un domaine particulier qui vous intéresse (foresterie, drone, agroforesterie, agriculture) ?`;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    
    // Try SDK first, fall back to intelligent responses
    const zai = await getZAI();
    
    if (zai) {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: `Tu es l'assistant virtuel de DRONEK SARL. Réponds toujours dans la langue de l'utilisateur. Sois courtois, professionnel et concis.` },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });
      const reply = completion.choices[0]?.message?.content || 'Désolé, une erreur est survenue.';
      return NextResponse.json({ reply });
    }
    
    // Fallback: intelligent keyword-based responses
    const reply = generateFallbackResponse(lastUserMessage, messages);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { reply: 'Désolé, une erreur technique est survenue. Veuillez réessayer ou nous contacter à contact@dronek.ci.' },
      { status: 500 }
    );
  }
}
