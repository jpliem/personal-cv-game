export const ZONES = [
  {
    id: 'childhood',
    name: 'Childhood',
    subtitle: 'The Beginning',
    period: '',
    description: 'A curious kid with big dreams',
    colors: { primary: 0xfca5a5, secondary: 0xf87171, accent: 0xfecaca },
    position: { x: -12, z: 8 },
    dialogue: [
      { speaker: 'narrator', text: 'Every great journey starts small...' },
      { speaker: 'jonathan', text: 'Hi! I\'m Jonathan. When I was a kid, I was always curious about how things worked.' },
      { speaker: 'jonathan', text: 'I loved taking apart gadgets, playing video games, and wondering — how do they make these?' },
      { speaker: 'narrator', text: 'That curiosity would lead him down an incredible path. Let\'s follow along...' },
    ],
    collectibles: [],
  },
  {
    id: 'binus',
    name: 'BINUS',
    subtitle: 'Campus',
    period: '2018–2022',
    description: 'Bachelor of Computer Science',
    colors: { primary: 0x4ade80, secondary: 0x22c55e, accent: 0x86efac },
    position: { x: 0, z: 0 },
    dialogue: [
      { speaker: 'narrator', text: 'Our story begins at BINUS University, Jakarta...' },
      { speaker: 'jonathan', text: 'This is where it all started. Four years of computer science — algorithms, data structures, the works.' },
      { speaker: 'jonathan', text: 'I even got to publish a research paper on autonomous drone navigation with IEEE. That was a proud moment.' },
      { speaker: 'narrator', text: 'With a GPA of 3.63 and a published paper, the next chapter awaited...' },
    ],
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
    dialogue: [
      { speaker: 'narrator', text: 'While still in university, Jonathan landed his first real tech role...' },
      { speaker: 'jonathan', text: 'Bank Central Asia — one of the biggest banks in Indonesia. I was testing APIs that handled real money.' },
      { speaker: 'jonathan', text: 'Postman, SoapUI, JMeter became my daily tools. I even built automation scripts to test API migrations.' },
      { speaker: 'narrator', text: 'Pure programming. Pure problem-solving. The foundation was being built.' },
    ],
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
    dialogue: [
      { speaker: 'narrator', text: 'The adventure expanded. Ernst & Young — the global consulting firm.' },
      { speaker: 'jonathan', text: 'Every few months, a new client, a new industry, a new challenge. Health insurance, banking, government.' },
      { speaker: 'jonathan', text: 'I helped migrate an entire insurance company to Azure Cloud. Wrote a 5-year IT strategy for a state bank.' },
      { speaker: 'jonathan', text: 'Even worked on separating an Australian bank\'s technology during an M&A deal. Wild times.' },
      { speaker: 'narrator', text: 'From code to clients — Jonathan was becoming more than just a developer.' },
    ],
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
    dialogue: [
      { speaker: 'narrator', text: 'Next stop: Blibli — one of Indonesia\'s largest e-commerce platforms.' },
      { speaker: 'jonathan', text: 'I switched sides. Instead of building systems, I was now auditing them.' },
      { speaker: 'jonathan', text: 'Data governance against Indonesia\'s new privacy law. Cybersecurity audits benchmarked to NIST and ISO.' },
      { speaker: 'jonathan', text: 'It gave me a completely different perspective — seeing systems from the defender\'s point of view.' },
      { speaker: 'narrator', text: 'The auditor\'s eye would prove invaluable for what came next...' },
    ],
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
    dialogue: [
      { speaker: 'narrator', text: 'The final chapter (so far). GSPE — where everything came together.' },
      { speaker: 'jonathan', text: 'Technical Lead. 19 enterprise systems. 9 departments. 505+ tracked requests. This is the big picture.' },
      { speaker: 'jonathan', text: 'I modernized the entire ERP stack — Docker, .NET, Vue.js, PostgreSQL. Built about 10 AI prototypes.' },
      { speaker: 'jonathan', text: 'RAG systems, computer vision, digital twins... and an IoT product called NexaBrick, from hardware to sales.' },
      { speaker: 'jonathan', text: 'Now every developer on my team has an AI coding agent. Plan-Approve-Execute. The future is here.' },
      { speaker: 'narrator', text: 'From student to tech lead. The journey continues...' },
    ],
    collectibles: [
      { id: 'gspe-1', icon: 'dashboard', label: 'Request Management System: 505+ tickets across 19 systems, 9 departments' },
      { id: 'gspe-2', icon: 'container', label: 'ERP Modernization: Docker, .NET, Vue.js, PostgreSQL' },
      { id: 'gspe-3', icon: 'brain', label: '~10 AI prototypes: RAG, computer vision, digital twin, tender processor' },
      { id: 'gspe-4', icon: 'chip', label: 'NexaBrick IoT ecosystem: hardware to commercial execution' },
    ],
  },
  {
    id: 'future',
    name: 'What\'s Next?',
    subtitle: 'The Future',
    period: '',
    description: 'The journey continues...',
    colors: { primary: 0x38bdf8, secondary: 0x0ea5e9, accent: 0x7dd3fc },
    position: { x: 60, z: -40 },
    dialogue: [
      { speaker: 'narrator', text: 'The story isn\'t over. In fact, it\'s just getting started.' },
      { speaker: 'jonathan', text: 'I\'m always looking for the next challenge. Whether it\'s leading teams, building AI systems, or creating products.' },
      { speaker: 'jonathan', text: 'If my journey resonates with you, let\'s connect. I\'d love to hear from you.' },
      { speaker: 'narrator', text: 'Thanks for exploring Jonathan\'s journey. Reach out below!' },
    ],
    collectibles: [],
    isContactZone: true,
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
