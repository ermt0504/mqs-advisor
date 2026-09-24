// Tous les textes du site en français. Modifiez ici pour changer le contenu.
export const fr = {
  meta: {
    siteName: "MQS_Advisor",
    home: {
      title: "MQS_Advisor — Nous bâtissons l'empire numérique",
      description:
        "MQS_Advisor conçoit des produits et des plateformes publiques et gouvernementales, puis les transforme en sociétés. France, Sénégal, Djibouti, Canada.",
    },
    vision: { title: "Vision — MQS_Advisor", description: "Le manifeste de MQS_Advisor : une idée entre, une société sort." },
    services: {
      title: "Services — MQS_Advisor",
      description: "Développement de produit, plateformes publiques, solutions gouvernementales et incubation.",
    },
    incubator: {
      title: "Incubateur — MQS_Advisor",
      description: "Embarquer, développer, promouvoir, devenir société : le modèle incubateur de MQS_Advisor.",
    },
    projects: {
      title: "Projets — MQS_Advisor",
      description: "Le portefeuille de MQS_Advisor : Saturne Pro, Taxi Conventionné Médical et projets en cours.",
    },
    presence: {
      title: "Présence — MQS_Advisor",
      description: "MQS_Advisor est présent au Canada (siège), en France, au Sénégal et à Djibouti.",
    },
    team: { title: "Équipe — MQS_Advisor", description: "L'équipe MQS_Advisor et les postes ouverts." },
    contact: {
      title: "Contact — MQS_Advisor",
      description: "Contactez MQS_Advisor ou soumettez votre projet à l'incubateur.",
    },
  },
  nav: {
    vision: "Vision",
    services: "Services",
    incubator: "Incubateur",
    projects: "Projets",
    presence: "Présence",
    team: "Équipe",
    contact: "Contact",
    submit: "Soumettre un projet",
    menu: "Menu",
    close: "Fermer",
    skip: "Aller au contenu",
  },
  countries: { CA: "Canada", FR: "France", SN: "Sénégal", DJ: "Djibouti" },
  status: { live: "En ligne", wip: "En cours" },
  common: {
    toProvide: "À fournir",
    toProvideBy: "Contenu à fournir par MQS_Advisor.",
    imageSlot: "Visuel à fournir",
    visit: "Visiter le site",
    back: "Retour aux projets",
    projectsCount: (n: number) => (n > 1 ? `${n} projets` : `${n} projet`),
  },
  home: {
    status: "Studio produit · Incubateur · Canada",
    h1a: "Nous bâtissons",
    h1b: "l'empire",
    h1c: "numérique",
    intro:
      "MQS_Advisor conçoit des produits et des plateformes publiques et gouvernementales, puis les transforme en sociétés. Des projets en France, au Sénégal, à Djibouti et au Canada.",
    codes: [
      { code: "CA", label: "Siège" },
      { code: "FR", label: "2 produits" },
      { code: "SN", label: "En cours" },
      { code: "DJ", label: "En cours" },
    ],
    modelLabel: "[01] Le modèle",
    modelTitle: "Une idée entre. Une société sort.",
    figuresLabel: "[02] Chiffres clés",
    figures: [
      { value: 4, label: "Pays" },
      { value: 2, label: "Produits en ligne" },
      { value: 3, label: "Projets en cours" },
    ],
    portfolioLabel: "[03] Portefeuille",
    ctaTitleA: "Votre projet",
    ctaTitleB: "est le suivant.",
  },
  steps: [
    { title: "Embarquer", text: "Sélection du projet, cadrage du besoin et du marché." },
    { title: "Développer", text: "Conception, développement et mise en production du produit." },
    { title: "Promouvoir", text: "Lancement, acquisition et partenariats institutionnels." },
    { title: "Devenir société", text: "Le produit prend son indépendance, avec sa propre équipe." },
  ],
  projects: [
    {
      slug: "saturne-pro",
      name: "Saturne Pro",
      country: "FR",
      sector: "Santé",
      status: "live",
      url: "https://saturnepro.com/",
      desc: "Logiciel des taxis conventionnés : planning, facturation, PEC+, télétransmission B2.",
      confidential: false,
    },
    {
      slug: "taxi-conventionne-medical",
      name: "Taxi Conventionné Médical",
      country: "FR",
      sector: "Mobilité",
      status: "live",
      url: "https://taxiconventionnemedical.fr/",
      desc: "Réservation de transports médicaux ponctuels ou réguliers, partout en France.",
      confidential: false,
    },
    { slug: "senegal", name: "Projet confidentiel", country: "SN", sector: "", status: "wip", url: "", desc: "", confidential: true },
    { slug: "djibouti", name: "Projet confidentiel", country: "DJ", sector: "", status: "wip", url: "", desc: "", confidential: true },
    { slug: "canada", name: "Projet confidentiel", country: "CA", sector: "", status: "wip", url: "", desc: "", confidential: true },
  ] as Project[],
  vision: {
    label: "[01] Manifeste",
    statements: [
      "Nous bâtissons l'empire numérique.",
      "Une idée entre. Une société sort.",
      "Nous concevons des produits et des plateformes publiques, parfois gouvernementales.",
      "Nous embarquons un projet, développons le produit, le promouvons.",
      "Puis il devient une société indépendante.",
      "Nous construisons là où le numérique change des vies.",
      "Du code, du droit, de la stratégie. Sous un même toit.",
      "France. Sénégal. Djibouti. Canada.",
    ],
    note: "",
  },
  services: {
    label: "[01] Services",
    title: "Quatre métiers, un même modèle.",
    deliverables: "Livrables",
    related: "Projets liés",
    items: [
      {
        title: "Développement de produit",
        text: "Conception, développement et mise en production de produits numériques.",
        related: ["saturne-pro", "taxi-conventionne-medical"],
        deliverables: ["Cadrage produit et maquettes", "Application web et mobile", "Mise en production et hébergement", "Maintenance et évolutions"],
      },
      { title: "Plateformes publiques", text: "Plateformes numériques ouvertes au public : réservation, information, services en ligne, pensées pour des milliers d'utilisateurs.", related: ["taxi-conventionne-medical"], deliverables: ["Portail citoyen ou grand public", "Parcours accessibles (RGAA / WCAG)", "Tableaux de bord de suivi", "Support et exploitation"] },
      { title: "Solutions gouvernementales", text: "Produits destinés aux gouvernements et aux institutions : dématérialisation, registres, guichets numériques, avec un cadre juridique et de sécurité maîtrisé.", related: [], deliverables: ["Étude d'opportunité et cadrage réglementaire", "Plateforme sécurisée et souveraine", "Formation des agents", "Transfert de compétences"] },
      {
        title: "Incubation",
        text: "MQS embarque un projet, développe le produit, le promeut, puis en fait une société indépendante.",
        related: ["saturne-pro"],
        deliverables: ["Équipe produit et technique dédiée", "Stratégie de lancement", "Structuration juridique de la société", "Accès au réseau de partenaires"],
      },
    ],
  },
  incubator: {
    label: "[01] Incubateur",
    title: "Embarquer. Développer. Promouvoir. Devenir société.",
    detailsLabel: "[02] Le programme",
    details: [
      { title: "Critères de sélection", text: "Un problème réel et mesurable, un marché identifié, un porteur engagé à temps plein et un impact possible en France, en Afrique ou au Canada." },
      { title: "Accompagnement", text: "Une équipe produit, technique et juridique mobilisée : conception, développement, mise en conformité, lancement commercial et relations institutionnelles." },
      { title: "Durée", text: "De 12 à 24 mois selon la complexité du produit, jusqu'à ce que la société puisse fonctionner avec sa propre équipe." },
      { title: "Ce que reçoit le porteur", text: "Un produit en production, une société structurée juridiquement, des premiers clients et une participation au capital définie dès l'embarquement." },
    ],
  },
  projectsPage: {
    label: "[01] Projets",
    title: "Le portefeuille.",
    country: "Pays",
    status: "Statut",
    all: "Tous",
    empty: "Aucun projet pour ces filtres.",
    detailLabel: "[01] Projet",
    confidentialText: "Ce projet est confidentiel. Les informations seront publiées ultérieurement.",
  },
  presence: {
    label: "[01] Présence",
    title: "Quatre pays. Un siège.",
    hint: "Cliquez sur un pays pour voir ses projets.",
    hq: "Siège",
    panelEmpty: "Aucun projet publié pour ce pays.",
  },
  team: {
    label: "[01] Équipe",
    title: "Les bâtisseurs.",
    member: "Nom à fournir",
    role: "Rôle à fournir",
    members: [
      { key: "ceo", name: "Nom à fournir", role: "Co-fondateur · CEO", origin: "Sénégal · Cameroun", bio: "Porte la vision et la stratégie de MQS_Advisor, les partenariats institutionnels et le développement en Afrique et au Canada." },
      { key: "cto", name: "Nom à fournir", role: "Co-fondateur · CTO", origin: "Maroc", bio: "Dirige l'architecture et le développement des produits, de la première ligne de code à la mise en production." },
      { key: "legal", name: "Nom à fournir", role: "Co-fondateur · Directeur juridique", origin: "Tunisie", bio: "Encadre la conformité des produits, les contrats publics et la structuration juridique des sociétés issues de l'incubateur." },
    ],
    joinLabel: "[02] Rejoindre MQS",
    joinTitle: "Rejoindre MQS.",
    joinText: "Développeurs, designers produit, juristes, chefs de projet : nous cherchons des profils qui veulent construire des produits utiles et les voir devenir des sociétés. Envoyez-nous votre candidature spontanée.",
    joinCta: "Nous écrire",
  },
  contact: {
    label: "[01] Contact",
    title: "Parlons-en.",
    tabGeneral: "Contact général",
    tabProject: "Soumettre un projet",
    name: "Nom",
    email: "Email",
    organisation: "Organisation",
    message: "Message",
    projectName: "Nom du projet",
    country: "Pays",
    sector: "Secteur",
    stage: "Stade",
    stages: ["Idée", "Prototype", "Produit lancé", "En croissance"],
    description: "Description",
    link: "Lien",
    attachment: "Pièce jointe (10 Mo max)",
    send: "Envoyer",
    sending: "Envoi…",
    success: "Merci. Votre message a bien été envoyé.",
    error: "L'envoi a échoué. Réessayez plus tard.",
    required: "Champ requis",
    invalidEmail: "Email invalide",
    fileTooBig: "Fichier trop volumineux (10 Mo max)",
  },
  footer: {
    legal: "Mentions légales",
    legalText: "MQS_Advisor, siège au Canada.",
    rights: "Tous droits réservés.",
  },
};

export type Project = {
  slug: string;
  name: string;
  country: "CA" | "FR" | "SN" | "DJ";
  sector: string;
  status: "live" | "wip";
  url: string;
  desc: string;
  confidential: boolean;
};

export type Dict = typeof fr;
