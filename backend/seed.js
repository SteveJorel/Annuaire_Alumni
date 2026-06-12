const mongoose = require('mongoose');
require('dotenv').config();
const Alumni = require('./models/alumni');

const seedData = [
  {
    fullName: 'Amadou Bello',
    graduationYear: 2021,
    company: 'Orange Cameroun',
    jobTitle: 'Développeur Full-Stack',
    skills: ['React', 'Node.js', 'MongoDB'],
    contactEmail: 'amadou.bello@example.com',
  },
  {
    fullName: 'Fatima Oumarou',
    graduationYear: 2022,
    company: 'MTN Cameroun',
    jobTitle: 'Ingénieure DevOps',
    skills: ['Docker', 'Linux', 'CI/CD'],
    contactEmail: 'fatima.oumarou@example.com',
  },
  {
    fullName: 'Ibrahim Harouna',
    graduationYear: 2023,
    company: 'Camtel',
    jobTitle: 'Administrateur Réseau',
    skills: ['Cisco', 'TCP/IP', 'Firewall'],
    contactEmail: 'ibrahim.harouna@example.com',
  },
  {
    fullName: 'Aissatou Moussa',
    graduationYear: 2021,
    company: 'Afriland First Bank',
    jobTitle: 'Analyste Cybersécurité',
    skills: ['Cybersécurité', 'Python', 'SIEM'],
    contactEmail: 'aissatou.moussa@example.com',
  },
  {
    fullName: 'Youssouf Adamou',
    graduationYear: 2024,
    company: 'Startup TechCMR',
    jobTitle: 'Développeur Mobile',
    skills: ['Flutter', 'Dart', 'Firebase'],
    contactEmail: 'youssouf.adamou@example.com',
  },
  {
    fullName: 'Mariam Ngamou',
    graduationYear: 2022,
    company: 'GIZ Cameroun',
    jobTitle: 'Chef de Projet IT',
    skills: ['Gestion de projet', 'Agile', 'Jira'],
    contactEmail: 'mariam.ngamou@example.com',
  },
  {
    fullName: 'Bouba Kaigama',
    graduationYear: 2023,
    company: 'Freelance',
    jobTitle: 'Développeur Front-End',
    skills: ['Vue.js', 'Tailwind CSS', 'TypeScript'],
    contactEmail: 'bouba.kaigama@example.com',
  },
  {
    fullName: 'Nadia Sali',
    graduationYear: 2021,
    company: 'Ministère du Numérique',
    jobTitle: 'Ingénieure Systèmes',
    skills: ['Linux', 'Virtualisation', 'Shell'],
    contactEmail: 'nadia.sali@example.com',
  },
  {
    fullName: 'Hamadou Yerima',
    graduationYear: 2024,
    company: 'Banque de France (stage)',
    jobTitle: 'Data Analyst',
    skills: ['Python', 'SQL', 'Power BI'],
    contactEmail: 'hamadou.yerima@example.com',
  },
  {
    fullName: 'Safiatou Djibrilla',
    graduationYear: 2022,
    company: 'Jumia Cameroun',
    jobTitle: 'Développeuse Back-End',
    skills: ['Java', 'Spring Boot', 'PostgreSQL'],
    contactEmail: 'safiatou.djibrilla@example.com',
  },
  {
    fullName: 'Moussa Alhadji',
    graduationYear: 2023,
    company: 'CamAirco',
    jobTitle: 'Technicien Informatique',
    skills: ['Maintenance', 'Windows Server', 'Active Directory'],
    contactEmail: 'moussa.alhadji@example.com',
  },
  {
    fullName: 'Ramatou Waziri',
    graduationYear: 2021,
    company: 'ONG Digital Africa',
    jobTitle: 'Formatrice en Informatique',
    skills: ['Pédagogie', 'Office 365', 'Réseaux'],
    contactEmail: 'ramatou.waziri@example.com',
  },
  {
    fullName: 'Aliou Maigari',
    graduationYear: 2024,
    company: 'Intelcia Cameroun',
    jobTitle: 'Développeur PHP',
    skills: ['PHP', 'Laravel', 'MySQL'],
    contactEmail: 'aliou.maigari@example.com',
  },
  {
    fullName: 'Hadja Koumakol',
    graduationYear: 2022,
    company: 'SCDP',
    jobTitle: 'Ingénieure Bases de Données',
    skills: ['Oracle', 'SQL', 'PL/SQL'],
    contactEmail: 'hadja.koumakol@example.com',
  },
  {
    fullName: 'Oumarou Abdoullahi',
    graduationYear: 2023,
    company: 'Freelance',
    jobTitle: 'Développeur React & Node',
    skills: ['React', 'Express', 'GraphQL'],
    contactEmail: 'oumarou.abdoullahi@example.com',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    await Alumni.deleteMany({});
    console.log('🗑️  Données existantes supprimées');

    await Alumni.insertMany(seedData);
    console.log(`🌱 ${seedData.length} profils Alumni insérés avec succès`);

    await mongoose.disconnect();
    console.log('🔌 Déconnexion MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seeding :', err.message);
    process.exit(1);
  }
};

seed();
