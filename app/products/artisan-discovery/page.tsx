'use client';

import Image from 'next/image';
import img from '@/public/webp/artisan.webp'
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Hammer, Paintbrush, PlugZap, Search, Star, Wrench } from 'lucide-react';

const services = [
  { label: 'Plumbing', icon: Wrench, color: 'bg-sky-100 text-sky-700' },
  { label: 'Electrical', icon: PlugZap, color: 'bg-amber-100 text-amber-700' },
  { label: 'Carpentry', icon: Hammer, color: 'bg-orange-100 text-orange-700' },
  { label: 'Painting', icon: Paintbrush, color: 'bg-rose-100 text-rose-700' },
];

export default function ArtisanDiscoveryPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-900">
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="absolute -right-28 top-12 h-[520px] w-[520px] rounded-full bg-orange-200/45 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
            <span className="rounded-full bg-orange-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-orange-800">Local services, connected</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl">Good work starts with finding the <span className="text-orange-700">right hands.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">Discover artisans for repairs, improvements, and property care. Explore the skills they offer and connect around the work you need done.</p>
            <Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-900/15 transition hover:-translate-y-0.5 hover:bg-orange-800">Find an artisan <ArrowRight size={16} /></Link>
            <div className="mt-10 grid grid-cols-2 gap-3">{services.map(({ label, icon: Icon, color }, index) => <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + index * 0.1 }} className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/80 p-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}><Icon size={17} /></span><span className="text-xs font-semibold">{label}</span></motion.div>)}</div>
          </motion.div>

          <div className="relative mx-auto w-full max-w-[580px]">
            <motion.div initial={{ opacity: 0, scale: 0.94, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.65 }} className="relative h-[440px] overflow-hidden rounded-[2.5rem] shadow-[0_35px_90px_-35px_rgba(124,45,18,0.35)] sm:h-[560px]">
              <Image src={img} alt="Artisan at work" fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29180f]/75 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 text-white"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-200">Skilled hands. Meaningful work.</p><p className="mt-2 max-w-sm text-2xl font-bold leading-tight sm:text-3xl">Find the people who help a property feel like home.</p></div>
            </motion.div>
            <motion.div animate={{ y: [0, -8, 0], rotate: [0, -1, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-5 top-8 rounded-2xl border border-orange-100 bg-white p-4 shadow-xl sm:-left-10"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-100 text-orange-700"><Search size={17} /></span><span className="text-xs font-bold">Search by skill</span></div><div className="mt-3 flex gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="fill-amber-400 text-amber-400" /><Star size={12} className="text-amber-400" /><span className="ml-1 text-[10px] text-slate-500">Explore artisan profiles</span></div></motion.div>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 4.2, repeat: Infinity }} className="absolute -bottom-5 right-4 flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:-right-7"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Wrench size={18} /></span><span><span className="block text-xs font-bold">A service for every space</span><span className="mt-1 block text-[10px] text-slate-500">Browse skills and connect</span></span><ArrowUpRight size={16} className="text-slate-400" /></motion.div>
          </div>
        </div>
      </section>
      <section className="border-y border-orange-100 bg-white py-12"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-5 px-5 sm:px-8 lg:justify-between lg:px-12"><span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Property services</span>{services.map(({ label, icon: Icon }) => <span key={label} className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Icon size={17} className="text-orange-700" /> {label}</span>)}</div></section>
    </main>
  );
}
