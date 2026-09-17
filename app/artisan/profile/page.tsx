'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Camera,
  Edit3,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Plus,
  Briefcase,
  Award,
  Globe,
  ExternalLink,
  Pencil,
  CalendarDays,
  Users,
  Building2,
  Phone,
  Mail,
  Languages,
  MapPinned,
  Wrench,
  TrendingUp,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import MapDisplay, { LocationCoordinates } from '@/app/components/googleMap/MapDisplay';
import { BsLinkedin } from 'react-icons/bs';

const workshopLocation: LocationCoordinates = { lat: 6.4281, lng: 3.4219 };

const businessTimeline = [
  { year: '2016', title: 'Apex Pipeworks launched', detail: 'Started with residential plumbing call-outs across Lagos.' },
  { year: '2019', title: 'Added drainage services', detail: 'Expanded into commercial drainage and water system maintenance.' },
  { year: '2023', title: 'Joined Conekta', detail: 'Began serving verified customers and building a trusted public profile.' },
  { year: 'Today', title: 'Growing the team', detail: '180 completed jobs and a growing crew of skilled technicians.' },
];

const teamMembers = [
  { name: 'Chinedu Okonkwo', role: 'Founder & Lead Plumber', initials: 'CO', accent: 'bg-primary-green' },
  { name: 'Ifeoma Nwosu', role: 'Operations Coordinator', initials: 'IN', accent: 'bg-secondary-green' },
  { name: 'Emeka Obi', role: 'Senior Technician', initials: 'EO', accent: 'bg-amber-500' },
  { name: 'Tunde Adebayo', role: 'Apprentice Technician', initials: 'TA', accent: 'bg-slate-500' },
];

