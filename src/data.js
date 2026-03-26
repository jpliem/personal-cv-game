export const ZONES = [
  {
    id: 'binus',
    name: 'BINUS',
    subtitle: 'Campus',
    period: '2018–2022',
    description: 'Bachelor of Computer Science',
    colors: { primary: 0x4ade80, secondary: 0x22c55e, accent: 0x86efac },
    position: { x: 0, z: 0 },
    collectibles: [
      { id: 'binus-1', icon: 'graduation', label: 'Bachelor of Computer Science, GPA 3.63' },
      { id: 'binus-2', icon: 'drone', label: 'Published IEEE paper on Autonomous Drone Indoor Navigation' },
      { id: 'binus-3', icon: 'book', label: 'Built foundation in computer science fundamentals' },
    ],
  },
  {
    id: 'bca',
    name: 'BCA',
    subtitle: 'Code Lab',
    period: '2021–2022',
    description: 'Software Quality Assurance Intern',
    colors: { primary: 0x60a5fa, secondary: 0x3b82f6, accent: 0x1e293b },
    position: { x: 12, z: -8 },
    collectibles: [
      { id: 'bca-1', icon: 'api', label: 'Manual & automated testing of banking APIs (Postman, SoapUI, JMeter)' },
      { id: 'bca-2', icon: 'robot', label: 'Built automation tools for API migration testing' },
      { id: 'bca-3', icon: 'terminal', label: 'Tested transactional banking system APIs across versions' },
    ],
  },
  {
    id: 'ey',
    name: 'EY',
    subtitle: "Explorer's Guild",
    period: '2022–2024',
    description: 'Associate Consultant',
    colors: { primary: 0xfbbf24, secondary: 0xf59e0b, accent: 0xfde68a },
    position: { x: 24, z: -16 },
    collectibles: [
      { id: 'ey-1', icon: 'cloud', label: 'Cloud Migration to Azure Data Cloud for health insurance company' },
      { id: 'ey-2', icon: 'server', label: 'Data Center capacity planning strategy for state-owned bank' },
      { id: 'ey-3', icon: 'scroll', label: '5-Year IT Strategic Plan with capability gap assessments' },
      { id: 'ey-4', icon: 'briefcase', label: 'Bank Separation PMO for technology & data workstream' },
    ],
  },
  {
    id: 'blibli',
    name: 'Blibli',
    subtitle: 'Audit Fortress',
    period: '2024–2025',
    description: 'Senior IT Internal Audit Officer',
    colors: { primary: 0xa78bfa, secondary: 0x8b5cf6, accent: 0x7c3aed },
    position: { x: 36, z: -24 },
    collectibles: [
      { id: 'blibli-1', icon: 'shield', label: 'Data Governance Assessment against UU PDP regulations' },
      { id: 'blibli-2', icon: 'magnifier', label: 'End-to-end cybersecurity audit benchmarked to NIST/ISO' },
      { id: 'blibli-3', icon: 'checklist', label: 'Application integrity reviews for system reliability' },
    ],
  },
  {
    id: 'gspe',
    name: 'GSPE',
    subtitle: 'Command Center',
    period: '2025–Present',
    description: 'Technical Lead',
    colors: { primary: 0xf472b6, secondary: 0xec4899, accent: 0xf9a8d4 },
    position: { x: 48, z: -32 },
    collectibles: [
      { id: 'gspe-1', icon: 'dashboard', label: 'Request Management System: 505+ tickets across 19 systems, 9 departments' },
      { id: 'gspe-2', icon: 'container', label: 'ERP Modernization: Docker, .NET, Vue.js, PostgreSQL' },
      { id: 'gspe-3', icon: 'brain', label: '~10 AI prototypes: RAG, computer vision, digital twin, tender processor' },
      { id: 'gspe-4', icon: 'chip', label: 'NexaBrick IoT ecosystem: hardware to commercial execution' },
    ],
  },
];

export const SKILLS = [
  {
    group: 'Development',
    color: 0x60a5fa,
    items: [
      { name: '.NET / C#', level: 0.7 },
      { name: 'Vue.js', level: 0.7 },
      { name: 'Next.js', level: 0.6 },
      { name: 'PostgreSQL', level: 0.7 },
      { name: 'Node.js', level: 0.6 },
    ],
  },
  {
    group: 'Infrastructure',
    color: 0x4ade80,
    items: [
      { name: 'Docker', level: 0.7 },
      { name: 'Microservices', level: 0.6 },
      { name: 'Linux Admin', level: 0.6 },
    ],
  },
  {
    group: 'Governance',
    color: 0xa78bfa,
    items: [
      { name: 'IT Audit', level: 0.8 },
      { name: 'ISO 27001', level: 0.7 },
      { name: 'NIST', level: 0.7 },
      { name: 'Risk Assessment', level: 0.7 },
    ],
  },
  {
    group: 'Automation & AI',
    color: 0xf472b6,
    items: [
      { name: 'n8n', level: 0.7 },
      { name: 'RAG Systems', level: 0.6 },
      { name: 'Computer Vision', level: 0.5 },
      { name: 'AI Agents', level: 0.7 },
    ],
  },
];

export const CERTIFICATIONS = [
  'IELTS Band 8',
  'AI Bronze (EY)',
  'Strategy Bronze (EY)',
  'Digital Bronze (EY)',
  'Data Warehouse (Snowflake)',
  'Data Analytics (Google)',
  'AI Foundations (IBM)',
];

export const PLAYER_CARD = {
  name: 'Jonathan Putra',
  title: 'Technical Lead',
  location: 'Jakarta, Indonesia',
  email: 'jonathanputra23@gmail.com',
  linkedin: 'linkedin.com/in/jonathan-putra/',
};

export const TOTAL_COLLECTIBLES = ZONES.reduce((sum, z) => sum + z.collectibles.length, 0);
