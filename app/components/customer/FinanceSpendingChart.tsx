import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNaira, spendingData } from './financeTypes';

export default function FinanceSpendingChart() {
    return (
        <section className="rounded-3xl border border-primary-green/20 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between">
                <div><p className="text-xs font-bold uppercase tracking-widest text-secondary-color">Spending pattern</p><h2 className="mt-1 text-xl font-bold text-text-primary">Monthly spending</h2></div>
                <span className="rounded-full text-xs font-bold text-primary-green">Last 6 months</span>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={spendingData} margin={{ top: 12, right: 8, left: -22, bottom: 0 }}>
                        <defs><linearGradient id="financeArea" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-primary-green)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--color-primary-green)" stopOpacity={0.02} /></linearGradient></defs>
                        <CartesianGrid vertical={false} stroke="var(--color-tertiary-green)" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-secondary-color)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-secondary-color)', fontSize: 11 }} tickFormatter={(value) => `₦${value / 1000}k`} />
                        <Tooltip formatter={(value) => [formatNaira(Number(value)), 'Spent']} contentStyle={{ borderRadius: 12, border: '1px solid var(--color-primary-green)', boxShadow: '0 8px 20px rgb(42 133 69 / 12%)' }} />
                        <Area type="monotone" dataKey="amount" stroke="var(--color-primary-green)" strokeWidth={3} fill="url(#financeArea)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