export default function ArtisanProfilePage() {
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [showVerifyBanner, setShowVerifyBanner] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const profileData = {
    title: 'Apex Pipeworks & Drainage',
    shareUrl: 'https://conekta-test.vercel.app/artisans/apex-pipeworks-drainage',
    phone: '+2348012345678',
    email: 'contact@apexpipeworks.com',
    linkedin: 'https://linkedin.com/company/apexpipeworks',
  };

  const getShareableUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }

    return profileData.shareUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileData.shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async () => {
    console.log("starting share")
    const shareData = {
      title: profileData.title,
      text: `Check out ${profileData.title} on Conekta`,
      url: getShareableUrl(),
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-300 relative">
      {/* MAIN CONTENT AREA */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* HERO CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Banner Container */}
          <div className="h-48 sm:h-60 bg-linear-to-r from-slate-800 to-slate-900 relative group/banner">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600"
              alt="Cover Banner"
              fill
              className="object-cover opacity-80 transition-transform duration-700 ease-out group-hover/banner:scale-105"
              priority
            />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                title="Edit Banner Image"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Header Details */}
          <div className="px-6 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              {/* Avatar Container */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 group">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                  alt="Chinedu Okonkwo"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  type="button"
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs cursor-pointer"
                  title="Update Profile Photo"
                >
                  <Camera className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50 text-text-primary text-xs font-bold transition-all duration-200 hover:shadow-xs active:scale-95 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all duration-200 hover:shadow-md active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>
            </div>

            {/* Title & Stats */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  Apex Pipeworks & Drainage
                </h1>
                <ShieldCheck className="w-6 h-6 text-primary-green shrink-0" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Operated by Chinedu Okonkwo • <span className="text-primary-green font-extrabold uppercase">Plumber</span>
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1 transition-colors hover:text-text-primary">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Victoria Island, Lagos
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  4.9 (142 reviews)
                </span>
                <span className="flex items-center gap-1 transition-colors hover:text-text-primary">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  180 Completed Jobs
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary-green" />
                  Replies within 30 mins
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-green" />
                  98% Response Rate
                </span>
                <span>Joined March 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFICATION PROMPT BANNER */}
        {showVerifyBanner && (
          <div className="bg-tertiary-green/70 border border-primary-green/20 rounded-2xl p-5 flex items-start justify-between gap-4 relative transition-all duration-300 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-primary-green text-white shrink-0 mt-0.5 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-text-primary">Verify your business credentials</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                  Verified artisans receive up to 3x more service bookings and higher visibility on customer search results.
                </p>
                <button
                  type="button"
                  className="mt-3 px-3.5 py-1.5 rounded-full bg-primary-green text-white text-xs font-bold hover:bg-primary-green-hover transition-all duration-200 hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  Verify Now
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVerifyBanner(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-black/5 transition-colors duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TABBED NAVIGATION & DETAILS CONTENT */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-300">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
            {[
              { id: 'about', label: 'About & Skills' },
              { id: 'portfolio', label: 'Portfolio Gallery' },
              { id: 'reviews', label: 'Reviews (142)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary-green text-white shadow-xs scale-[1.01]'
                    : 'text-slate-500 hover:text-text-primary hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'about' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-extrabold text-text-primary">About Business</h3>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    With over 8 years of industrial and residential plumbing experience, Apex Pipeworks specializes in emergency leaks, high-pressure drainage clearing, bathroom fittings, and solar water heater installation across Lagos.
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-extrabold text-text-primary">Skills & Specializations</h3>
                    <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Pipe Fitting',
                      'Drainage Unblocking',
                      'Water Heater Repair',
                      'Bathroom Installation',
                      'Leak Detection',
                      'Borehole Systems'
                    ].map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-tertiary-green text-primary-green text-xs font-extrabold transition-all duration-200 hover:bg-primary-green hover:text-white cursor-default hover:scale-105"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-text-primary">Business journey</h3>
                      <p className="text-xs text-slate-500 mt-1">A quick look at how the team has grown.</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-primary-green" />
                  </div>
                  <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-1 before:bottom-1 before:w-px before:bg-tertiary-green">
                    {businessTimeline.map((event, index) => (
                      <div key={event.year} className="relative group/timeline transition-all duration-200">
                        <span className={`absolute -left-6 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white transition-transform duration-200 group-hover/timeline:scale-125 ${index === businessTimeline.length - 1 ? 'bg-primary-green' : 'bg-primary-fixed-dim'}`} />
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-xs font-black text-primary-green">{event.year}</span>
                          <h4 className="text-sm font-bold text-text-primary">{event.title}</h4>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{event.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-text-primary">Team & roles</h3>
                      <p className="text-xs text-slate-500 mt-1">The people behind every completed job.</p>
                    </div>
                    <Users className="w-5 h-5 text-primary-green" />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3 rounded-2xl border border-primary-green/20 bg-tertiary-green/60 px-4 py-3 w-full sm:w-auto transition-transform duration-200 hover:scale-[1.02]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-green text-xs font-black text-white shadow-xs">{teamMembers[0].initials}</span>
                      <div><p className="text-sm font-extrabold text-text-primary">{teamMembers[0].name}</p><p className="text-xs text-primary-green font-semibold">{teamMembers[0].role}</p></div>
                    </div>
                    <div className="h-5 w-px bg-slate-200" />
                    <div className="h-px w-4/5 bg-slate-200" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-3">
                      {teamMembers.slice(1).map((member) => (
                        <div key={member.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center transition-all duration-200 hover:shadow-xs hover:border-slate-200 hover:-translate-y-0.5">
                          <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${member.accent} text-[10px] font-black text-white shadow-xs`}>{member.initials}</span>
                          <p className="mt-2 text-xs font-extrabold text-text-primary">{member.name}</p>
                          <p className="mt-1 text-[10px] leading-snug text-slate-500">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in fade-in duration-300">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="aspect-square bg-slate-100 rounded-2xl relative overflow-hidden group/item cursor-pointer">
                    <Image
                      src={`https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400&auto=format&fit=crop`}
                      alt="Portfolio item"
                      fill
                      className="object-cover group-hover/item:scale-110 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-xs text-white font-bold px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-xs">View Project</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {[1, 2].map((review) => (
                  <div key={review} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 transition-all duration-200 hover:border-slate-200 hover:shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary">Babajide A.</span>
                      <span className="text-[10px] font-semibold text-slate-400">2 days ago</span>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Excellent work! Fixed the leaking pipe under 40 minutes and left the place clean.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIDEBAR METRICS & PRICING */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Hourly Rate & Quick Edit Box */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Pricing Rate</span>
            <button type="button" className="text-xs text-primary-green font-bold hover:underline transition-all cursor-pointer">
              Change
            </button>
          </div>
          <div>
            <span className="text-3xl font-black text-text-primary">₦7,000</span>
            <span className="text-xs text-slate-400 font-bold"> / hour</span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Standard hourly rate displayed to prospective customers during service bookings.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-text-primary">Business details</h3>
              <p className="text-xs text-slate-500 mt-1">The essentials customers look for first.</p>
            </div>
            <Building2 className="w-5 h-5 text-primary-green" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100/80"><CalendarDays className="w-4 h-4 text-primary-green" /><p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400 font-bold">Created</p><p className="text-xs font-bold text-text-primary">March 12, 2016</p></div>
            <div className="rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100/80"><Users className="w-4 h-4 text-primary-green" /><p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400 font-bold">Team size</p><p className="text-xs font-bold text-text-primary">4 employees</p></div>
            <div className="rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100/80"><Wrench className="w-4 h-4 text-primary-green" /><p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400 font-bold">Experience</p><p className="text-xs font-bold text-text-primary">8+ years</p></div>
            <div className="rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100/80"><Languages className="w-4 h-4 text-primary-green" /><p className="mt-2 text-[10px] uppercase tracking-wide text-slate-400 font-bold">Languages</p><p className="text-xs font-bold text-text-primary">English, Igbo</p></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-extrabold text-text-primary">Workshop location</h3><p className="text-xs text-slate-500 mt-1">Available across Victoria Island and nearby areas.</p></div>
            <MapPinned className="w-5 h-5 text-primary-green" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-100">
            <MapDisplay location={workshopLocation} zoom={13} className="w-full h-48" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600"><MapPin className="w-3.5 h-3.5 text-primary-green" /> Victoria Island, Lagos</div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs transition-all duration-300 hover:shadow-md">
          <h3 className="text-sm font-extrabold text-text-primary">Contact preferences</h3>
          <div className="mt-4 space-y-3 text-xs text-slate-600">
            <a
              href={`tel:${profileData.phone}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-primary-green transition-all duration-200 group/item"
            >
              <Phone className="w-4 h-4 text-primary-green transition-transform duration-200 group-hover/item:scale-110" />
              <span className="font-semibold">Phone and WhatsApp</span>
              <CheckCircle2 className="ml-auto w-4 h-4 text-primary-green" />
            </a>

            <a
              href={`mailto:${profileData.email}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-primary-green transition-all duration-200 group/item"
            >
              <Mail className="w-4 h-4 text-primary-green transition-transform duration-200 group-hover/item:scale-110" />
              <span className="font-semibold">Email</span>
              <CheckCircle2 className="ml-auto w-4 h-4 text-primary-green" />
            </a>

            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-primary-green transition-all duration-200 group/item"
            >
              <BsLinkedin className="w-4 h-4 text-primary-green transition-transform duration-200 group-hover/item:scale-110" />
              <span className="font-semibold">LinkedIn Profile</span>
              <CheckCircle2 className="ml-auto w-4 h-4 text-primary-green" />
            </a>

            <div className="flex items-center gap-3 p-2 text-slate-600">
              <Clock className="w-4 h-4 text-primary-green" />
              <span className="font-medium">Mon - Sat, 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>

        {/* Public Profile Settings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4 transition-all duration-300 hover:shadow-md">
          <h3 className="text-sm font-extrabold text-text-primary">Public Profile & URL</h3>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span className="truncate font-mono">{profileData.shareUrl}</span>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-1 hover:text-primary-green transition-colors cursor-pointer"
              title="Share profile link"
            >
              <Globe className="w-4 h-4 text-slate-400 hover:text-primary-green shrink-0 ml-2 transition-colors" />
            </button>
          </div>
          <a
            href={profileData.shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green hover:underline group/link"
          >
            <span>View as public customer</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* SHARE PROFILE MODAL */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-tertiary-green text-primary-green">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-text-primary">Share Profile</h3>
                  <p className="text-xs text-slate-500">Promote your artisan business</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Share this direct link with clients or on social media so potential customers can view your services, reviews, and portfolio directly.
              </p>

              {/* URL Input with Copy Button */}
              <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <input
                  type="text"
                  readOnly
                  value={profileData.shareUrl}
                  className="w-full bg-transparent px-3 text-xs font-mono text-slate-700 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isCopied
                      ? 'bg-primary-green text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-xs'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-3 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all duration-200 hover:shadow-md active:scale-[0.98] cursor-pointer"
                >
                  Share via device options...
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all duration-200 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}