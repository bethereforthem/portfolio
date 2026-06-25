// Edit this file to update your personal info across the whole site.

export const profile = {
  name: 'David',
  fullName: 'David Kayigamba',
  email: 'davidkayigamba2@gmail.com',
  phone: '+250 781 042 421',
  whatsappLink: 'https://wa.me/+250781042421',
  location: 'Kigali, Rwanda',
  aboutLocation: 'Musanze, Rwanda',
  university: 'University of Rwanda Student',
  linkedin: {
    label: 'David Kayigamba',
    url: 'https://www.linkedin.com/in/david-kayigamba-86405430a/',
  },
  cvUrl: 'https://drive.google.com/file/d/1p0vtLOFIRAbKdRlntai_nsJHeJfdyl8x/view?usp=drive_link',
  resumeUrl: 'https://drive.google.com/file/d/1AMnxqQogoq--IbhPA2pl6Y_QaX-dNNeB/view?usp=drive_link',

  welcomeText: `I am motivated by the potential for software to change the world and I want to be a part of that change.
  As a software engineer, I have the opportunity to use my technical skills and problem-solving abilities
  to design and develop solutions that make a positive impact on people's lives.
  I am eager to continuously learn and adapt to the ever-evolving field of software development.`,

  bio: `I am a qualified man with professional ethics. It is now 2 years in
  University of Rwanda. I hold an advanced certificate of education
  (A2) in Mathematics-Physics-Computer Science. Throughout this
  learning journey, I have developed good communication skills, time
  management, and problem solving skills. I am always eager to learn
  and earn more skills.`,

  contactAddress: '123 Main Street, Musanze, Rwanda',
  workingHours: 'Mon-Fri, 9AM - 5PM',
}

export const languages = [
  {
    name: 'Kinyarwanda',
    description: 'Fluent in speaking, reading, and writing.',
    gradient: 'from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500',
    textColor: 'text-blue-100',
  },
  {
    name: 'English',
    description: 'Fluent in speaking, reading, and writing.',
    gradient: 'from-green-300 to-green-400 hover:from-green-400 hover:to-green-500',
    textColor: 'text-green-100',
  },
]

