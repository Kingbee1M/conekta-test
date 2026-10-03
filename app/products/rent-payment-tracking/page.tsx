'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, CircleDollarSign, CreditCard, ReceiptText, Wallet } from 'lucide-react';

const activities = [
  { icon: CalendarDays, title: 'Rent schedule', detail: 'Tenancy payment details', status: 'Upcoming', tone: 'text-blue-700 bg-blue-50' },
  { icon: CreditCard, title: 'Payment activity', detail: 'Records connected to the tenancy', status: 'View record', tone: 'text-emerald-700 bg-emerald-50' },
  { icon: ReceiptText, title: 'Payment history', detail: 'A clearer record to refer back to', status: 'Available', tone: 'text-violet-700 bg-violet-50' },
];

export default function RentPaymentTrackingPage() {
  return (
    <main className="min-h-screen bg-[#f4f7ff] text-slate-900">
      <section className="overflow-hidden bg-[#111c3b] pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><span className="inline-flex items-center gap-2 rounded-full border border-blue-200/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-200"><CircleDollarSign size={14} /> Rent & payment tracking</span><h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Know where your rent stands.</h1><p className="mt-6 max-w-xl text-base leading-7 text-blue-100/75">Keep rent schedules and payment activity connected to the tenancy, so the information is easier to review when you need it.</p><Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-300 px-6 py-3.5 text-sm font-bold text-blue-950 transition hover:bg-blue-200">Explore payment tracking <ArrowRight size={16} /></Link></motion.div>

          <motion.div initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-900 shadow-[0_35px_100px_-40px_rgba(0,0,0,0.55)] sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-xs text-slate-500">Payment overview</p><h2 className="mt-1 text-lg font-bold">Your rent activity</h2></div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Wallet size={21} /></span></div>
            <div className="mt-6 rounded-2xl bg-[#f5f7fc] p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Activity over time</span><span className="text-[10px] text-slate-400">Illustrative view</span></div><div className="mt-5 flex h-28 items-end gap-3 border-b border-slate-200 px-2">{[46, 66, 53, 82, 62, 94, 72, 100, 75, 89, 60, 82].map((height, index) => <motion.span key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.7, delay: 0.15 + index * 0.045, ease: 'easeOut' }} className={`flex-1 rounded-t-md ${index > 8 ? 'bg-blue-300' : 'bg-blue-600'}`} />)}</div><div className="mt-2 flex justify-between text-[9px] text-slate-400"><span>Earlier</span><span>Recent</span></div></div>
            <div className="mt-5 space-y-2">{activities.map(({ icon: Icon, title, detail, status, tone }, index) => <motion.div key={title} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.12 }} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"><span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={16} /></span><span className="min-w-0 flex-1"><span className="block text-xs font-bold">{title}</span><span className="mt-0.5 block truncate text-[10px] text-slate-500">{detail}</span></span><span className="flex items-center gap-1 text-[9px] font-semibold text-slate-500">{status}<ArrowUpRight size={12} /></span></motion.div>)}</div>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400"><Check size={13} className="text-emerald-600" /> Payment records stay associated with tenancy context.</div>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-12">{[{ n: '01', title: 'See the schedule', text: 'Review rent details connected with your tenancy.' }, { n: '02', title: 'Follow activity', text: 'Keep payment updates together in one view.' }, { n: '03', title: 'Refer to records', text: 'Find the information again when it is useful.' }].map((item, index) => <motion.article key={item.n} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 15 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="rounded-3xl bg-white p-6 shadow-sm shadow-blue-950/5"><span className="font-mono text-xs font-bold text-blue-700">{item.n}</span><h2 className="mt-4 font-bold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p></motion.article>)}</section>
    </main>
  );
}
