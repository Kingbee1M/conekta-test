'use client';

import { motion } from 'framer-motion';
import { Plus, Sparkles, Calendar, Receipt } from 'lucide-react';
import type { PlannedCost } from './financeTypes';
import { formatNaira } from './financeTypes';

type Props = { 
  plannedCosts: PlannedCost[]; 
  onAdd: () => void;
};

export default function PlannedHomeCosts({ plannedCosts, onAdd }: Props) {
  const totalPlannedAmount = plannedCosts.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary-green/20 bg-linear-to-b from-tertiary-green/80 to-tertiary-green/30 p-5 shadow-xs backdrop-blur-md sm:p-6">
      {/* Decorative ambient background blur */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-green/10 blur-2xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary-green animate-pulse" />
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary-green">
              Your Home List
            </p>
          </div>
          <h2 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-text-primary">
            Planned Home Costs
          </h2>
          <p className="mt-0.5 text-xs font-medium text-secondary-color">
            A gentle reminder for what you plan to pay for.
          </p>
        </div>

        {/* ADD BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onAdd}
          aria-label="Add planned home cost"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-green text-white shadow-sm transition-all hover:bg-primary-green-hover cursor-pointer"
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </div>

      {/* LIST SECTION */}
      {plannedCosts.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary-green/25 bg-white/60 px-4 py-8 text-center backdrop-blur-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tertiary-green text-primary-green mb-3">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-text-primary">No planned costs yet</p>
          <p className="mt-1 text-[11px] text-secondary-color max-w-50">
            Keep track of upcoming home maintenance and bills easily.
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:underline cursor-pointer"
          >
            + Add your first cost
          </button>
        </div>
      ) : (
        /* ITEM CARDS */
        <div className="space-y-2.5">
          {plannedCosts.map((cost, idx) => (
            <motion.div
              key={cost.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className="group relative flex items-center gap-3.5 rounded-2xl border border-primary-green/15 bg-white/90 p-3.5 shadow-xs transition-all hover:border-primary-green/30 hover:shadow-md hover:bg-white"
            >
              {/* ICON BADGE */}
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                  cost.color || 'bg-tertiary-green'
                }`}
              >
                <Sparkles className="h-4 w-4 text-primary-green" />
              </span>

              {/* CONTENT */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-bold text-text-primary">
                    {cost.title}
                  </p>
                  <strong className="text-xs sm:text-sm font-extrabold text-text-primary shrink-0">
                    {formatNaira(cost.amount)}
                  </strong>
                </div>

                {cost.note && (
                  <p className="mt-0.5 truncate text-[11px] text-secondary-color">
                    {cost.note}
                  </p>
                )}

                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-primary-green bg-tertiary-green/80 w-max px-2 py-0.5 rounded-md border border-primary-green/10">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>{cost.due}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* TOTAL SUMMARY FOOTER */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/50 px-3.5 py-2 border border-primary-green/10 text-xs font-semibold text-secondary-color">
            <span>Total Planned</span>
            <span className="font-extrabold text-primary-green">
              {formatNaira(totalPlannedAmount)}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}