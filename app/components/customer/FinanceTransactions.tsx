import Link from 'next/link';
import { 
  ChevronRight, 
  ArrowUpRight, 
  Building2, 
  CreditCard, 
  Receipt, 
  Wallet 
} from 'lucide-react';
import { formatNaira, transactions } from './financeTypes';

// Helper to render clean vector icons based on category or custom fallback
function getTransactionIcon(category: string) {
  const cat = category.toLowerCase();
  
  if (cat.includes('rent') || cat.includes('housing')) {
    return <Building2 className="h-4 w-4 text-primary-green" />;
  }
  if (cat.includes('card') || cat.includes('payment')) {
    return <CreditCard className="h-4 w-4 text-primary-green" />;
  }
  if (cat.includes('bill') || cat.includes('utility')) {
    return <Receipt className="h-4 w-4 text-primary-green" />;
  }
  if (cat.includes('wallet') || cat.includes('transfer')) {
    return <Wallet className="h-4 w-4 text-primary-green" />;
  }

  // Clean default fallback icon for general outgoing payments
  return <ArrowUpRight className="h-4 w-4 text-primary-green" />;
}

export default function FinanceTransactions() {
  return (
    <section className="rounded-3xl border border-primary-green/20 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-secondary-color">
            Activity
          </p>
          <h2 className="mt-1 text-xl font-bold text-text-primary">
            Transaction History
          </h2>
        </div>
        <Link 
          href="/profile" 
          className="text-xs font-bold text-primary-green hover:text-primary-green-hover hover:underline"
        >
          View all
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-primary-green/10">
        {transactions.map((transaction) => (
          <Link 
            href={`/finance/receipt/${transaction.id}`} 
            key={transaction.id} 
            className="flex items-center gap-3 py-3 transition-colors hover:bg-tertiary-green/50 rounded-xl px-1.5 -mx-1.5"
          >
            {/* Lucide Icon Badge */}
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-tertiary-green border border-primary-green/10">
              {getTransactionIcon(transaction.category)}
            </span>

            {/* Info */}
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm font-semibold text-text-primary">
                {transaction.title}
              </strong>
              <span className="text-xs text-secondary-color">
                {transaction.category} · {transaction.date}
              </span>
            </span>

            {/* Amount */}
            <span className="text-right">
              <strong className="block text-sm font-bold text-text-primary">
                -{formatNaira(transaction.amount)}
              </strong>
              <span className="text-[11px] font-semibold text-primary-green">
                Completed
              </span>
            </span>

            <ChevronRight className="h-4 w-4 text-secondary-color" />
          </Link>
        ))}
      </div>
    </section>
  );
}