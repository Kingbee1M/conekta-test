'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Building2, ChevronRight, CircleUserRound, FileCheck2, ShieldCheck } from 'lucide-react';

const checks = [
  { icon: CircleUserRound, title: 'Identity details', description: 'Information that helps establish who is listing.' },
  { icon: Building2, title: 'Property relationship', description: 'Context about the lister and the property.' },
  { icon: FileCheck2, title: 'Verification information', description: 'A place to review available verification details.' },
];

export default function ListerVerificationPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8ff] text-slate-900">
      <section className="relative bg-[#102b55] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(#8bb6ff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:px-12">
          <motion.div initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100"><ShieldCheck size={14} /> Lister verification</span>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Trust grows when identity is <span className="text-blue-300">clear.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-blue-100/80">Give property seekers clearer context about the people behind a listing through a dedicated lister verification experience.</p>
            <Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-50">Create your account <ArrowRight size={16} /></Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-white/20 bg-white p-6 text-slate-900 shadow-[0_35px_100px_-40px_rgba(0,0,0,0.55)] sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Building2 size={22} /></span><span><span className="block text-xs text-slate-500">Lister profile</span><span className="mt-0.5 block font-bold">Verification overview</span></span></div><BadgeCheck className="text-blue-600" size={22} /></div>
            <div className="mt-6 flex items-center justify-between text-xs"><span className="font-semibold text-slate-700">Areas to review</span><span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-700">Profile context</span></div>
            <div className="mt-3 flex gap-1.5">{checks.map((item) => <motion.span key={item.title} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.35, delay: 0.3 }} className="h-1.5 flex-1 origin-left rounded-full bg-blue-200" />)}</div>
            <div className="mt-6 space-y-3">{checks.map(({ icon: Icon, title, description }, index) => <motion.div key={title} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.12 }} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><Icon size={17} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{title}</span><span className="mt-0.5 block text-[10px] leading-4 text-slate-500">{description}</span></span><ChevronRight size={16} className="text-slate-400" /></motion.div>)}</div>
            <div className="mt-5 flex items-center gap-2 text-[10px] text-slate-400"><ShieldCheck size={14} /> Verification information may vary by profile.</div>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">A more accountable marketplace</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Clear profiles make better introductions.</h2></div><ChevronRight className="hidden text-blue-300 sm:block" size={42} /></div><div className="mt-8 grid gap-4 md:grid-cols-3">{['Show the person behind the listing', 'Share property context clearly', 'Help start informed conversations'].map((item, index) => <motion.div key={item} whileHover={{ y: -5 }} className="rounded-2xl border border-blue-100 bg-white p-6"><span className="text-xs font-extrabold text-blue-600">0{index + 1}</span><p className="mt-4 font-bold">{item}</p><p className="mt-2 text-sm leading-6 text-slate-500">Verification adds useful context as people connect around property.</p></motion.div>)}</div></section>
    </main>
  );
}
