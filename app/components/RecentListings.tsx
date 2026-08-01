'use client';

import Link from 'next/link';

interface Listing {
  id: string;
  title: string;
  location: string;
  realtor: string;
  price: string;
  status: 'Live' | 'Pending review' | 'Sold';
}

const listings: Listing[] = [
  {
    id: '1',
    title: 'Fully Detached Duplex',
    location: 'Lekki, Lagos',
    realtor: 'John Doe',
    price: '₦90M',
    status: 'Live',
  },
  {
    id: '2',
    title: '3 Bedroom Apartment',
    location: 'Ajah, Lagos',
    realtor: 'Tunde M.',
    price: '₦75.5M',
    status: 'Pending review',
  },
  {
    id: '3',
    title: 'Fully Detached Duplex',
    location: 'Bourdillon, Lagos',
    realtor: 'Chika E.',
    price: '₦100M',
    status: 'Sold',
  },
];

export default function RecentListings() {
  const getBadgeStyle = (status: Listing['status']) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-100 text-emerald-700';
      case 'Pending review':
        return 'bg-amber-100 text-amber-700';
      case 'Sold':
        return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Recent Property Listing</h2>
          <p className="text-xs text-gray-400 mt-0.5">Latest posting across all listers</p>
        </div>
        <Link href="/listings" className="text-xs font-semibold text-gray-700 hover:text-primary-green transition">
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="pb-3">Property</th>
              <th className="pb-3">Realtor</th>
              <th className="pb-3">Price</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs">
            {listings.map((item) => (
              <tr key={item.id} className="group hover:bg-gray-50/50 transition">
                <td className="py-3.5 pr-2">
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-400">{item.location}</p>
                </td>
                <td className="py-3.5 text-gray-600 font-medium">{item.realtor}</td>
                <td className="py-3.5 font-bold text-gray-900">{item.price}</td>
                <td className="py-3.5 text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${getBadgeStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}