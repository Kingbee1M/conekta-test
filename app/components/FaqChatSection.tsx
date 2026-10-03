'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, MessageSquare, ChartArea } from 'lucide-react';
import { MdBubbleChart } from 'react-icons/md';MdBubbleChart

interface FaqItem {
  id: string;
  category: string;
  question: string;
  replies: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'what-is-conekta',
    category: 'General',
    question: 'What is Conekta?',
    replies: [
      'Conekta is a unified digital platform designed to help you discover, finance, pay for, and manage housing across Africa.',
      'We built it to eliminate ghost listings, agent fraud, heavy upfront rent demands, and the complete lack of support after lease signing.',
      'Plus, through Project Roof, 10% of our profits directly support housing for the homeless.',
    ],
  },
  {
    id: 'who-can-use',
    category: 'General',
    question: 'Who can use Conekta, and how do I get started?',
    replies: [
      'Conekta is built for everyone: Tenants, Home Seekers, Property Owners, Developers, Artisans, and Investors!',
      'To get started, simply create an account, select your role on the platform, and complete a quick identity check.',
    ],
  },
  {
    id: 'is-listing-real',
    category: 'Finding & Inspecting',
    question: 'How do I know a listing is real?',
    replies: [
      'All properties are posted by verified owners and developers. You deal directly with them on the platform—zero middlemen or fake agents.',
      'We also utilize AI-powered search and neighborhood insights to help you compare areas before you even visit.',
    ],
  },
  {
    id: 'inspections',
    category: 'Finding & Inspecting',
    question: 'Can I inspect a property before I commit?',
    replies: [
      'Yes! Virtual inspections are 100% free and unlimited. Just select a time window for the lister to confirm.',
      'For physical inspections, your first 3 are completely free across all properties. Subsequent physical visits cost ₦5,000 each.',
    ],
  },
  {
    id: 'payments-safety',
    category: 'Payments & Security',
    question: 'Is it safe to pay on Conekta, and how do payments work?',
    replies: [
      'All payments are processed directly through Conekta. You never hand over physical cash or transfer funds to strangers.',
      'Your lease is instantly activated once payment is made. Since every user is identity-verified, you always know who you are dealing with.',
    ],
  },
  {
    id: 'after-move-in',
    category: 'Managing Property',
    question: 'What happens after I move in or let out a property?',
    replies: [
      'Conekta doesn’t stop at handing over the keys!',
      'Landlords and tenants get unified management tools, including rent trackers that show paid vs. due amounts so everyone stays on the same page.',
    ],
  },
  {
    id: 'artisans',
    category: 'Managing Property',
    question: 'Can I find a trusted artisan for repairs, or join as one?',
    replies: [
      'Our Artisans Corner connects landlords and tenants directly with verified skilled professionals for repairs and maintenance.',
      'If you are an artisan, you can sign up, complete verification, and get hired by nearby landlords and tenants.',
    ],
  },
  {
    id: 'pay-small-small',
    category: 'Financing & Investing',
    question: 'What does "pay small-small" mean?',
    replies: [
      '“Pay small-small” is our flexible rent-to-own and financing option.',
      'Instead of paying massive upfront costs at once, you can spread your rent or housing payments through structured flexible plans.',
    ],
  },
  {
    id: 'investing',
    category: 'Financing & Investing',
    question: 'Can I invest in property on Conekta?',
    replies: [
      'Yes! Our fractional investment opportunities let you own portions of high-yield properties with smaller amounts.',
      'All opportunities and verified metrics are fully displayed transparently before you commit.',
    ],
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
  senderName?: string;
  avatar?: string;
}

