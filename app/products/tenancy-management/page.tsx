'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Check, ClipboardList, KeyRound, MessageCircle, Wrench } from 'lucide-react';

const timeline = [
  { date: '01', title: 'Move-in details', description: 'Keep the essential tenancy information together.', icon: KeyRound, done: true },
  { date: '02', title: 'Stay in touch', description: 'Keep property conversations connected to the tenancy.', icon: MessageCircle, done: true },
  { date: '03', title: 'Handle requests', description: 'Keep track of maintenance needs and follow-ups.', icon: Wrench, done: false },
];

export default function TenancyManagementPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f1] text-slate-900">
      <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
        <div className="absolute inset-x-0 top-0 h-[620px] bg-[linear-gradient(150deg,#e5f0de_0%,#f4f7f1_58%,#f4f7f1_100%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-emerald-800 shadow-sm"><ClipboardList size={14} /> Tenancy management</span><h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">One tenancy. A lot to keep track of.</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">Bring important tenancy details, messages, and requests into a clearer place for tenants and listers.</p><Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#183f2c] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5">Explore tenancy tools <ArrowRight size={16} /></Link></div>

          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-white bg-white p-5 shadow-[0_30px_80px_-36px_rgba(31,65,43,0.25)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">Tenancy overview</p><h2 className="mt-1 text-lg font-bold">Keep the moving parts connected</h2></div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-800"><CalendarDays size={13} /> Property activity</span></div>
            <div className="relative mt-8 grid gap-4 md:grid-cols-3">{timeline.map(({ date, title, description, icon: Icon, done }, index) => <motion.article key={title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.16 }} className="relative rounded-2xl bg-[#f8faf7] p-5"><div className="flex items-center justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}><Icon size={18} /></span><span className="font-mono text-xs font-bold text-slate-400">{date}</span></div><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{description}</p><div className={`mt-5 inline-flex items-center gap-1 text-[10px] font-bold ${done ? 'text-emerald-700' : 'text-amber-700'}`}>{done ? <><Check size={12} /> In the loop</> : 'Ready for follow-up'}</div></motion.article>)}</div>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 sm:px-8 md:grid-cols-[0.7fr_1.3fr] lg:px-12"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">Fewer loose ends</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">Keep the tenancy journey in view.</h2><p className="mt-4 text-sm leading-6 text-slate-600">Use a connected view to make property information, conversations, and next steps easier to follow.</p></div><div className="grid gap-3 sm:grid-cols-2">{['Property and tenancy details', 'Conversations in context', 'Maintenance follow-ups', 'Payment information'].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-900/10 bg-white p-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-800"><Check size={15} /></span><span className="text-sm font-semibold">{item}</span></div>)}</div></section>
    </main>
  );
}
