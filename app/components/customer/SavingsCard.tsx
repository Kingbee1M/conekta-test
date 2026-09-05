'use client';

import { useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Building2, House, PiggyBank } from 'lucide-react';
import type { SavingsView } from './financeTypes';
import { formatNaira } from './financeTypes';

type Props = { 
  savings: number; 
  savingsGoal: number; 
  onSavingsChange: (value: number) => void; 
  onGoalChange: (value: number) => void 
};

const savingsSchema = z.object({ 
  amount: z.string().regex(/^\d+$/, 'Enter numbers only.').transform(Number).pipe(z.number().positive('Enter an amount greater than zero.')) 
});

export default function SavingsCard({ savings, savingsGoal, onSavingsChange, onGoalChange }: Props) {
  const [savingsView, setSavingsView] = useState<SavingsView>('pig');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const savingsPercent = Math.min(100, Math.round((savings / savingsGoal) * 100));
  const amountToAdd = (direction: 1 | -1) => onSavingsChange(Math.max(0, savings + direction * 50000));
  const progressIcon = savingsView === 'pig' ? <PiggyBank className="h-14 w-14" /> : savingsView === 'house' ? <House className="h-14 w-14" /> : <Building2 className="h-14 w-14" />;

  const updateSavings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = savingsSchema.safeParse({ amount });
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Enter numbers only.');
      return;
    }
    onSavingsChange(savings + result.data.amount);
    setAmount('');
    setError('');
  };

  return (
    <motion.section 
      layout 
      className="rounded-3xl bg-white border border-gray-100 p-5 text-gray-800 shadow-sm sm:p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary-green">
            Personal savings tracker
          </p>
          <h2 className="mt-0.5 text-lg font-extrabold text-gray-900 tracking-tight">
            Rent fund progress
          </h2>
        </div>
        <motion.div 
          animate={{ rotate: savingsPercent === 100 ? [0, 12, -12, 0] : 0 }} 
          transition={{ duration: 0.5 }}
          className="p-2.5 bg-primary-green/10 rounded-2xl text-primary-green"
        >
          <PiggyBank className="h-5 w-5" />
        </motion.div>
      </div>

      {/* Progress & Amount Display */}
      <div className="mt-5 flex items-center gap-5 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
        {/* Progress Container */}
        <div className="relative flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-2">
          <motion.div 
            initial={false} 
            animate={{ height: `${savingsPercent}%` }} 
            transition={{ type: 'spring', stiffness: 80, damping: 16 }} 
            className="absolute inset-x-0 bottom-0 rounded-t-xl bg-primary-green/15" 
          />
          <motion.div 
            key={savingsView} 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ type: 'spring', stiffness: 240, damping: 15 }} 
            className="relative z-10 text-primary-green pb-1"
          >
            {progressIcon}
          </motion.div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500">You&apos;ve set aside</p>
          <motion.p 
            key={savings} 
            initial={{ scale: 1.08 }} 
            animate={{ scale: 1 }} 
            className="mt-0.5 text-2xl font-black text-gray-900 tracking-tight"
          >
            {formatNaira(savings)}
          </motion.p>
          <p className="mt-1 text-xs font-medium text-gray-500">
            <span className="font-bold text-primary-green">{savingsPercent}%</span> of {formatNaira(savingsGoal)} rent goal
          </p>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <motion.button 
          whileTap={{ scale: 0.96 }} 
          type="button" 
          onClick={() => amountToAdd(1)} 
          className="rounded-xl bg-primary-green px-3 py-2.5 text-xs font-bold text-white hover:bg-primary-green-hover transition-colors cursor-pointer shadow-xs"
        >
          + ₦50,000
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.96 }} 
          type="button" 
          onClick={() => amountToAdd(-1)} 
          className="rounded-xl bg-gray-100 border border-gray-200 px-3 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          - ₦50,000
        </motion.button>
      </div>

      {/* Custom Add Amount Form */}
      <form onSubmit={updateSavings} className="mt-2.5 flex gap-2">
        <input 
          value={amount} 
          onChange={(event) => { 
            if (/^\d*$/.test(event.target.value)) { 
              setAmount(event.target.value); 
              setError(''); 
            } 
          }} 
          inputMode="numeric" 
          pattern="[0-9]*" 
          aria-label="Amount to add to savings" 
          placeholder="Add exact amount" 
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all" 
        />
        <button 
          type="submit" 
          className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-gray-800 transition-colors cursor-pointer"
        >
          Add
        </button>
      </form>

      {error && <p role="alert" className="mt-2 text-xs font-semibold text-red-500">{error}</p>}

      {/* Footer Settings Section */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500 font-medium">
          <span>Choose your meter</span>
          <span className="font-semibold text-gray-700">{formatNaira(Math.max(0, savingsGoal - savings))} to go</span>
        </div>

        {/* View Selector Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {(['pig', 'house', 'bank'] as SavingsView[]).map((view) => (
            <motion.button 
              whileTap={{ scale: 0.96 }} 
              type="button" 
              key={view} 
              onClick={() => setSavingsView(view)} 
              className={`flex-1 rounded-lg py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                savingsView === view 
                  ? 'bg-white text-gray-900 shadow-xs' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {view}
            </motion.button>
          ))}
        </div>

        {/* Goal Input */}
        <label className="mt-3.5 block text-xs font-semibold text-gray-500">
          Rent goal
          <input 
            type="text" 
            inputMode="numeric" 
            pattern="[0-9]*" 
            value={savingsGoal} 
            onChange={(event) => { 
              if (/^\d*$/.test(event.target.value)) onGoalChange(Number(event.target.value) || 1); 
            }} 
            className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all" 
          />
        </label>
      </div>
    </motion.section>
  );
}