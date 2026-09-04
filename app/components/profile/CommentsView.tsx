'use client';

import { MessageCircle, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { ListingComment } from './profileTypes';

export default function CommentsView({ comments }: { comments: ListingComment[] }) {
  return (
    <section className="space-y-5">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-green">Your voice</p><h2 className="mt-1 text-2xl font-bold text-gray-900">My comments</h2><p className="mt-1 text-sm text-gray-500">Revisit the questions and thoughts you have shared on listings.</p></div>
      <div className="grid gap-4">
        {comments.map((item, index) => <motion.article key={item.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><MessageCircle size={18} /></span><div><h3 className="text-sm font-bold text-gray-900">{item.listingTitle}</h3><p className="text-xs text-gray-500">{item.date}</p></div></div><button type="button" aria-label="More comment actions" className="text-gray-400 hover:text-gray-700"><MoreHorizontal size={18} /></button></div><p className="mt-4 text-sm leading-6 text-gray-600">“{item.comment}”</p><span className="mt-4 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600">{item.status}</span></motion.article>)}
      </div>
    </section>
  );
}