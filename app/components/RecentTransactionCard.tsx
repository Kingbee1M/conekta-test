import { TransactionItem } from './profile/profileTypes';
import { LuFileText } from 'react-icons/lu';

interface RecentTransactionsCardProps {
  transactions: TransactionItem[];
  onViewAllTrigger: () => void;
}

export default function RecentTransactionsCard({ transactions, onViewAllTrigger }: RecentTransactionsCardProps) {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'rental': return <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500"><LuFileText className="text-base"/></div>;
      case 'property': return <div className="p-2 rounded-xl bg-purple-50 text-purple-500"><LuFileText className="text-base"/></div>;
      default: return <div className="p-2 rounded-xl bg-blue-50 text-blue-500"><LuFileText className="text-base"/></div>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col text-left">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Recent Transactions</h4>
        <button onClick={onViewAllTrigger} className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50/40 transition-colors">
            <div className="flex items-center gap-3">
              {getIcon(tx.type)}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-800 max-w-xs md:max-w-md truncate">{tx.title}</span>
                <span className="text-[10px] text-gray-400 font-semibold mt-0.5">{tx.date}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs font-bold text-gray-800">₦{tx.amount.toLocaleString()}</span>
              <span className="bg-emerald-50 text-emerald-600 font-bold tracking-tight text-[9px] px-2 py-0.5 rounded-md capitalize">
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}