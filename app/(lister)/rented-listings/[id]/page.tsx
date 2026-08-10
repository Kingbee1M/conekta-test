'use client';

import AttentionFolderCard from '@/app/components/lister/AttentionFolderCard';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CustomSelect from '@/app/components/ui/CustomSelect';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import RentListingDetailsBanner from '@/app/components/lister/RentListingDetailsBanner';
import {
  ArrowLeft,
  Home,
  Users,
  MessageSquare,
  Wrench,
  CheckSquare,
  Calendar,
  FileText,
  FileCheck,
  RotateCw,
  Download,
  Phone,
  Plus,
  Send,
  Snowflake,
  Droplets,
  Zap,
  Palette,
  Sparkles,
  Hammer,
} from 'lucide-react';
import { RENTED_LISTINGS_DETAILS } from '../page';

type TabType = 'overview' | 'tenants' | 'messages' | 'artisan' | 'todo';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'tenants', label: 'Tenants', icon: Users },
  { id: 'messages', label: 'Message Boards', icon: MessageSquare },
  { id: 'artisan', label: 'Call an Artisan', icon: Wrench },
  { id: 'todo', label: 'To-do Board', icon: CheckSquare },
];

const complaintOptions = [
  'Amina Yusuf — AC blowing warm air',
  'Segun — Water heater issue',
  'Conekta System — Plumber dispatch',
];