export const skillCategories = [
  {
    title: 'Frontend Development',
    icon: 'fas fa-laptop-code',
    bg: 'bg-blue-100',
    titleColor: 'text-blue-800',
    skills: [
      { name: 'HTML5', icon: 'fab fa-html5', color: 'text-orange-500', hoverBg: 'hover:bg-orange-100' },
      { name: 'CSS3', icon: 'fab fa-css3-alt', color: 'text-blue-500', hoverBg: 'hover:bg-blue-100' },
      { name: 'JavaScript', icon: 'fab fa-js-square', color: 'text-yellow-400', hoverBg: 'hover:bg-yellow-100' },
      { name: 'React.js', icon: 'fab fa-react', color: 'text-cyan-400', hoverBg: 'hover:bg-cyan-100' },
      { name: 'Responsive Design', icon: 'fas fa-mobile-alt', color: 'text-pink-400', hoverBg: 'hover:bg-pink-100' },
      { name: 'Bootstrap', icon: 'fab fa-bootstrap', color: 'text-purple-600', hoverBg: 'hover:bg-purple-100' },
      { name: 'Tailwind CSS', icon: 'fas fa-palette', color: 'text-indigo-400', hoverBg: 'hover:bg-indigo-100' },
    ],
  },
  {
    title: 'Backend Development',
    icon: 'fas fa-server',
    bg: 'bg-green-100',
    titleColor: 'text-green-800',
    skills: [
      { name: 'Node.js', icon: 'fab fa-node-js', color: 'text-green-600', hoverBg: 'hover:bg-green-100' },
      { name: 'Express.js', icon: 'fas fa-leaf', color: 'text-green-700', hoverBg: 'hover:bg-green-200' },
      { name: 'Django', icon: 'fab fa-python', color: 'text-blue-400', hoverBg: 'hover:bg-blue-100' },
    ],
  },
  {
    title: 'Databases',
    icon: 'fas fa-database',
    bg: 'bg-purple-100',
    titleColor: 'text-purple-800',
    skills: [
      { name: 'MySQL', icon: 'fas fa-database', color: 'text-blue-800', hoverBg: 'hover:bg-blue-100' },
      { name: 'MongoDB', icon: 'fas fa-database', color: 'text-green-500', hoverBg: 'hover:bg-green-100' },
      { name: 'PostgreSQL', icon: 'fas fa-database', color: 'text-indigo-500', hoverBg: 'hover:bg-indigo-100' },
      { name: 'Redis', icon: 'fas fa-database', color: 'text-red-500', hoverBg: 'hover:bg-red-100' },
    ],
  },
  {
    title: 'DevOps',
    icon: 'fas fa-tools',
    bg: 'bg-yellow-100',
    titleColor: 'text-yellow-800',
    skills: [
      { name: 'Docker', icon: 'fab fa-docker', color: 'text-blue-600', hoverBg: 'hover:bg-blue-100' },
      { name: 'AWS', icon: 'fab fa-aws', color: 'text-orange-400', hoverBg: 'hover:bg-orange-100' },
      { name: 'CI/CD', icon: 'fas fa-cloud-upload-alt', color: 'text-cyan-600', hoverBg: 'hover:bg-cyan-100' },
      { name: 'Nginx', icon: 'fas fa-server', color: 'text-gray-600', hoverBg: 'hover:bg-gray-100' },
    ],
  },
  {
    title: 'Tools & Technologies',
    icon: 'fas fa-tools',
    bg: 'bg-pink-100',
    titleColor: 'text-pink-800',
    skills: [
      { name: 'Git', icon: 'fab fa-git-alt', color: 'text-red-500', hoverBg: 'hover:bg-red-100' },
      { name: 'GitHub', icon: 'fab fa-github', color: 'text-black', hoverBg: 'hover:bg-gray-200' },
      { name: 'GitLab', icon: 'fas fa-code-branch', color: 'text-green-500', hoverBg: 'hover:bg-green-100' },
      { name: 'Figma', icon: 'fab fa-figma', color: 'text-purple-600', hoverBg: 'hover:bg-purple-100' },
      { name: 'CLI', icon: 'fas fa-terminal', color: 'text-gray-800', hoverBg: 'hover:bg-gray-100' },
      { name: 'npm', icon: 'fab fa-npm', color: 'text-red-600', hoverBg: 'hover:bg-red-200' },
    ],
  },
]

export const projects = [
  {
    title: 'Visit Rwanda',
    icon: 'fa-solid fa-earth-africa',
    iconColor: 'text-blue-700',
    image: '/images/rwanda.webp',
    description:
      'The project aims to showcase Rwanda as a top travel destination, highlighting its stunning landscapes, diverse wildlife, rich culture, and investment opportunities.',
    link: 'https://bethereforthem.github.io/Visit-Rwanda/',
    variant: 'card',
  },
  {
    title: 'Currency Converter',
    icon: 'fa fa-exchange-alt',
    iconColor: 'text-blue-500',
    image: '/images/currency.jpg',
    description:
      'A web-based app that converts from any currency to USD and vice versa using live exchange rates. Built with Tailwind CSS and Font Awesome for a clean, responsive UI.',
    link: 'https://bethereforthem.github.io/Currency-converter/',
    variant: 'currency',
  },
  {
    title: '\u{1F4CB} To-Do List Pro',
    image: '/images/to_do.webp',
    description:
      'A sleek and intuitive to-do list web app that helps users manage tasks, customize reset intervals, and stay productive every day.',
    link: 'https://bethereforthem.github.io/To-Do-LIst/',
    variant: 'todo',
  },
]

export const placeholderProjectCount = 9

export const emailjsConfig = {
  publicKey: 'wfe6hOl2NMntWI03D',
  serviceId: 'service_02bum3x',
  adminTemplateId: 'template_fg1goxe',
  userTemplateId: 'template_pygq6ig',
}
