'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Share2,
  Bookmark,
  ArrowLeft,
  Clock,
  Award,
  Check,
} from 'lucide-react';
import { ArtisanWithVisuals } from '@/app/components/customer/FindArtisansClient';

interface Props {
  artisan: ArtisanWithVisuals;
}

export default function DynamicArtisanProfileClient({ artisan }: Props) {
  const [activeTab, setActiveTab] = useState<'about' | 'gallery' | 'reviews'>('about');
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Native Browser Share Handler
  const handleShare = async () => {
    const shareData = {
      title: `${artisan.businessName} - ${artisan.name}`,
      text: `Check out ${artisan.businessName} on Conekta for verified ${artisan.service.toLowerCase()} services!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  // Mock extended profile data
  const profileDetails = {
    bannerImage:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600',
    aboutText: `With over 6 years of professional experience across Lagos, ${artisan.businessName} specializes in top-tier residential and commercial ${artisan.service.toLowerCase()} solutions. Known for punctuality, quality workmanship, and transparent pricing.`,
    joinedDate: 'Joined March 2023',
    responseRate: '98% Response Rate',
    responseTime: 'Replies within 30 mins',
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600',
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Adesuwa O.',
        date: '2 weeks ago',
        rating: 5,
        comment:
          'Excellent service! Fixed our water heater issue promptly and clean output. Very professional handling.',
      },
      {
        id: 'rev-2',
        author: 'Babajide K.',
        date: '1 month ago',
        rating: 5,
        comment:
          'Showed up on time, diagnosed the issue quickly, and offered fair pricing. Highly recommended!',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] pb-16 pt-6 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Back Link */}
        <motion.div whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link
            href="/artisans"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Artisans
          </Link>
        </motion.div>

        {/* Main Profile Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs relative">
          
          {/* Banner */}
          <div className="relative h-48 sm:h-64 w-full bg-gray-200">
            <Image
              src={profileDetails.bannerImage}
              alt="Profile Cover Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/15" />
          </div>

          {/* Profile Details Bar */}
          <div className="p-6 sm:p-8 pt-0 relative">
            
            {/* Overlapping Avatar & Top Right Action Buttons */}
            <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md"
              >
                <Image
                  src={artisan.image}
                  alt={artisan.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2.5 rounded-full border transition-colors ${
                    isSaved
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Save Profile"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleShare}
                  className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors relative"
                  aria-label="Share Profile"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Headline Details */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {artisan.businessName}
                  </h1>
                  {artisan.isVerified && (
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  )}
                </div>

                <p className="text-sm font-semibold text-gray-700 mt-0.5">
                  Operated by {artisan.name} •{' '}
                  <span className="text-emerald-700 font-bold uppercase text-xs">
                    {artisan.service}
                  </span>
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500 mt-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {artisan.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <strong className="text-gray-900">{artisan.rating}</strong> (
                    {artisan.reviewCount} reviews)
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {artisan.jobsCompleted} Completed Jobs
                  </span>
                </div>
              </div>

              {/* Booking CTA Box */}
              <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 flex flex-col gap-2 min-w-55">
                <p className="text-xs text-gray-500">Hourly Rate</p>
                <p className="text-xl font-extrabold text-gray-900">
                  ₦{artisan.hourlyRate.toLocaleString()}
                  <span className="text-xs font-normal text-gray-500"> / hour</span>
                </p>
                <div className="flex flex-col gap-2 mt-1">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Book Service Now
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 rounded-lg border border-gray-300 hover:bg-white text-gray-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message Artisan
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Response Metrics Pill Bar */}
            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                {profileDetails.responseTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                {profileDetails.responseRate}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {profileDetails.joinedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-2 text-xs font-bold text-gray-600 relative">
          {(['about', 'gallery', 'reviews'] as const).map((tab) => {
            const labels = {
              about: 'About & Skills',
              gallery: 'Portfolio Gallery',
              reviews: `Reviews (${artisan.reviewCount})`,
            };
            
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg transition-colors relative z-10 ${
                  isActive ? 'text-white' : 'hover:text-gray-900 text-gray-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-emerald-600 rounded-lg -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Overview */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                <h2 className="text-base font-bold text-gray-900">About</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profileDetails.aboutText}
                </p>
              </div>

              {/* Skills & Services Offered */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                <h2 className="text-base font-bold text-gray-900">
                  Skills & Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {artisan.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
            >
              <h2 className="text-base font-bold text-gray-900">
                Work & Portfolio Showcase
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileDetails.gallery.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-4/3 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`Portfolio project ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
            >
              <h2 className="text-base font-bold text-gray-900">Customer Feedback</h2>
              <div className="space-y-4">
                {profileDetails.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900">
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}