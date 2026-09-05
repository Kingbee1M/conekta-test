'use client';

import { useState } from 'react';
import { CalendarDays, CircleDollarSign, PiggyBank, ReceiptText } from 'lucide-react';
import FinanceMetricCard from './FinanceMetricCard';
import FinanceSpendingChart from './FinanceSpendingChart';
import FinanceTransactions from './FinanceTransactions';
import PlannedCostModal from './PlannedCostModal';
import PlannedHomeCosts from './PlannedHomeCosts';
import SavingsCard from './SavingsCard';
import { initialPlannedCosts, transactions, type PlannedCost, formatNaira } from './financeTypes';

export default function ClientFinance() {
    const [plannedCosts, setPlannedCosts] = useState(initialPlannedCosts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [savings, setSavings] = useState(350000);
    const [savingsGoal, setSavingsGoal] = useState(600000);
    const savingsPercent = Math.min(100, Math.round((savings / savingsGoal) * 100));
    const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const addPlannedCost = (cost: PlannedCost) => {
        setPlannedCosts((current) => [cost, ...current]);
        setIsFormOpen(false);
    };

    return (
        <div className="mt-10 min-h-screen px-4 py-8 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-green">Your home, accounted for</p><h1 className="text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">Home finances</h1><p className="mt-2 max-w-xl text-sm text-secondary-color">A clear view of what your home costs, what is coming next, and how your rent savings are growing.</p></div>
                    <div className="flex items-center gap-2 self-start rounded-full border border-primary-green/20 bg-white px-3 py-2 text-xs font-semibold text-secondary-color shadow-sm sm:self-auto"><span className="h-2 w-2 rounded-full bg-primary-green" /> Live data view</div>
                </header>
                <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <FinanceMetricCard label="Spent this month" value={formatNaira(118000)} detail="12% less than February" icon={<CircleDollarSign />} tone="green" />
                    <FinanceMetricCard label="Total tracked" value={formatNaira(totalSpent)} detail="Across 4 transactions" icon={<ReceiptText />} tone="orange" />
                    <FinanceMetricCard label="Planned costs" value={formatNaira(plannedCosts.reduce((sum, item) => sum + item.amount, 0))} detail={`${plannedCosts.length} things on your list`} icon={<CalendarDays />} tone="blue" />
                    <FinanceMetricCard label="Rent saved" value={formatNaira(savings)} detail={`${savingsPercent}% of your goal`} icon={<PiggyBank />} tone="purple" />
                </section>
                <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
                    <FinanceSpendingChart />
                    <SavingsCard savings={savings} savingsGoal={savingsGoal} onSavingsChange={setSavings} onGoalChange={setSavingsGoal} />
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <FinanceTransactions />
                    <PlannedHomeCosts plannedCosts={plannedCosts} onAdd={() => setIsFormOpen(true)} />
                </div>
            </div>
            {isFormOpen && <PlannedCostModal onClose={() => setIsFormOpen(false)} onAdd={addPlannedCost} />}
        </div>
    );
}
