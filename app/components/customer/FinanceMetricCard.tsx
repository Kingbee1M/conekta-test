import type { ReactNode } from 'react';

type Props = {
    label: string;
    value: string;
    detail: string;
    icon: ReactNode;
    tone: 'green' | 'orange' | 'blue' | 'purple';
};

export default function FinanceMetricCard({ label, value, detail, icon, tone }: Props) {
    const tones = {
        green: 'bg-tertiary-green text-primary-green',
        orange: 'bg-tertiary-green text-secondary-green',
        blue: 'bg-tertiary-green text-primary-green',
        purple: 'bg-tertiary-green text-secondary-green',
    };

    return (
        <div className="rounded-2xl border border-primary-green/20 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary-color">{label}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</span>
            </div>
            <p className="text-xl font-extrabold text-text-primary">{value}</p>
            <p className="mt-1 text-[11px] text-secondary-color">{detail}</p>
        </div>
    );
}
