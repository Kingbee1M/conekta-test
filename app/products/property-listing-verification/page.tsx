'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import img1 from '@/public/webp/landingimage.webp'
import img2 from '@/public/webp/investor.webp'
import { ArrowRight, BadgeCheck, BedDouble, MapPin, Search, SlidersHorizontal, Square, Heart } from 'lucide-react';

const listings = [
  { image: img1, name: 'A home that fits your next chapter', place: 'Lagos, Nigeria', detail: 'Listing details available', color: 'bg-emerald-50 text-emerald-700' },
  { image: img2, name: 'Room to settle in and grow', place: 'Explore your area', detail: 'Review property information', color: 'bg-blue-50 text-blue-700' },
];

export default function PropertyListingVerificationPage() {
  return (
    <main className="min-h-screen bg-[#f8faf8] text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#e8f8ef] via-[#f8faf8] to-white pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-12">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Property discovery</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">A better search starts with <span className="text-emerald-700">better details.</span></h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">Explore property listings with the information and verification context you need to make a more informed next move.</p>
            <Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800">Start exploring <ArrowRight size={17} /></Link>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold text-slate-500"><span>Listing information</span><span>Verification context</span><span>Direct conversations</span></div>
          </motion.div>

          <div className="relative">
            <motion.div initial={{ opacity: 0, x: 32, rotate: 1.5 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 0.65, delay: 0.12 }} className="rounded-[2rem] border border-white bg-white p-3 shadow-[0_35px_100px_-40px_rgba(15,70,44,0.32)] sm:p-5">
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <Search className="text-emerald-700" size={18} /><span className="flex-1 text-xs text-slate-400">Where would you like to live?</span><SlidersHorizontal className="text-slate-500" size={17} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {listings.map((listing, index) => (
                  <motion.article key={listing.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 + index * 0.14 }} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                    <div className="relative h-44 overflow-hidden sm:h-52"><Image src={listing.image} alt="Example home listing" fill sizes="(max-width: 640px) 90vw, 35vw" className="object-cover transition duration-700 hover:scale-105" /><span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-800"><BadgeCheck size={13} /> Verification details</span><button aria-label="Save example listing" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-slate-600"><Heart size={15} /></button></div>
                    <div className="p-4"><p className="font-bold text-slate-900">{listing.name}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><MapPin size={13} /> {listing.place}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] text-slate-500"><span className="flex items-center gap-1"><BedDouble size={13} /> Property details</span><span className={`rounded-full px-2 py-1 font-semibold ${listing.color}`}>{listing.detail}</span></div></div>
                  </motion.article>
                ))}
              </div>
              <p className="px-1 pt-3 text-[10px] text-slate-400">Illustrative listing preview</p>
            </motion.div>
            <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-7 -left-6 hidden rounded-2xl border border-white bg-white/95 p-4 shadow-xl sm:block"><div className="flex items-center gap-2 text-xs font-bold text-slate-800"><BadgeCheck size={17} className="text-emerald-700" /> Clearer listing context</div><p className="mt-1 text-[10px] text-slate-500">Review the details that matter to you.</p></motion.div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-12">{[{ icon: BadgeCheck, title: 'Review the details', text: 'See the information shared with each property listing.' }, { icon: MapPin, title: 'Compare your options', text: 'Keep relevant property context close while you explore.' }, { icon: Square, title: 'Choose your next step', text: 'Move from browsing to a more informed conversation.' }].map(({ icon: Icon, title, text }, index) => <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="border-t-2 border-emerald-600 pt-5"><Icon size={20} className="text-emerald-700" /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></motion.div>)}</section>
    </main>
  );
}
