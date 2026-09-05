'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, ShieldCheck, MapPin, Briefcase, Filter } from 'lucide-react';
import { Artisan } from '@/shared/service/artisan services/types';
import { INITIAL_ARTISANS, CATEGORIES } from '@/app/(customer)/artisans/data';

export interface ArtisanWithVisuals extends Artisan {
  businessName: string;
  slug: string;
  aspectRatio: string;
  image: string;
}

export default function FindArtisansClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience'>('rating');

  const filteredArtisans = useMemo(() => {
    return INITIAL_ARTISANS.filter((artisan) => {
      const matchesCategory =
        selectedCategory === 'ALL' || artisan.service === selectedCategory;
      const matchesSearch =
        artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisan.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisan.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        artisan.location.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.jobsCompleted - a.jobsCompleted;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-[#F7F8F9] py-8 px-4 sm:px-6 lg:px-12 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Explore Artisan Services
            </h1>
            <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
              Discover verified professionals curated by domain and expertise
            </p>
          </div>

          {/* Search Bar Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by business, skill, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* Category Pills & Sorting Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 self-end sm:self-auto">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience')}
              className="bg-transparent font-semibold text-gray-900 focus:outline-none cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Clean Grid Layout */}
        {filteredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtisans.map((artisan) => (
              <Link
                key={artisan.id}
                href={`/artisans/${artisan.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* Media Header */}
                <div className="relative w-full aspect-4/3 overflow-hidden bg-gray-100">
                  <Image
                    src={artisan.image}
                    alt={artisan.businessName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {artisan.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-emerald-700 shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : <span />}

                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-white">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {artisan.rating} ({artisan.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700">
                      {artisan.service}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {artisan.businessName}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      Operated by {artisan.name}
                    </p>
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-1 border-t border-gray-100">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{artisan.location}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      {artisan.jobsCompleted} jobs
                    </span>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 min-h-6.5">
                    {artisan.skills.slice(0, 2).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 text-[10px] text-emerald-800 font-medium border border-emerald-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer Rate & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div>
                      <p className="text-xs text-gray-400">Rate</p>
                      <p className="text-sm font-extrabold text-gray-900">
                        ₦{artisan.hourlyRate.toLocaleString()}
                        <span className="text-[10px] text-gray-400 font-normal">/hr</span>
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs">
                      View Profile
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-3xl bg-white text-center">
            <p className="text-base font-semibold text-gray-700">No artisans found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              We couldn&apos;t find any artisans matching your search. Try adjusting your parameters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}