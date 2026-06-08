require("dotenv").config();
const mongoose = require("mongoose");
const Alumni = require("./models/alumni");

const alumniData = [
  {
    fullName: "Jean Yves Manaoda",
    graduationYear: 2021,
    company: "Orange Cameroun",
    jobTitle: "Développeur Full-Stack",
    skills: ["React", "Node.js", "MongoDB"],
    contactEmail: "jean.manaoda@orange.cm",
  },
  {
    fullName: "Fatima Oumarou",
    graduationYear: 2023,
    company: "MTN Cameroun",
    jobTitle: "Ingénieure Réseau",
    skills: ["Cisco", "Linux", "TCP/IP"],
    contactEmail: "fatima.oumarou@mtn.cm",
  },
  {
    fullName: "Serge Mballa Nkodo",
    graduationYear: 2021,
    company: "Intelcia Cameroun",
    jobTitle: "Développeur Back-End",
    skills: ["Node.js", "Express", "PostgreSQL"],
    contactEmail: "serge.mballa@intelcia.cm",
  },
  {
    fullName: "Aissatou Hamidou",
    graduationYear: 2022,
    company: "Afriland First Bank",
    jobTitle: "Analyste Cybersécurité",
    skills: ["Cybersécurité", "Python", "Kali Linux"],
    contactEmail: "aissatou.hamidou@afriland.cm",
  },
  {
    fullName: "Patrick Essomba",
    graduationYear: 2020,
    company: "Camtel",
    jobTitle: "Architecte Cloud",
    skills: ["AWS", "DevOps", "Docker"],
    contactEmail: "patrick.essomba@camtel.cm",
  },
  {
    fullName: "Mariam Bouba",
    graduationYear: 2024,
    company: "Startup Yaoundé Tech",
    jobTitle: "Développeuse Mobile",
    skills: ["Flutter", "Dart", "Firebase"],
    contactEmail: "mariam.bouba@yaoundetech.cm",
  },
  {
    fullName: "Jean-Claude Ndjomo",
    graduationYear: 2021,
    company: "Canal+ Cameroun",
    jobTitle: "Administrateur Système",
    skills: ["Linux", "Ansible", "VMware"],
    contactEmail: "jc.ndjomo@canal.cm",
  },
  {
    fullName: "Raïssa Tchoupe",
    graduationYear: 2023,
    company: "Société Générale Cameroun",
    jobTitle: "Data Analyst",
    skills: ["Python", "Power BI", "SQL"],
    contactEmail: "raissa.tchoupe@sgcameroun.cm",
  },
  {
    fullName: "Ibrahim Adamou",
    graduationYear: 2022,
    company: "Nexttel Cameroun",
    jobTitle: "Ingénieur Télécoms",
    skills: ["4G/LTE", "RF Planning", "Python"],
    contactEmail: "ibrahim.adamou@nexttel.cm",
  },
  {
    fullName: "Christelle Ngo Biyong",
    graduationYear: 2024,
    company: "Cabinet Digital Douala",
    jobTitle: "Développeuse Front-End",
    skills: ["React", "Figma", "TailwindCSS"],
    contactEmail: "christelle.ngobiyong@cabdigital.cm",
  },
  {
    fullName: "Oumarou Yerima",
    graduationYear: 2020,
    company: "ANTIC Cameroun",
    jobTitle: "Responsable Sécurité SI",
    skills: ["Cybersécurité", "RGPD", "ISO 27001"],
    contactEmail: "oumarou.yerima@antic.cm",
  },
  {
    fullName: "Sandrine Fouda",
    graduationYear: 2023,
    company: "Jumia Cameroun",
    jobTitle: "Développeuse Back-End",
    skills: ["Java", "Spring Boot", "MySQL"],
    contactEmail: "sandrine.fouda@jumia.cm",
  },
  {
    fullName: "Blaise Kamto",
    graduationYear: 2021,
    company: "Huawei Cameroun",
    jobTitle: "Ingénieur IA",
    skills: ["Machine Learning", "TensorFlow", "Python"],
    contactEmail: "blaise.kamto@huawei.cm",
  },
  {
    fullName: "Nadia Tsala",
    graduationYear: 2024,
    company: "Freelance",
    jobTitle: "Développeuse Web Full-Stack",
    skills: ["Vue.js", "Laravel", "Docker"],
    contactEmail: "nadia.tsala@gmail.com",
  },
  {
    fullName: "Rodrigue Nguele",
    graduationYear: 2022,
    company: "Ingelec Cameroun",
    jobTitle: "DevOps Engineer",
    skills: ["DevOps", "Kubernetes", "CI/CD"],
    contactEmail: "rodrigue.nguele@ingelec.cm",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB.");

    // Suppression des données existantes avant insertion
    await Alumni.deleteMany({});

    // Insertion des 15 profils fictifs
    await Alumni.insertMany(alumniData);
    console.log("✅ Base de données peuplée avec 15 profils Alumni.");
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();
