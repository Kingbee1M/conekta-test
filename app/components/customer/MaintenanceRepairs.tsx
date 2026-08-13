'use client';

import {LuDroplet, LuZap} from 'react-icons/lu';
import { FaChevronRight } from "react-icons/fa6";
import { GoShieldCheck } from "react-icons/go";
import { FiPlus } from "react-icons/fi";
import { HiMiniWrench } from "react-icons/hi2";
import Link from 'next/link';

interface Ticket {
  id: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'AC / HVAC' | 'General';
  status: 'In Progress' | 'Pending Artisan' | 'Completed';
  date: string;
  artisanName?: string;
  costEstimate?: number;
}

const mockTickets: Ticket[] = [
  {
    id: 'm-101',
    title: 'AC Unit Sparking in Master Bedroom',
    category: 'Electrical',
    status: 'In Progress',
    date: 'Aug 12, 2026',
    artisanName: 'Babatunde Electronics',
    costEstimate: 25000,
  },
  {
    id: 'm-102',
    title: 'Kitchen Sink Water Pipe Leak',
    category: 'Plumbing',
    status: 'Completed',
    date: 'Jul 28, 2026',
    artisanName: 'Okon Plumbing Services',
    costEstimate: 15000,
  },
];

export default function MaintenanceRepairs() {
  return (
    <section className="w-full max-w-7xl px-4 sm:px-6">
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-200/80 dark:border-stone-800">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-artisan-orange/10 text-artisan-orange">
                <HiMiniWrench className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-text-primary dark:text-stone-100">
                Maintenance & Repairs
              </h2>
            </div>
            <p className="text-xs text-secondary-color mt-1">
              Request verified artisans, track active repairs, and manage property fixes.
            </p>
          </div>

          <Link
            href="/maintenance/new"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-artisan-orange hover:bg-artisan-orange/90 text-white text-xs font-bold shadow-sm transition-colors w-fit"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Request Repair</span>
          </Link>
        </div>

        {/* Guaranteed Service Banner */}
        <div className="my-5 p-3.5 rounded-xl bg-lister-background dark:bg-stone-800/40 border border-primary-green/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <GoShieldCheck className="w-5 h-5 text-primary-green shrink-0" />
            <p className="text-xs text-text-primary dark:text-stone-300">
              <span className="font-bold">Conekta Artisan Guarantee:</span> Every repair is handled by background-checked technicians with escrow payment safety.
            </p>
          </div>
        </div>

        {/* Tickets Breakdown Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-secondary-color uppercase tracking-wider">
              Recent Work Orders
            </h3>
            <Link
              href="/maintenance"
              className="text-xs font-bold text-primary-green hover:underline flex items-center gap-0.5"
            >
              <span>View All Tickets</span>
              <FaChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-artisan-orange/40 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-app-background dark:bg-stone-800 flex items-center justify-center shrink-0 mt-0.5">
                      {ticket.category === 'Electrical' ? (
                        <LuZap className="w-4 h-4 text-amber-500" />
                      ) : (
                        <LuDroplet className="w-4 h-4 text-lister-blue" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary dark:text-stone-100">
                        {ticket.title}
                      </h4>
                      <p className="text-[11px] text-secondary-color">
                        Artisan: <span className="font-semibold text-text-primary dark:text-stone-300">{ticket.artisanName}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      ticket.status === 'Completed'
                        ? 'bg-active-link text-primary-green'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-secondary-color">
                  <span>Filed {ticket.date}</span>
                  {ticket.costEstimate && (
                    <span className="font-bold text-text-primary dark:text-stone-200">
                      Est. ₦{ticket.costEstimate.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}