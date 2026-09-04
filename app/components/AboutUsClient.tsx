'use client';

import React, { useState } from 'react';
import habeeb from "@/public/jpg/habeeb-picture.jpg"
import Image, { type StaticImageData } from 'next/image';
import { motion, useScroll, useSpring, AnimatePresence, Variants } from 'framer-motion';
import {
  Building2,
  ChevronDown,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  Search,
  Wrench,
  Compass,
  Target,
  ExternalLink,
  X,
  Award,
  Briefcase,
  Code2,
  UserCheck,
} from 'lucide-react';
import MapDisplay, { LocationCoordinates } from './googleMap/MapDisplay';
import { FaGithub, FaLinkedin, FaTwitter, FaChevronRight } from 'react-icons/fa';
// Mock Office Location (Victoria Island, Lagos)
const OFFICE_LOCATION: LocationCoordinates = {
  lat: 6.4281,
  lng: 3.4219,
};

// Expanded Interactive Company Tree & Portfolio Data Structure
interface Project {
  title: string;
  description: string;
  techStack: string[];
}

interface TeamNode {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  image: string | StaticImageData;
  location?: string;
  experienceYears?: number;
  skills?: string[];
  achievements?: string[];
  projects?: Project[];
  socials?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  reports?: TeamNode[];
}

// Company Org Chart Hierarchy Data Structure
const orgChartTree: TeamNode = {
  id: 'ceo',
  name: 'Blessing Bamise',
  role: 'Chief Executive Officer',
  department: 'Executive Leadership',
  location: 'Lagos, Nigeria',
  experienceYears: 10,
  bio: 'Leading Conekta’s strategic vision to transform real estate across Africa with modern digital infrastructure.',
  image:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
  skills: ['Strategic Leadership', 'Venture Growth', 'PropTech Ecosystems'],
  achievements: [
    'Spearheaded Conekta’s multi-portal launch across major Nigerian metropolitan hubs',
    'Established strategic partnerships with verified property managers and financial institutions',
  ],
  socials: {
    linkedin: 'https://linkedin.com',
  },
  reports: [
    {
      id: 'cfo',
      name: 'Emmanuel',
      role: 'Chief Financial Officer',
      department: 'Finance & Growth',
      location: 'Lagos, Nigeria',
      experienceYears: 9,
      bio: 'Overseeing fiscal strategy, risk management, and capital allocation across all Conekta portals.',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
      skills: ['Financial Modeling', 'Risk Management', 'Capital Strategy'],
      achievements: [
        'Streamlined tenant-to-landlord escrow clearing pipelines',
      ],
      socials: {
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: 'cto',
      name: 'Alex Sterling',
      role: 'Chief Technology Officer',
      department: 'Engineering & Technology',
      location: 'Lagos, Nigeria',
      experienceYears: 12,
      bio: 'Driving technological innovation, cloud architecture, and technical integrity across the Conekta ecosystem.',
      image:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      skills: ['System Architecture', 'Cloud Infrastructure', 'Tech Leadership'],
      achievements: [
        'Architected high-availability microservices capable of serving millions of concurrent listing queries',
      ],
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
      reports: [
        {
          id: 'frontend-lead',
          name: 'Idris Habeeb .B',
          role: 'Lead Front-End Developer',
          department: 'Software',
          location: 'Lagos, Nigeria',
          experienceYears: 4,
          bio: 'Building hyper-performant, responsive web and mobile interfaces using Next.js and React Native.',
          image:
            habeeb,
          skills: [
            'React / Next.js',
            'React Native Expo',
            'TypeScript',
            'Redux Toolkit & RTK Query',
            'Tailwind CSS',
            'Framer Motion',
          ],
          achievements: [
            'Engineered interactive tree visualizations, auth modal portals, and real-time dashboard UI components',
            'Optimized client-side rendering speed, achieving 98+ Lighthouse performance scores',
            'Bsc engioneerig'
          ],
          projects: [
            {
              title: 'Conekta Multi-Portal UI',
              description: 'Next.js web application tailored for tenants, landlords, and service providers.',
              techStack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
            },
          ],
          socials: {
            github: 'https://github.com/Kingbee1M',
            linkedin: 'https://www.linkedin.com/in/habeeb-idris-babatunde/',
          },
        },
        {
          id: 'backend-dev',
          name: 'Sarah',
          role: 'Back-End Engineer',
          department: 'Engineering',
          location: 'Lagos, Nigeria',
          experienceYears: 5,
          bio: 'Constructing robust microservices, PostgreSQL relational models, and secure NestJS REST APIs.',
          image:
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
          skills: ['NestJS', 'TypeORM / Prisma', 'PostgreSQL', 'Redis Caching', 'Node.js'],
          achievements: [
            'Implemented automated verification pipelines and sub-100ms database caching strategy',
          ],
          projects: [
            {
              title: 'Conekta Core API',
              description: 'NestJS backend microservices driving authentication, listing index, and booking.',
              techStack: ['NestJS', 'TypeORM', 'PostgreSQL', 'Redis'],
            },
          ],
          socials: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
          },
        },
        {
          id: 'uiux-designer',
          name: 'Wale',
          role: 'UI/UX & Product Designer',
          department: 'Product & UX',
          location: 'Lagos, Nigeria',
          experienceYears: 5,
          bio: 'Crafting user-centric design systems, interactive prototypes, and intuitive digital experiences.',
          image:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
          skills: ['Figma', 'UI/UX Design', 'User Research', 'Design Systems', 'Prototyping'],
          achievements: [
            'Designed the complete Conekta design system and brand identity guidelines',
          ],
          projects: [
            {
              title: 'Mega Mall & Conekta Mobile UI',
              description: 'Comprehensive UI kits and user flow maps for mobile app applications.',
              techStack: ['Figma', 'Prototyping', 'Design Systems'],
            },
          ],
          socials: {
            linkedin: 'https://linkedin.com',
            twitter: 'https://twitter.com',
          },
        },
      ],
    },
    {
      id: 'product-manager',
      name: 'Joyce',
      role: 'Product Manager',
      department: 'Management & Operations',
      location: 'Lagos, Nigeria',
      experienceYears: 7,
      bio: 'Translating business goals into user-centric product roadmaps and coordinating engineering sprints.',
      image:
        'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
      skills: ['Product Strategy', 'Agile/Scrum', 'User Analytics', 'Sprint Planning'],
      achievements: [
        'Managed cross-functional development sprints across the 3 portal release cycles',
      ],
      socials: {
        linkedin: 'https://linkedin.com',
      },
    },
  ],
};

