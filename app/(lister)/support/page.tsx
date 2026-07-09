'use client';

import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaChevronDown, FaHeadset, FaBookOpen, FaShieldAlt } from 'react-icons/fa';

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How do I update my listed property status?",
      a: "Navigate to your Analytics or Portfolio dashboard, click on the specific property card, and select 'Edit'. You can change the status flag between Active Listed, Under Offer, or Sold."
    },
    {
      q: "When do real-time market insights refresh?",
      a: "Geographical analytics data and location distribution channels update automatically every hour based on live transactions and platform metrics."
    },
    {
      q: "Can I manage multiple agency store branches?",
      a: "Yes! If your account permissions allow, you can switch or provision new store handles directly under your main Profile Settings configurations."
    }
  ];

  return (
    <section className="w-full flex flex-col gap-6 p-1 h-full min-h-screen bg-[#F8FAFC]">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="w-full flex flex-col gap-0.5">
        <h1 className="font-black text-2xl text-slate-900 tracking-tight">Help & Support</h1>
        <p className="text-sm font-medium text-slate-500">Get in touch with us or find answers to your questions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start w-full">
        
        {/* LEFT COLUMN: FAQ & DOCUMENTATION CARD */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-50/80 pb-4">
            <FaBookOpen className="text-slate-400 text-sm" />
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Frequently Asked Questions</h3>
          </div>

          {/* FAQ Accordion Loop */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 bg-slate-50/30"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    type="button"
                    className="w-full flex justify-between items-center px-4 py-3.5 text-left font-bold text-xs text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <FaChevronDown className={`text-slate-400 text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-green' : ''}`} />
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-slate-50 bg-white' : 'max-h-0'
                    }`}
                  >
                    <p className="p-4 text-xs font-medium text-slate-500 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extra Trust Banner */}
          <div className="flex items-center gap-3 bg-emerald-50/40 border border-emerald-50/80 rounded-xl p-4 mt-2">
            <FaShieldAlt className="text-primary-green text-base shrink-0" />
            <p className="text-[11px] font-semibold text-emerald-800 leading-normal">
              Your account security and platform operations are fully monitored. All official help channels are encrypted and safe.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIONABLE CONTACT CHANNELS */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-50/80 pb-4">
            <FaHeadset className="text-slate-400 text-sm" />
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Direct Channels</h3>
          </div>

          <p className="text-xs font-semibold text-slate-400 leading-relaxed">
            Need direct human intervention? Choose a convenient channel below to start talking to our core desk team.
          </p>

          <div className="flex flex-col gap-3 pt-1">
            
            {/* WHATSAPP CARD LINK */}
            <a 
              href="https://wa.me/2348072383942" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-between border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-500 rounded-xl p-4 transition-all hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-emerald-50 text-[#25D366] rounded-full flex items-center justify-center text-lg group-hover:scale-110 transition-transform shadow-inner">
                  <FaWhatsapp />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black text-slate-800">WhatsApp Only</span>
                  <span className="text-[11px] font-semibold text-slate-400 tracking-wide">+234 807 238 3942</span>
                </div>
              </div>
            </a>

            {/* EMAIL CONTACT CARD LINK */}
            <a 
              href="mailto:support@useconekta.com"
              className="group flex items-center justify-between border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-500 rounded-xl p-4 transition-all hover:shadow-md hover:shadow-emerald-500/5 cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-emerald-50 text-primary-green rounded-full flex items-center justify-center text-base group-hover:scale-110 transition-transform shadow-inner">
                  <FaEnvelope />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black text-slate-800">Email Helpdesk</span>
                  <span className="text-[11px] font-semibold text-slate-400 truncate max-w-44">support@useconekta.com</span>
                </div>
              </div>
            </a>

          </div>

          <div className="text-center pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Available Mon - Fri (8AM - 5PM)
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}