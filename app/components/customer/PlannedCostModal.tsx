'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Calendar, FileText } from 'lucide-react';
import type { PlannedCost } from './financeTypes';

type Props = { 
  onClose: () => void; 
  onAdd: (cost: PlannedCost) => void 
};

export default function PlannedCostModal({ onClose, onAdd }: Props) {
  const [error, setError] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const amount = Number(formData.get('amount'));

    if (!title || !amount || amount < 1) {
      setError('Please provide a name and an amount greater than 0.');
      return;
    }

    onAdd({
      id: `plan-${Date.now()}`,
      title,
      note: String(formData.get('note') || 'Planned home cost'),
      amount,
      due: String(formData.get('due') || 'No date set'),
      color: 'bg-tertiary-green',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* DARK GLASSY BACKDROP OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* WHITE MODAL CARD */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="planned-cost-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl border border-primary-green/20 bg-white/95 p-6 sm:p-8 text-text-primary shadow-2xl backdrop-blur-xl z-10 overflow-hidden"
        >
          {/* Subtle Ambient Lighting Background Accents */}
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-tertiary-green/60 blur-3xl pointer-events-none" />

          {/* HEADER */}
          <div className="mb-6 flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3.5 w-3.5 text-primary-green" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-green">
                  Add To Your List
                </span>
              </div>
              <h2
                id="planned-cost-title"
                className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl"
              >
                Plan a Home Cost
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              aria-label="Close form"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary-green/80 border border-primary-green/15 text-secondary-color transition-colors hover:bg-tertiary-green hover:text-primary-green cursor-pointer"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* FORM */}
          <form onSubmit={submit} className="space-y-4 relative z-10">
            {/* TITLE FIELD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-color mb-1.5">
                What are you planning to pay for?
              </label>
              <input
                name="title"
                required
                placeholder="e.g. Fix the kitchen tap"
                className="w-full rounded-2xl border border-primary-green/20 bg-tertiary-green/30 px-4 py-3 text-sm text-text-primary placeholder-secondary-color/60 outline-none transition-all focus:border-primary-green focus:bg-white focus:ring-2 focus:ring-primary-green/20"
              />
            </div>

            {/* AMOUNT FIELD */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary-color mb-1.5">
                Estimated Amount
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-sm font-bold text-primary-green">
                  ₦
                </span>
                <input
                  name="amount"
                  required
                  min="1"
                  type="number"
                  placeholder="50000"
                  className="w-full rounded-2xl border border-primary-green/20 bg-tertiary-green/30 pl-8 pr-4 py-3 text-sm font-semibold text-text-primary placeholder-secondary-color/60 outline-none transition-all focus:border-primary-green focus:bg-white focus:ring-2 focus:ring-primary-green/20"
                />
              </div>
            </div>

            {/* TWO COLUMN ROW: DUE DATE & NOTE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary-color mb-1.5">
                  <Calendar className="h-3 w-3 text-primary-green" />
                  Due Date
                </label>
                <input
                  name="due"
                  placeholder="Before May 10"
                  className="w-full rounded-2xl border border-primary-green/20 bg-tertiary-green/30 px-4 py-3 text-sm text-text-primary placeholder-secondary-color/60 outline-none transition-all focus:border-primary-green focus:bg-white focus:ring-2 focus:ring-primary-green/20"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary-color mb-1.5">
                  <FileText className="h-3 w-3 text-primary-green" />
                  Note
                </label>
                <input
                  name="note"
                  placeholder="A short note"
                  className="w-full rounded-2xl border border-primary-green/20 bg-tertiary-green/30 px-4 py-3 text-sm text-text-primary placeholder-secondary-color/60 outline-none transition-all focus:border-primary-green focus:bg-white focus:ring-2 focus:ring-primary-green/20"
                />
              </div>
            </div>

            {/* ERROR ALERT */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-600"
              >
                {error}
              </motion.p>
            )}

            {/* SUBMIT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary-green hover:bg-secondary-green-hover px-5 py-3.5 text-xs font-extrabold text-white transition-all shadow-md shadow-secondary-green/20 cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Add Planned Cost</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}