// FAQs Data
const faqs = [
  {
    question: 'What is Conekta?',
    answer:
      'Conekta is an end-to-end real estate ecosystem that connects property seekers, landlords/agents, and home service artisans in one seamless platform.',
  },
  {
    question: 'What are the 3 Portals on Conekta?',
    answer:
      'Conekta features three specialized portals: Tenant & Buyer Portal (for discovering and renting properties), Lister Dashboard (for landlords and agents to manage listings and leads), and Artisan Services (for hiring verified maintenance professionals).',
  },
  {
    question: 'How does Conekta verify property listings?',
    answer:
      'We perform background checks on listed ownership documents and conduct physical location inspections to prevent fraud and ensure what you see is what you get.',
  },
  {
    question: 'Can I manage my rental listings as a landlord or agent?',
    answer:
      'Yes! Landlords and property managers have access to a dedicated dashboard to list properties, manage tenant inquiries, track payments, and verify documentation.',
  },
  {
    question: 'Is my personal and financial information secure?',
    answer:
      'We implement bank-level encryption and strict access guard controls to ensure your personal data and payment operations remain completely safe.',
  },
];

// Framer Motion Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const nodeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

// DESKTOP TOP-DOWN TREE NODE CARD
function DesktopTreeNodeCard({
  node,
  onSelectMember,
}: {
  node: TeamNode;
  onSelectMember: (member: TeamNode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const reports = node.reports || [];
  const hasReports = reports.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      className="flex flex-col items-center"
    >
      <motion.div
        variants={nodeVariants}
        className="group relative z-10 w-44 sm:w-48 rounded-xl border border-gray-200/90 bg-white p-2.5 shadow-xs transition-all hover:border-primary-green hover:shadow-md"
      >
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-tertiary-green shadow-xs">
            <Image
              src={node.image}
              alt={node.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="inline-block rounded bg-tertiary-green px-1 py-0.2 text-[8px] font-bold uppercase tracking-wide text-primary-green">
              {node.department}
            </span>
            <h4 className="truncate text-[11px] font-bold text-text-primary">
              {node.name}
            </h4>
            <p className="truncate text-[10px] font-medium text-secondary-color">
              {node.role}
            </p>
          </div>
        </div>

        <p className="mt-1.5 text-[10px] leading-snug text-secondary-color line-clamp-2">
          {node.bio}
        </p>

        <div className="mt-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onSelectMember(node)}
            className="flex w-full items-center justify-center gap-1 rounded-md bg-primary-green/10 py-1 text-[10px] font-bold text-primary-green transition-colors hover:bg-primary-green hover:text-white"
          >
            <UserCheck size={11} />
            <span>Portfolio</span>
          </button>

          {hasReports && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex w-full items-center justify-center gap-1 rounded-md bg-gray-50 py-0.5 text-[9px] font-semibold text-secondary-color transition-colors hover:bg-gray-100"
            >
              <span>{isExpanded ? 'Hide Direct Reports' : 'Show Direct Reports'}</span>
              <ChevronDown
                size={10}
                className={`transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </motion.div>

      {hasReports && isExpanded && (
        <div className="flex flex-col items-center w-full">
          <div className="h-6 w-0.5 bg-primary-green" />

          <div className="relative flex justify-center w-full">
            {reports.length > 1 && (
              <div
                className="absolute top-0 h-0.5 bg-primary-green"
                style={{
                  left: `calc(${100 / reports.length / 2}%)`,
                  right: `calc(${100 / reports.length / 2}%)`,
                }}
              />
            )}

            <div className="flex justify-center items-start gap-2 sm:gap-4 w-full">
              {reports.map((child) => (
                <div key={child.id} className="flex flex-col items-center flex-1 min-w-0">
                  <div className="h-6 w-0.5 bg-primary-green" />
                  <DesktopTreeNodeCard node={child} onSelectMember={onSelectMember} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// MOBILE VERTICAL/SIDEWAYS TREE NODE CARD
function MobileTreeNodeCard({
  node,
  onSelectMember,
}: {
  node: TeamNode;
  onSelectMember: (member: TeamNode) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const reports = node.reports || [];
  const hasReports = reports.length > 0;

  return (
    <div className="relative flex flex-col w-full my-1">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-tertiary-green">
              <Image
                src={node.image}
                alt={node.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded bg-tertiary-green px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-green">
                {node.department}
              </span>
              <h4 className="truncate text-xs font-bold text-text-primary">
                {node.name}
              </h4>
              <p className="truncate text-[11px] font-medium text-secondary-color">
                {node.role}
              </p>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-secondary-color line-clamp-2 leading-relaxed">
            {node.bio}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectMember(node)}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-primary-green/10 py-1 text-xs font-bold text-primary-green hover:bg-primary-green hover:text-white"
            >
              <UserCheck size={12} />
              <span>Portfolio</span>
            </button>

            {hasReports && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-secondary-color"
              >
                <span>{hasReports ? reports.length : ''}</span>
                <FaChevronRight
                  size={12}
                  className={`transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {hasReports && isExpanded && (
        <div className="relative ml-4 pl-4 border-l-2 border-primary-green/60 mt-2 space-y-2">
          {reports.map((child) => (
            <div key={child.id} className="relative">
              <div className="absolute -left-4 top-6 h-0.5 w-4 bg-primary-green/60" />
              <MobileTreeNodeCard node={child} onSelectMember={onSelectMember} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MEMBER PORTFOLIO MODAL
function MemberPortfolioModal({
  member,
  onClose,
}: {
  member: TeamNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-2xl z-10 no-scrollbar"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-text-primary"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-gray-100">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-tertiary-green shadow-xs">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-tertiary-green px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-green">
                {member.department}
              </span>
              {member.experienceYears && (
                <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-semibold text-secondary-color">
                  {member.experienceYears}+ Yrs Exp.
                </span>
              )}
            </div>

            <h2 className="mt-1.5 text-2xl font-extrabold text-text-primary">
              {member.name}
            </h2>
            <p className="text-xs font-bold text-primary-green sm:text-sm">
              {member.role}
            </p>

            {member.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-secondary-color">
                <MapPin size={12} /> {member.location}
              </p>
            )}
          </div>
        </div>

        <div className="py-5 border-b border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary-green">
            About
          </h3>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-secondary-color">
            {member.bio}
          </p>
        </div>

        {member.skills && member.skills.length > 0 && (
          <div className="py-5 border-b border-gray-100">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-green">
              <Code2 size={15} /> Skills & Expertise
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border border-primary-green/20 bg-tertiary-green/40 px-3 py-1 text-xs font-semibold text-primary-green"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {member.achievements && member.achievements.length > 0 && (
          <div className="py-5 border-b border-gray-100">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-green">
              <Award size={15} /> Key Accomplishments
            </h3>
            <ul className="mt-3 space-y-2">
              {member.achievements.map((achievement) => (
                <li
                  key={achievement}
                  className="flex items-start gap-2 text-xs sm:text-sm text-secondary-color"
                >
                  <Sparkles
                    size={14}
                    className="mt-0.5 shrink-0 text-primary-green"
                  />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {member.projects && member.projects.length > 0 && (
          <div className="py-5 border-b border-gray-100">
            <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary-green">
              <Briefcase size={15} /> Featured Projects
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {member.projects.map((proj) => (
                <div
                  key={proj.title}
                  className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5"
                >
                  <h4 className="text-xs font-bold text-text-primary">
                    {proj.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-secondary-color leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-white border border-gray-200 px-1.5 py-0.5 text-[9px] font-semibold text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {member.socials?.github && (
              <a
                href={member.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-primary-green hover:text-white"
              >
                <FaGithub size={16} />
              </a>
            )}
            {member.socials?.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-primary-green hover:text-white"
              >
                <FaLinkedin size={16} />
              </a>
            )}
            {member.socials?.twitter && (
              <a
                href={member.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-primary-green hover:text-white"
              >
                <FaTwitter size={16} />
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-primary-green px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-secondary-green"
          >
            Close Portfolio
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutUsClient() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedMember, setSelectedMember] = useState<TeamNode | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="no-scrollbar relative min-h-screen bg-app-background font-sans text-text-primary antialiased selection:bg-tertiary-green selection:text-primary-green">
      {/* READING PROGRESS BAR */}
      <div className="fixed top-0 right-0 z-50 h-full w-2 bg-gray-100">
        <motion.div
          className="h-full w-full origin-top bg-linear-to-b from-primary-green to-secondary-green"
          style={{ scaleY }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-brom-tertiary-green/40 via-white to-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-green px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary-green">
              <Sparkles size={14} /> Reimagining Real Estate
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Connecting People to <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
                Homes, Spaces & Trust.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base text-secondary-color sm:text-lg leading-relaxed">
              Conekta bridges the gap between property seekers, landlords, and skilled maintenance professionals.
              We build technology that eliminates friction, guarantees listing authenticity, and powers end-to-end housing solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* OUR MISSION & VISION */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-gray-100 bg-tertiary-green/30 p-8 sm:p-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-green text-white mb-6 shadow-xs">
                <Target size={24} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-color">
                To simplify and sanitize real estate transactions across Africa by engineering transparent, reliable, and secure digital infrastructure that directly connects tenants, property owners, and skilled artisans.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-gray-100 bg-lister-background/50 p-8 sm:p-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-green text-white mb-6 shadow-xs">
                <Compass size={24} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-secondary-color">
                To become the premier trusted digital ecosystem where finding a home, listing verified property, and maintaining real estate is transparent, efficient, and accessible to everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE 3 PORTALS */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-green">
              Unified Ecosystem
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
              One Platform, Three Portals
            </h2>
            <p className="mt-3 text-sm text-secondary-color max-w-xl mx-auto">
              Conekta brings together all key participants in the property lifecycle through tailored portal experiences.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xs transition-all hover:border-primary-green hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tertiary-green text-primary-green mb-6">
                <Search size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-green">
                Tenant Portal
              </span>
              <h3 className="mt-1 text-xl font-bold text-text-primary">
                Search & Rent
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-secondary-color">
                Discover verified properties with interactive map integration, transparent pricing, direct scheduling for inspections, and digital lease workflows.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xs transition-all hover:border-lister-blue hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lister-blue mb-6">
                <Building2 size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-lister-blue">
                Lister Dashboard
              </span>
              <h3 className="mt-1 text-xl font-bold text-text-primary">
                List & Manage
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-secondary-color">
                Dedicated management interface for property owners and agents to publish verified listings, manage tenant applications, and process documentation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xs transition-all hover:border-artisan-orange hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-artisan-orange mb-6">
                <Wrench size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-artisan-orange">
                Artisan Network
              </span>
              <h3 className="mt-1 text-xl font-bold text-text-primary">
                Service & Repair
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-secondary-color">
                Connect directly with vetted artisans—plumbers, electricians, painters, and technicians—for on-demand property maintenance and repairs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ORGANIZATIONAL TREE SECTION */}
      <section className="py-16 sm:py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-green">
              Behind Conekta
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
              Our Leadership & Tech Team
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-secondary-color">
              Explore our organizational structure. Click on any member card to view their complete portfolio.
            </p>
          </motion.div>

          {/* DUAL TREE RENDER SWITCHER */}
          {/* Mobile Vertical Tree (< md screens) */}
          <div className="block md:hidden w-full max-w-md mx-auto">
            <MobileTreeNodeCard
              node={orgChartTree}
              onSelectMember={(member) => setSelectedMember(member)}
            />
          </div>

          {/* Desktop Top-Down Tree (>= md screens) */}
          <div className="hidden md:flex justify-center w-full py-2">
            <DesktopTreeNodeCard
              node={orgChartTree}
              onSelectMember={(member) => setSelectedMember(member)}
            />
          </div>
        </div>
      </section>

      {/* LOCATION MAP SECTION */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary-green">
                Our Office Location
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
                Come Visit Our Headquarters
              </h2>
              <p className="mt-4 text-sm text-secondary-color leading-relaxed">
                Whether you are a property partner, tenant, or service provider needing hands-on help, our team is ready to welcome you.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${OFFICE_LOCATION.lat},${OFFICE_LOCATION.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-primary-green hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary-green text-primary-green transition-colors group-hover:bg-primary-green group-hover:text-white">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text-primary">
                        Headquarters
                      </h4>
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-primary-green" />
                    </div>
                    <p className="text-xs text-secondary-color mt-0.5">
                      Victoria Island, Lagos, Nigeria
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:support@useconekta.com"
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-primary-green hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary-green text-primary-green transition-colors group-hover:bg-primary-green group-hover:text-white">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text-primary">
                        Email Us
                      </h4>
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-primary-green" />
                    </div>
                    <p className="text-xs text-secondary-color mt-0.5">
                      support@useconekta.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+2348072383942"
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs transition-all hover:border-primary-green hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary-green text-primary-green transition-colors group-hover:bg-primary-green group-hover:text-white">
                    <Phone size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-text-primary">
                        Phone Support
                      </h4>
                      <ExternalLink size={14} className="text-gray-400 group-hover:text-primary-green" />
                    </div>
                    <p className="text-xs text-secondary-color mt-0.5">
                      +234 807 238 3942
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <MapDisplay
                location={OFFICE_LOCATION}
                zoom={14}
                className="h-96 w-full shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary-green">
              Got Questions?
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-text-primary">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-text-primary transition-colors hover:bg-gray-50"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary-green' : ''
                      }`}
                    />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 p-5 text-xs sm:text-sm text-secondary-color leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFOLIO MODAL PORTAL */}
      <AnimatePresence>
        {selectedMember && (
          <MemberPortfolioModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}