// All the profile content for the home page lives here.
// Edit this file to update your details - no HTML needed.

export const SITE = {
  name: 'Rahul',
  title: 'Rahul: Cloud & AI Digital Transformation Leader',
  description:
    'Cloud Data and AI Transformation Leader helping organisations modernise complex environments and build intelligent, AI-ready platforms.',
  email: 'rahul@rahulrahul.com.au',
  phone: '+61 432 140 552',
  phoneHref: 'tel:+61432140552',
  website: 'rahulrahul.com.au',
  resume: '/files/Rahul-Resume.pdf',
  linkedin: 'https://www.linkedin.com/in/iamrahulus/',
  // Add more profiles here, e.g. { label: 'GitHub', href: 'https://github.com/you' }
  socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/iamrahulus/' }],
};

export const NAV = [
  { label: 'About', href: '/#about' },
  { label: 'Journey', href: '/#journey' },
  { label: 'Achievements', href: '/#impact' },
  { label: 'Credentials', href: '/#credentials' },
  { label: 'Case Studies & Blogs', href: '/blogs' },
  { label: 'Contact', href: '/#contact' },
];

export const HERO = {
  badge: 'Available for Consultation',
  heading: 'Cloud Data & AI Transformation Leader',
  intro:
    'Driving digital innovation and enterprise transformation with 25+ years of expertise across banking, consulting, and cutting-edge technology solutions.',
  stats: [
    { value: '25+', label: 'Years Experience' },
    { value: '100+', label: 'Projects Delivered' },
    { value: '50+', label: 'Enterprise Clients' },
  ],
};

export const ABOUT = {
  text: 'I help organisations modernise complex environments, strengthen operational resilience, and build intelligent, AI-ready platforms. My approach combines strategic architecture leadership with hands-on delivery to drive measurable business outcomes.',
  highlight: { value: '$85M', label: 'Reduced in technology debt through automation, optimisation and modernisation' },
  expertise: [
    'Cloud Modernisation',
    'AI Readiness & Automation',
    'Data Platform Strategy',
    'Technology Governance',
    'Enterprise Architecture',
    'Stakeholder Engagement',
    'Transformation Leadership',
  ],
};

export const JOURNEY = [
  {
    short: 'NAB',
    role: 'Senior Cloud Architect',
    org: 'National Australia Bank',
    period: '2021 - Present',
    summary: 'Shaped cloud, data, and AI enablement across platforms; guided architecture decisions for migration and automation',
  },
  {
    short: 'MRK',
    role: 'Co-Founder & Chief Architect',
    org: 'MR Kloud Foundation',
    period: '2021 - Present',
    summary: 'Helping shape better environment through circular economy',
  },
  {
    short: 'MTM',
    role: 'Cloud Architect',
    org: 'Metro Trains Melbourne',
    period: '2019 - 2020',
    summary: 'Modernised core systems, improved uptime to 99.99%, reduced costs by 50%',
  },
  {
    short: 'CTN',
    role: 'Principal Consultant',
    org: 'Contino',
    period: '2018 - 2019',
    summary: 'Advised enterprise clients on DevOps and cloud transformation',
  },
  {
    short: 'AWS',
    role: 'Senior Technical Account Manager',
    org: 'Amazon Web Services',
    period: '2015 - 2018',
    summary: 'Led multi-domain migration strategy for Fortune 500 clients',
  },
];

// `target` is animated from 0 when the section scrolls into view.
export const IMPACT = [
  { target: 85, prefix: '$', suffix: 'M', label: 'Reduced in technology debt' },
  { target: 5, suffix: ' PB+', label: 'Customer data secured' },
  { target: 250, suffix: '+', label: 'Architecture artefacts delivered' },
  { target: 99.99, suffix: '%', decimals: 2, label: 'Platform uptime achieved' },
  { target: 50, suffix: '%', label: 'Operational costs reduced' },
  { target: 25, suffix: '+ Years', label: 'Industry experience' },
];

export const CREDENTIALS = {
  education: 'Bachelor in Engineering',
  certifications: [
    'AWS Certified Solutions Architect – Professional',
    'Microsoft Certified: Azure Solutions Architect Expert',
    'FINSIA Certified',
    'APRA CPS230 and CPS234 Compliance Knowledge',
  ],
  note: 'Staying current with evolving cloud and AI technologies',
};