export default function FaqChatSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'support',
      senderName: 'Conekta Support',
      avatar: '/avatar-support.png',
      text: 'Hello there! 👋 Welcome to Conekta Support.',
      timestamp: '09:00 AM',
    },
    {
      id: 'welcome-2',
      sender: 'support',
      senderName: 'Conekta Support',
      avatar: '/avatar-support.png',
      text: 'Have questions about finding, paying for, or managing a property? Pick any question below to chat with us!',
      timestamp: '09:00 AM',
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(0);

  const categories = ['All', 'General', 'Finding & Inspecting', 'Payments & Security', 'Managing Property', 'Financing & Investing'];

  const filteredFaqs = activeCategory === 'All' 
    ? FAQ_DATA 
    : FAQ_DATA.filter((f) => f.category === activeCategory);

  const createMessageId = (prefix: string) => {
    nextMessageIdRef.current += 1;
    return `${prefix}-${nextMessageIdRef.current}`;
  };

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    if (chatThreadRef.current) {
      chatThreadRef.current.scrollTo({
        top: chatThreadRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSelectQuestion = (faq: FaqItem) => {
    if (isTyping) return;

    const time = getCurrentTime();

    // 1. Append User Question
    const userMsg: ChatMessage = {
      id: createMessageId('user'),
      sender: 'user',
      text: faq.question,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 2. Sequential Support Replies with Typing Delays
    faq.replies.forEach((replyText, index) => {
      const delay = 1200 + index * 1800; // Delay for each consecutive bubble

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId('support'),
            sender: 'support',
            senderName: 'Conekta Support',
            avatar: '/avatar-support.png',
            text: replyText,
            timestamp: getCurrentTime(),
          },
        ]);

        // Stop typing indicator when final bubble lands
        if (index === faq.replies.length - 1) {
          setIsTyping(false);
        }
      }, delay);
    });
  };

  return (
    <section className="w-full py-20 lg:py-24 bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-green text-white text-sm font-semibold uppercase tracking-wider mb-4">
            <MdBubbleChart className="w-3.5 h-3.5" /> Interactive FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Have questions? Let’s chat.
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Select a question below to simulate an active conversation with our team.
          </p>
        </div>

        {/* Chat Window Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-175 sm:h-190 lg:h-205">
          
          {/* Chat Header Bar */}
          <div className="px-6 py-5 lg:px-8 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-primary-green/40">
                  CS
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary-green border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  Conekta Support Assistant
                </h3>
                <p className="text-xs text-slate-500">
                  Active support connection thread • Replies instantly
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">
              <MessageSquare className="w-3.5 h-3.5 text-primary-green" /> FAQ Session
            </div>
          </div>

          {/* Chat Messages Thread Viewport */}
          <div
            ref={chatThreadRef}
            className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8 space-y-6 bg-slate-50/50"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Sender Label for Support */}
                  {msg.sender === 'support' && (
                    <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-11">
                      {msg.senderName}
                    </span>
                  )}

                  <div className={`flex items-end gap-2.5 max-w-[90%] sm:max-w-[80%]`}>
                    {/* Support Avatar */}
                    {msg.sender === 'support' && (
                      <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">
                        C
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div
                      className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-primary-green text-white rounded-br-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span
                    className={`text-[10px] text-slate-400 mt-1 ${
                      msg.sender === 'user' ? 'mr-1' : 'ml-11'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Bouncing 3-Dot Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-start"
              >
                <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-11">
                  Conekta Support
                </span>
                <div className="flex items-center gap-2.5 ml-11">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-xs flex items-center gap-1.5">
                    <motion.span
                      className="w-2 h-2 bg-primary-green rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-primary-green rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-primary-green rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Interactive Question Selector Area (Replaces Input Box) */}
          <div className="border-t border-slate-200 bg-white p-5 sm:p-6">
            
            {/* Category Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Question Chips / Options */}
            <div className="flex flex-wrap gap-2 max-h-44 lg:max-h-48 overflow-y-auto pr-1">
              {filteredFaqs.map((faq) => (
                <button
                  key={faq.id}
                  disabled={isTyping}
                  onClick={() => handleSelectQuestion(faq)}
                  className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-primary-green/10 hover:border-primary-green text-slate-700 hover:text-emerald-900 text-sm font-medium text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{faq.question}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

            {/* Footer Hint */}
            <p className="text-xs text-center text-slate-400 mt-3">
              Select a question above to send. Still have custom questions? Email us at{' '}
              <a href="mailto:info@useconekta.com" className="text-primary-green underline font-medium">
                support@useconekta.com
              </a>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}