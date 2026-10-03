'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Home, Network, ShieldCheck, Sparkles, Wrench } from 'lucide-react';

const orbitNodes = [
  { title: 'Property seekers', detail: 'Discover a place', icon: Home, className: 'left-0 top-[17%]', color: 'text-emerald-700 bg-emerald-100' },
  { title: 'Listers', detail: 'Share property', icon: Building2, className: 'right-0 top-[17%]', color: 'text-blue-700 bg-blue-100' },
  { title: 'Tenancies', detail: 'Manage the journey', icon: ShieldCheck, className: 'bottom-0 left-[7%]', color: 'text-violet-700 bg-violet-100' },
  { title: 'Artisans', detail: 'Care for the home', icon: Wrench, className: 'bottom-0 right-[7%]', color: 'text-orange-700 bg-orange-100' },
];

export default function RealEstateEcosystemPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <section className="relative overflow-hidden bg-[#0c1428] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(44,91,173,0.24),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-blue-200"><Network size={14} /> The connected real estate ecosystem</span><h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl">Every part of the property journey, <span className="text-blue-300">connected.</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300">Conekta brings property seekers, listers, tenancy workflows, payments, and artisans into one connected experience.</p><Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50">Join the ecosystem <ArrowRight size={16} /></Link></div>

          <div className="relative mx-auto mt-16 h-[440px] max-w-4xl sm:h-[530px]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 530" fill="none" aria-hidden="true">
              <motion.path d="M170 130 C270 155 300 205 400 265" stroke="#34d399" strokeWidth="2" strokeDasharray="7 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.25 }} />
              <motion.path d="M630 130 C530 155 500 205 400 265" stroke="#60a5fa" strokeWidth="2" strokeDasharray="7 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.4 }} />
              <motion.path d="M210 430 C285 365 320 320 400 265" stroke="#a78bfa" strokeWidth="2" strokeDasharray="7 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.55 }} />
              <motion.path d="M590 430 C515 365 480 320 400 265" stroke="#fb923c" strokeWidth="2" strokeDasharray="7 8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.7 }} />
            </svg>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 75, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-blue-200/20 sm:h-[390px] sm:w-[390px]" />
            <motion.div animate={{ scale: [1, 1.035, 1] }} transition={{ duration: 5, repeat: Infinity }} className="absolute left-1/2 top-1/2 grid h-32 w-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-blue-200/20 bg-[#16284b] shadow-[0_0_80px_rgba(59,130,246,0.24)] sm:h-40 sm:w-40"><span className="grid h-16 w-16 place-items-center rounded-[1.4rem] bg-white text-blue-800 sm:h-20 sm:w-20"><Network size={34} /></span><span className="absolute -bottom-7 text-xs font-bold tracking-wide text-white">CONEKTA</span></motion.div>
            {orbitNodes.map(({ title, detail, icon: Icon, className, color }, index) => <motion.div key={title} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, y: [0, index % 2 ? 5 : -5, 0] }} transition={{ opacity: { delay: 0.4 + index * 0.13 }, scale: { delay: 0.4 + index * 0.13 }, y: { duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut' } }} className={`absolute ${className} flex w-36 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-[#15213a]/95 p-3 text-center shadow-2xl backdrop-blur sm:w-48 sm:p-4`}><span className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={19} /></span><span className="text-xs font-bold text-white sm:text-sm">{title}</span><span className="text-[9px] text-slate-400 sm:text-[10px]">{detail}</span></motion.div>)}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12"><div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">More than a directory</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">A joined-up experience from search to upkeep.</h2></div><div><p className="text-sm leading-7 text-slate-600">Property decisions are connected. Finding a home can lead to a tenancy, payment activity, and ongoing maintenance. Conekta brings the people and workflows involved into the same broader platform.</p><div className="mt-6 flex flex-wrap gap-2">{['Discover', 'Verify', 'Manage', 'Maintain'].map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold"><Sparkles size={13} className="text-blue-700" />{item}</span>)}</div></div></div></section>
    </main>
  );
}
