'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeAlert, Eye, FileSearch, MapPin, Shield, ShieldCheck } from 'lucide-react';

const signals = [
  { title: 'Listing details', text: 'Review the information presented about a property.', icon: FileSearch },
  { title: 'Lister context', text: 'Understand the profile associated with the listing.', icon: Eye },
  { title: 'Questions to confirm', text: 'Use available details to guide your next conversation.', icon: MapPin },
];

export default function PropertyFraudPreventionPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080f1d] text-white">
      <section className="relative isolate min-h-[720px] overflow-hidden pb-20 pt-32 sm:pt-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_18%_20%,rgba(16,185,129,0.2),transparent_42%),radial-gradient(ellipse_at_85%_85%,rgba(59,130,246,0.17),transparent_38%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300"><Shield size={14} /> Property Fraud Prevention</span>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl">Make property decisions with <span className="text-emerald-300">more context.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">Verification information and listing context can help you spot questions worth asking as you explore a property. Conekta helps keep those details easier to review.</p>
            <Link href="/products/property-listing-verification" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-400 px-6 py-3 text-sm font-bold text-[#07130f] transition hover:bg-emerald-300">Explore listing verification <ArrowRight size={16} /></Link>
            <p className="mt-5 max-w-md text-xs leading-5 text-slate-500">Verification steps support informed decisions; always confirm details that matter to you.</p>
          </motion.div>

          <div className="relative mx-auto grid aspect-square w-full max-w-[470px] place-items-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 42, repeat: Infinity, ease: 'linear' }} className="absolute inset-[7%] rounded-full border border-dashed border-emerald-300/30" />
            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.9, 0.5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute inset-[19%] rounded-full border border-emerald-300/20 bg-emerald-400/[0.025]" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute inset-[31%] rounded-full border border-blue-300/25" />
            <div className="relative z-10 w-[58%] rounded-[2rem] border border-white/10 bg-[#111c2b]/95 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4"><span className="text-xs font-bold text-slate-200">Property review</span><BadgeAlert size={17} className="text-amber-300" /></div>
              <div className="mt-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-300"><ShieldCheck size={19} /></span><span><span className="block text-[10px] text-slate-400">Verification context</span><span className="mt-1 block text-xs font-semibold text-white">Review available details</span></span></div>
              <div className="mt-5 space-y-2.5">{['Listing information', 'Lister profile', 'Follow-up questions'].map((item, index) => <motion.div key={item} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + index * 0.2 }} className="flex items-center gap-2 rounded-lg bg-white/[0.045] px-2.5 py-2 text-[9px] text-slate-300"><ArrowRight size={12} className="text-emerald-300" /> {item}</motion.div>)}</div>
            </div>
            <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute right-2 top-[18%] grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#132438] text-emerald-300 shadow-xl"><ShieldCheck size={20} /></motion.span>
            <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-[13%] left-[5%] grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-[#132438] text-blue-300 shadow-xl"><FileSearch size={18} /></motion.span>
          </div>
        </div>
      </section>
      <section className="border-t border-white/10 bg-white/[0.025] py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">A thoughtful review</p><div className="mt-7 grid gap-4 md:grid-cols-3">{signals.map(({ title, text, icon: Icon }, index) => <motion.article key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"><Icon size={21} className="text-emerald-300" /><h2 className="mt-5 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></motion.article>)}</div></div></section>
    </main>
  );
}
