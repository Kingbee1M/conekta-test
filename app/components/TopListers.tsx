'use client';

interface Lister {
  id: string;
  rank: string;
  name: string;
  deals: number;
  volume: string;
  percentage: number;
}

const listers: Lister[] = [
  { id: '1', rank: '01', name: 'John Doe', deals: 7, volume: '₦200M', percentage: 85 },
  { id: '2', rank: '02', name: 'Bassey Udo', deals: 5, volume: '₦140M', percentage: 65 },
  { id: '3', rank: '03', name: 'Tunde Matesun', deals: 3, volume: '₦110M', percentage: 45 },
  { id: '4', rank: '04', name: 'Chika Eze', deals: 2, volume: '₦110M', percentage: 35 },
];

export default function TopListers() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Top Listers</h2>
        <p className="text-xs text-gray-400 mt-0.5">By closed deals this month</p>
      </div>

      <div className="flex flex-col gap-4">
        {listers.map((lister) => (
          <div key={lister.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-bold text-[11px]">{lister.rank}</span>
                <div>
                  <p className="font-bold text-gray-900 leading-tight">{lister.name}</p>
                  <p className="text-[10px] text-gray-400">{lister.deals} deals closed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{lister.volume}</p>
                <p className="text-[9px] text-gray-400">Volume</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#00AC72] h-full rounded-full transition-all duration-500"
                style={{ width: `${lister.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}