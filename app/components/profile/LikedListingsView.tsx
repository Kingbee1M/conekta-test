'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { LikedListing } from './profileTypes';

export default function LikedListingsView({ listings }: { listings: LikedListing[] }) {
  return (
    <section className="space-y-5"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-green">Shortlist</p><h2 className="mt-1 text-2xl font-bold text-gray-900">Liked listings</h2><p className="mt-1 text-sm text-gray-500">The homes you want to keep close while you decide.</p></div><div className="grid gap-4 sm:grid-cols-2">{listings.map((listing, index) => <motion.div key={listing.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.07 }} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs"><div className="relative aspect-16/10 bg-gray-100"><Image src={listing.image} alt={listing.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" /><span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm"><Heart size={17} fill="currentColor" /></span></div><div className="p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="line-clamp-1 text-sm font-bold text-gray-900">{listing.title}</h3><p className="mt-1 flex items-center gap-1 text-xs text-gray-500"><MapPin size={13} />{listing.location}</p></div><p className="whitespace-nowrap text-sm font-extrabold text-primary-green">{listing.price}</p></div><p className="mt-3 text-[11px] text-gray-400">Liked {listing.likedAt}</p><Link href={`/properties/${listing.id}`} className="mt-4 inline-flex text-xs font-bold text-primary-green hover:underline">View listing</Link></div></motion.div>)}</div></section>
  );
}