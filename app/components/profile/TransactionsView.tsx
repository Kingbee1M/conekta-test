'use client';

import { ArrowDownToLine, ReceiptText } from 'lucide-react';
import { motion } from 'framer-motion';
import { TransactionItem } from './profileTypes';

export default function TransactionsView({ transactions }: { transactions: TransactionItem[] }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-green">Your activity</p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">Transactions</h2>
        <p className="mt-1 text-sm text-gray-500">A clear record of your property and service payments.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex flex-col gap-3 border-b border-gray-100 p-5 last:border-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-primary-green"><ReceiptText size={18} /></span>
              <div><p className="text-sm font-bold text-gray-900">{transaction.title}</p><p className="text-xs text-gray-500">{transaction.id} · {transaction.date}</p></div>
            </div>
            <div className="flex items-center justify-between gap-6 sm:justify-end"><span className="text-sm font-bold text-gray-900">₦{transaction.amount.toLocaleString()}</span><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-primary-green">{transaction.status}</span><button type="button" aria-label={`Download receipt for ${transaction.title}`} className="text-gray-400 transition-colors hover:text-primary-green"><ArrowDownToLine size={16} /></button></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}