export default function RentedListingDetailsPage() {
  const params = useParams();
  const id = (params?.id as string) || '1';

  // Fallback to item '1' if id not found
  const listing = RENTED_LISTINGS_DETAILS[id] || RENTED_LISTINGS_DETAILS['1'];

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [activeBoard, setActiveBoard] = useState('b1');
  const [selectedArtisanCategory, setSelectedArtisanCategory] = useState('AC / Cooling');
  const [selectedComplaint, setSelectedComplaint] = useState(complaintOptions[0]);

  return (
    <div className="w-full min-h-screen bg-[#F4F6F4]/80 p-4 md:p-8 space-y-6 text-slate-800">
      {/* BACK BUTTON */}
      <Link
        href="/rented-listings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All rented listings
      </Link>

      {/* PRIMARY GREEN BANNER HEADER */}
      <RentListingDetailsBanner
        title={listing.title}
        subTitle={listing.subTitle}
        managedSince={listing.managedSince}
        tenantsCount={listing.tenantsCount}
        price={listing.price}
        openTasksCount={listing.openTasksCount}
        images={listing.images}
      />

      {/* ANIMATED NAVIGATION TABS */}
      <div className="inline-flex items-center gap-1 bg-white p-1.5 rounded-full shadow-sm border border-slate-100/80 overflow-x-auto max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-primary-green rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-white' : ''}`}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ANIMATED TAB CONTENT WRAPPER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                {/* Lease & Rent Status Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                        TENANCY LEDGER
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">Lease & Rent Status</h3>
                    </div>
                    <span className="px-3 py-1 bg-primary-green/10 text-primary-green text-[10px] font-black rounded-md uppercase">
                      {listing.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-b border-slate-100 pb-6">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Rent value</span>
                      <span className="text-xl font-bold text-slate-800">{listing.price}</span>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Next due</span>
                      <span className="text-sm font-bold text-slate-800 flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> {listing.nextDue}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">Lease term left</span>
                      <span className="text-xl font-bold text-amber-700">{listing.leaseTermLeft}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-3.5 bg-[#FAF8F5] hover:bg-[#F2ECE4] rounded-xl text-left transition-colors cursor-pointer space-y-2">
                      <FileText className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-slate-700 block">Send rent reminder</span>
                    </button>

                    <button className="p-3.5 bg-[#FAF8F5] hover:bg-[#F2ECE4] rounded-xl text-left transition-colors cursor-pointer space-y-2">
                      <FileCheck className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-slate-700 block">View lease agreement</span>
                    </button>

                    <button className="p-3.5 bg-[#FAF8F5] hover:bg-[#F2ECE4] rounded-xl text-left transition-colors cursor-pointer space-y-2">
                      <RotateCw className="w-4 h-4 text-slate-700" />
                      <span className="text-xs font-bold text-slate-700 block">Start renewal</span>
                    </button>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                      DOCUMENTS
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">Property & Tenancy Files</h3>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {listing.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs font-medium">
                        <span className="flex items-center gap-2 text-slate-700 font-semibold">
                          <FileText className="w-4 h-4 text-slate-400" /> {doc.name}
                        </span>
                        <a href={doc.url} className="text-slate-500 font-bold hover:text-slate-800 flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Snapshot & Attention */}
              <div className="lg:col-span-5 space-y-6">
                {/* Snapshot */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div>
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                      SNAPSHOT
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">This Property, At a Glance</h3>
                  </div>

                  <div className="space-y-3.5 text-xs font-medium pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-slate-400" /> Unread tenant messages
                      </span>
                      <span className="font-bold text-rose-600">{listing.unreadMessagesCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-slate-400" /> Active maintenance requests
                      </span>
                      <span className="font-bold text-slate-800">{listing.activeMaintenanceCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-slate-400" /> Tasks completed this month
                      </span>
                      <span className="font-bold text-slate-800">{listing.tasksCompletedThisMonth}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-slate-400" /> Tenant satisfaction score
                      </span>
                      <span className="font-bold text-primary-green">{listing.tenantSatisfactionScore}</span>
                    </div>
                  </div>
                </div>

                {/* Needs Attention Banner */}
                <AttentionFolderCard />
              </div>
            </div>
          )}

          {/* TAB 2: TENANTS */}
          {activeTab === 'tenants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listing.tenants.map((t: any) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4"
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base font-bold text-slate-900">{t.name}</h3>
                    <span className="text-[10px] font-black tracking-wider text-amber-700 uppercase block">
                      {t.role}
                    </span>
                    <p className="text-xs text-slate-500 font-medium pt-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {t.phone}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">Lease: {t.leaseRange}</p>

                    <div className="flex items-center gap-2 pt-3">
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Message
                      </button>
                      <button className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                        View lease
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Tenant Placeholder Card */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 min-h-45">
                <Plus className="w-5 h-5 text-slate-400" />
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
                  Add a tenant
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MESSAGE BOARDS */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm min-h-125">
              {/* Boards List */}
              <div className="lg:col-span-4 border-r border-slate-100 pr-4 space-y-2">
                <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block p-2">
                  BOARDS
                </span>
                {listing.boards.map((b: any) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoard(b.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      activeBoard === b.id ? 'bg-[#FAF7F0] font-bold' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{b.name}</h4>
                      <p className="text-[11px] text-slate-400">{b.subtitle}</p>
                    </div>
                    {b.unreadCount && (
                      <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                        {b.unreadCount} unread
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-8 flex flex-col justify-between pl-2">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Admiralty Way — Group Chat
                  </h3>
                  <p className="text-[11px] text-slate-400">All 3 tenants can see this thread</p>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {listing.messages.map((m: any) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      {!m.isMe && <span className="text-[10px] font-bold text-slate-500">{m.sender}</span>}
                      <div
                        className={`p-3.5 rounded-2xl text-xs max-w-md ${
                          m.isMe
                            ? 'bg-primary-green text-white rounded-tr-none'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-400">{m.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Write a message to group..."
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-green/20"
                  />
                  <button className="px-4 py-2.5 bg-primary-green text-white rounded-xl text-xs font-bold hover:bg-primary-green-600 transition-colors flex items-center gap-1.5 cursor-pointer">
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CALL AN ARTISAN */}
          {activeTab === 'artisan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* New Request Options */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                    NEW REQUEST
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Request a Verified Artisan</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'AC / Cooling', icon: Snowflake },
                    { label: 'Plumbing', icon: Droplets },
                    { label: 'Electrical', icon: Zap },
                    { label: 'Painting', icon: Palette },
                    { label: 'Cleaning', icon: Sparkles },
                    { label: 'General', icon: Hammer },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedArtisanCategory === cat.label;

                    return (
                      <motion.button
                        key={cat.label}
                        onClick={() => setSelectedArtisanCategory(cat.label)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary-green text-white'
                            : 'bg-[#FAF8F5] text-slate-700 border-transparent hover:bg-slate-100'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeArtisanCategory"
                            className="absolute inset-0 bg-primary-green rounded-xl"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <Icon className="w-5 h-5 relative z-10" />
                        <span className={`text-xs font-bold relative z-10 ${selectedArtisanCategory === cat.label ? 'text-white' : ''}`}>
                          {cat.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                    LINKED COMPLAINT (OPTIONAL)
                  </label>
                  <CustomSelect
                    options={complaintOptions}
                    selected={selectedComplaint}
                    onChange={(val) => setSelectedComplaint(val)}
                    defaultValue="Select a complaint..."
                    variant="boxed"
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Past Visits */}
              <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
                <div>
                  <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block">
                    HISTORY FOR THIS PROPERTY
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">Past Artisan Visits</h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {listing.artisanVisits.map((visit: any) => (
                    <div key={visit.id} className="py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Droplets className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{visit.title}</h4>
                          <p className="text-[11px] text-slate-400">
                            {visit.subtitle} · {visit.date}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-primary-green/10 text-primary-green text-[9px] font-black rounded-md">
                        {visit.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TO-DO BOARD (KANBAN) */}
          {activeTab === 'todo' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* TO DO COLUMN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <h3 className="text-xs font-bold text-slate-800">To Do</h3>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {listing.kanban.todo.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {listing.kanban.todo.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3"
                    >
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded uppercase">
                        {item.priority}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{item.meta}</span>
                        <span className="font-semibold text-slate-600">{item.dateOrStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* IN PROGRESS COLUMN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold text-slate-800">In Progress</h3>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {listing.kanban.inProgress.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {listing.kanban.inProgress.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3"
                    >
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black rounded uppercase">
                        {item.priority}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{item.meta}</span>
                        <span className="font-semibold text-slate-600">{item.dateOrStatus}</span>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 border-2 border-dashed border-slate-200 text-slate-500 rounded-2xl text-xs font-bold hover:bg-white transition-colors flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" /> Add task
                  </button>
                </div>
              </div>

              {/* DONE COLUMN */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-green" />
                  <h3 className="text-xs font-bold text-slate-800">Done</h3>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-200/60 px-2 py-0.5 rounded-full">
                    {listing.kanban.done.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {listing.kanban.done.map((item: any) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF8F5] p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3"
                    >
                      <span className="px-2 py-0.5 bg-primary-green/10 text-primary-green text-[9px] font-black rounded uppercase">
                        {item.priority}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>{item.meta}</span>
                        <span className="font-semibold text-slate-600">{item.dateOrStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}