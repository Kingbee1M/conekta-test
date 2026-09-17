'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  AlertTriangle,
  Receipt,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [jobStatus, setJobStatus] = useState<'pending' | 'active' | 'completed'>('active');
  const [completionNotes, setCompletionNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Mock Job Details
  const job = {
    id: jobId || 'JOB-8492',
    title: 'Borehole Water Pump Repair',
    customer: {
      name: 'Amina Bello',
      phone: '+234 803 123 4567',
      address: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos',
    },
    paymentPlan: {
      total: '₦25,000',
      upfrontPaid: '₦10,000 (40%)',
      balanceDue: '₦15,000',
      payoutEscrow: 'Protected via Conekta Escrow',
    },
    description:
      'The borehole water pump makes a loud humming sound upon startup but fails to pump water up to the overhead storage tank. Needs diagnosis of capacitor or impeller blockage and replacing burnt coils if needed.',
    scheduledDate: '18 Sep 2026 at 10:30 AM',
    priority: 'Urgent',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    ],
  };

  const handleSimulateUpload = () => {
    setUploadedPhotos((prev) => [...prev, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80']);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* BREADCRUMB / BACK LINK */}
      <div className="flex items-center justify-between">
        <Link
          href="/artisan/jobs"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
        <span className="text-xs font-mono font-bold text-slate-400">{job.id}</span>
      </div>

      {/* HEADER CARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="capitalize">{jobStatus} Job</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">{job.title}</h1>
          <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.customer.address}</span>
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 bg-white/10 p-4 rounded-2xl border border-white/10 shrink-0">
          <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">Total Value</span>
          <span className="text-2xl font-black text-white">{job.paymentPlan.total}</span>
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Escrow Secured
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAIN DETAILS & FORUM FORM */}
        <div className="lg:col-span-8 space-y-6">
          {/* JOB DESCRIPTION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-green" />
              <span>Job Description & Scope</span>
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {job.description}
            </p>

            {/* CUSTOMER ATTACHED IMAGES */}
            {job.images.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" /> Attached Diagnosis Photos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {job.images.map((imgUrl, i) => (
                    <div key={i} className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt="Job attachment" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* WORK EXECUTION FORUM / COMPLETION SUBMISSION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary-green" />
              <span>Work Execution Log</span>
            </h2>

            {jobStatus === 'completed' ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>This job has been marked as completed. Payout release process initialized.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Proof of Work / Completion Notes
                  </label>
                  <textarea
                    rows={4}
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    placeholder="Provide a brief summary of work performed, parts replaced, or special instructions..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
                  />
                </div>

                {/* IMAGE UPLOAD SIMULATION */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Work Completion Photos
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {uploadedPhotos.map((photo, index) => (
                      <div key={index} className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="Work proof" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSimulateUpload}
                      className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary-green text-slate-400 hover:text-primary-green flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer bg-slate-50/50"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-[10px] font-bold">Add Photo</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setJobStatus('completed')}
                    className="w-full py-3 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all shadow-md active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Work & Request Final Payment</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR INFO */}
        <div className="lg:col-span-4 space-y-6">
          {/* CUSTOMER CONTACT CARD */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Customer Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-100 text-slate-700 font-extrabold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">{job.customer.name}</p>
                  <p className="text-[11px] font-medium text-slate-400">Verified Client</p>
                </div>
              </div>

              <a
                href={`tel:${job.customer.phone}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-tertiary-green text-primary-green text-xs font-bold hover:bg-primary-green hover:text-white transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client ({job.customer.phone})</span>
              </a>
            </div>
          </div>

          {/* PAYMENT BREAKDOWN */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-slate-400" />
              <span>Payment Breakdown</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Upfront Deposit</span>
                <span className="font-extrabold text-slate-800">{job.paymentPlan.upfrontPaid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Balance Upon Completion</span>
                <span className="font-extrabold text-slate-800">{job.paymentPlan.balanceDue}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black">
                <span className="text-slate-900">Total Contract</span>
                <span className="text-primary-green">{job.paymentPlan.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}