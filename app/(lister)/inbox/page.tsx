'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Send, ArrowUpRight, Wrench } from 'lucide-react';

interface Conversation {
  id: string;
  sender: string;
  avatar?: string;
  initials?: string;
  time: string;
  property: string;
  unread: boolean;
  role?: string;
  latestMessage: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    sender: 'Amina Yusuf',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    time: '11:45 AM',
    property: 'ADMIRALTY WAY APT',
    unread: true,
    role: 'Co-tenant, Room 2',
    latestMessage: "The AC in the master bedroom has been blowing warm air since Tuesday. It's getting pretty uncomfortable at night 🥵",
  },
  {
    id: '2',
    sender: 'Chevron Drive — Group Chat',
    initials: 'CD',
    time: '10:20 AM',
    property: 'CHEVRON DRIVE',
    unread: true,
    latestMessage: 'Segun: Thanks for sorting the water heater!',
  },
  {
    id: '3',
    sender: 'Conekta System',
    initials: '🔧',
    time: '9:52 AM',
    property: 'MARINA BAY 3B',
    unread: true,
    latestMessage: 'Artisan assigned — plumber ETA 18 min',
  },
  {
    id: '4',
    sender: 'Chinedu Okafor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    time: 'Yesterday',
    property: 'ADMIRALTY WAY',
    unread: false,
    role: 'Primary Tenant',
    latestMessage: 'Appreciate the quick response 🙏',
  },
];

export default function Inbox() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Conversation | null>(null);

  const filteredConversations = MOCK_CONVERSATIONS.filter((item) => {
    const matchesFilter = filter === 'unread' ? item.unread : true;
    const matchesSearch =
      item.sender.toLowerCase().includes(search.toLowerCase()) ||
      item.property.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen p-6 md:p-10 space-y-6 overflow-x-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Inbox
        </h1>
      </div>

      {/* DYNAMIC INBOX GRID */}
      <div className="flex gap-5 items-start relative min-h-[580px]">
        
        {/* LEFT PANEL: MESSAGE LIST */}
        <motion.div
          animate={{
            width: selectedMessage ? '420px' : '100%',
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60 shrink-0 overflow-hidden"
        >
          {/* SEARCH BAR */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-100/80 text-xs font-medium text-slate-800 pl-10 pr-4 py-3 rounded-full outline-none focus:ring-2 focus:ring-primary-green/20 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* FILTER CHIPS */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-primary-green text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'unread'
                  ? 'bg-primary-green text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              Unread ({MOCK_CONVERSATIONS.filter((c) => c.unread).length})
            </button>
          </div>

          {/* CONVERSATION LIST */}
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {filteredConversations.map((item) => {
              const isSelected = selectedMessage?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMessage(item)}
                  className={`relative flex items-center gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-green/10 border border-primary-green/20 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0 absolute left-2 top-1/2 -translate-y-1/2" />
                  )}

                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-sm">
                    {item.avatar ? (
                      <Image
                        src={item.avatar}
                        alt={item.sender}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      item.initials
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.sender}
                      </h4>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mb-1.5">
                      {item.latestMessage}
                    </p>

                    <span className="inline-block text-[9px] font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {item.property}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT PANEL: SINGLE MESSAGE READ VIEW */}
        <AnimatePresence mode="popLayout">
          {selectedMessage && (
            <motion.div
              key={selectedMessage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 min-h-[580px] flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* RESPONSIVE & FLEXIBLE HEADER TOPBAR */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  {/* SENDER INFO */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center font-bold text-amber-900 text-sm shrink-0">
                      {selectedMessage.avatar ? (
                        <Image
                          src={selectedMessage.avatar}
                          alt={selectedMessage.sender}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        selectedMessage.initials
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {selectedMessage.sender}
                        </h2>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                          {selectedMessage.property}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {selectedMessage.role || 'Tenant Inquiry'}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        className="px-3.5 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View listing</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-full bg-primary-green hover:bg-primary-green/90 text-xs font-semibold text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5 text-white" />
                        <span className="text-white">Assign artisan</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-1 cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="py-6">
                  <div className="text-center my-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Inquiry Log · {selectedMessage.time}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 max-w-2xl">
                    <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                      {selectedMessage.latestMessage}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder={`Reply to ${selectedMessage.sender.split(' ')[0]}...`}
                    className="w-full bg-slate-100 text-xs font-medium text-slate-800 pl-5 pr-14 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary-green/20 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    className="absolute right-1.5 p-2 bg-primary-green hover:bg-primary-green/90 text-white rounded-full transition-transform active:scale-95 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}