'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ReceiptText, 
  Copy, 
  Check, 
  Share2, 
  Building2,
  FileText,
  Link2,
  ChevronDown,
  Loader2
} from 'lucide-react';

const receipt = {
  reference: 'TX-24039812',
  title: 'Plumbing service',
  category: 'Home repair',
  date: 'March 18, 2026 at 10:42 AM',
  amount: 25000,
  provider: 'BrightFlow Plumbing',
  property: '42 Lekki Epe Expressway, Ajah',
};

export default function ReceiptPage() {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Copy Reference Code
  const handleCopyRef = () => {
    navigator.clipboard.writeText(receipt.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Copy Direct Link
  const handleCopyLink = async () => {
    // Mobile Web Share API support if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt - ${receipt.reference}`,
          text: `Payment receipt for ${receipt.title}`,
          url: window.location.href,
        });
        setIsShareOpen(false);
        return;
      } catch {
        // Fallback to clipboard copy if share fails or is canceled
      }
    }

    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setIsShareOpen(false);
    }, 2000);
  };

  // Server-Side PDF Download Action
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    setIsShareOpen(false);

    try {
      // Updated route URL matching your file structure
      const response = await fetch(`/finance/receipt/pdf?id=${receipt.reference}`);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Receipt-${receipt.reference}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faf7] px-4 py-8 sm:px-8 font-sans text-text-primary flex flex-col items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        
        {/* BACK BUTTON */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link 
            href="/finance" 
            className="inline-flex items-center gap-2 text-xs font-bold text-secondary-color hover:text-primary-green transition-colors bg-white px-3.5 py-2 rounded-xl border border-gray-200/80 shadow-xs active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> 
            Back to finances
          </Link>
        </motion.div>

        {/* RECEIPT TICKET CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl bg-white border border-gray-200/90 shadow-md overflow-hidden"
        >
          {/* HEADER BANNER */}
          <div className="bg-linear-to-br from-secondary-green via-primary-green to-secondary-green p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/10">
                  <ReceiptText className="h-5 w-5 text-primary-fixed" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-fixed block">
                    Conekta Finance
                  </span>
                  <h1 className="text-lg font-bold tracking-tight text-white">
                    Transaction Receipt
                  </h1>
                </div>
              </div>

              <span className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-white border border-white/10">
                {receipt.reference.slice(0, 7)}
              </span>
            </div>

            {/* AMOUNT DISPLAY */}
            <div className="mt-8 relative z-10">
              <p className="text-xs font-medium text-primary-fixed/90 uppercase tracking-wider">
                Total Amount Paid
              </p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ₦{receipt.amount.toLocaleString('en-NG')}
                </span>
                <span className="text-xs font-bold text-primary-fixed">NGN</span>
              </div>
            </div>
          </div>

          {/* TICKET CUTOUT NOTCHES */}
          <div className="relative h-6 bg-white flex items-center justify-between px-[-12px] -mt-3 z-20">
            <div className="w-5 h-5 rounded-full bg-[#f8faf7] -ml-2.5 border-r border-gray-200/80" />
            <div className="flex-1 mx-3 border-t-2 border-dashed border-gray-200" />
            <div className="w-5 h-5 rounded-full bg-[#f8faf7] -mr-2.5 border-l border-gray-200/80" />
          </div>

          {/* BODY CONTENT */}
          <div className="p-6 sm:p-8 pt-2 space-y-6">
            
            {/* STATUS BADGE & DATE */}
            <div className="flex items-center justify-between bg-tertiary-green/60 p-4 rounded-2xl border border-primary-green/15">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-primary-green shrink-0" />
                <div>
                  <p className="text-xs font-bold text-gray-900">Payment Completed</p>
                  <p className="text-[11px] text-secondary-color">{receipt.date}</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-primary-green text-white px-2.5 py-1 rounded-full">
                Verified
              </span>
            </div>

            {/* DETAILS BREAKDOWN */}
            <dl className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-1">
                <dt className="text-secondary-color font-medium">Description</dt>
                <dd className="font-bold text-gray-900 text-right">{receipt.title}</dd>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-gray-100">
                <dt className="text-secondary-color font-medium">Category</dt>
                <dd className="font-semibold text-gray-800 text-right bg-gray-100 px-2.5 py-0.5 rounded-md">
                  {receipt.category}
                </dd>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-gray-100">
                <dt className="text-secondary-color font-medium">Service Provider</dt>
                <dd className="font-bold text-primary-green text-right">{receipt.provider}</dd>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-gray-100">
                <dt className="text-secondary-color font-medium flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" /> Property
                </dt>
                <dd className="font-semibold text-gray-800 text-right max-w-50 truncate">
                  {receipt.property}
                </dd>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-gray-100">
                <dt className="text-secondary-color font-medium">Transaction Ref</dt>
                <dd className="flex items-center gap-2 font-mono text-xs font-bold text-gray-800">
                  {receipt.reference}
                  <button
                    onClick={handleCopyRef}
                    type="button"
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-primary-green cursor-pointer"
                    title="Copy reference code"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-primary-green" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </dd>
              </div>
            </dl>

            {/* BARCODE STUB */}
            <div className="pt-2">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-2 text-center">
                <div className="h-8 w-48 bg-[repeating-linear-gradient(90deg,#1e293b,#1e293b_2px,transparent_2px,transparent_4px)] opacity-60" />
                <span className="font-mono text-[10px] text-gray-400 tracking-widest uppercase">
                  AUTH CODE: {receipt.reference}
                </span>
              </div>
            </div>

            {/* SINGLE CONSOLIDATED SHARE ACTION BUTTON */}
            <div className="pt-2">
              <div className="relative w-full">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsShareOpen(!isShareOpen)}
                  disabled={isDownloading}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white px-5 py-3.5 text-xs font-bold transition-all shadow-sm cursor-pointer border border-primary-green/20 disabled:opacity-75"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  <span>{isDownloading ? 'Generating Document...' : 'Share or Export Receipt'}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-white/80 transition-transform ${isShareOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isShareOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 bottom-full mb-2 w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-1.5 z-50 overflow-hidden"
                    >
                      <button
                        onClick={handleDownloadPdf}
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold text-gray-700 hover:bg-tertiary-green hover:text-primary-green transition-colors cursor-pointer text-left"
                      >
                        <FileText className="h-4 w-4 text-primary-green shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900">Download PDF Document</p>
                          <p className="text-[10px] text-gray-400 font-normal">Save official receipt binary file</p>
                        </div>
                      </button>

                      <button
                        onClick={handleCopyLink}
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold text-gray-700 hover:bg-tertiary-green hover:text-primary-green transition-colors cursor-pointer text-left mt-0.5"
                      >
                        {copiedLink ? <Check className="h-4 w-4 text-primary-green shrink-0" /> : <Link2 className="h-4 w-4 text-primary-green shrink-0" />}
                        <div>
                          <p className="font-bold text-gray-900">{copiedLink ? 'Link Copied!' : 'Share Web Link'}</p>
                          <p className="text-[10px] text-gray-400 font-normal">Copy link or open native share menu</p>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  );
}