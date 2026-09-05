export type PlannedCost = {
    id: string;
    title: string;
    note: string;
    amount: number;
    due: string;
    color: string;
};

export type SavingsView = 'pig' | 'house' | 'bank';

export const spendingData = [
    { month: 'Oct', amount: 42000 },
    { month: 'Nov', amount: 68000 },
    { month: 'Dec', amount: 52000 },
    { month: 'Jan', amount: 94000 },
    { month: 'Feb', amount: 73000 },
    { month: 'Mar', amount: 118000 },
];

export const transactions = [
    { id: 'TX-2403', title: 'Plumbing service', category: 'Home repair', date: 'Mar 18, 2026', amount: 25000, icon: '🔧' },
    { id: 'TX-2402', title: 'Annual rent payment', category: 'Rent', date: 'Mar 04, 2026', amount: 450000, icon: '🏠' },
    { id: 'TX-2401', title: 'Moving service', category: 'Moving', date: 'Feb 24, 2026', amount: 68000, icon: '📦' },
    { id: 'TX-2398', title: 'Electricity token', category: 'Utilities', date: 'Feb 11, 2026', amount: 32000, icon: '⚡' },
];

export const initialPlannedCosts: PlannedCost[] = [
    { id: 'plan-1', title: 'Dining table', note: 'Carpenter for the new apartment', amount: 85000, due: 'Before Apr 12', color: 'bg-tertiary-green' },
    { id: 'plan-2', title: 'Window repair', note: 'Replace the cracked bedroom pane', amount: 24000, due: 'Before Apr 05', color: 'bg-tertiary-green' },
    { id: 'plan-3', title: 'Water bill', note: 'Quarterly utility payment', amount: 18000, due: 'Before Apr 01', color: 'bg-tertiary-green' },
];

export const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;
