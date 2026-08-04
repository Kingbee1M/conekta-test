'use client';

import React from 'react';

export interface PropertyListing {
  uuid: string;
  title: string;
  ref_no: string;
  currency: string;
  base_price: string;
  payment_frequency: string;
  property_info: {
    bedrooms: number;
    bathrooms: number;
    structure: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    lga: string;
    country: string;
  };
  average_rating: number;
  cover_image: string;
  lister: {
    uuid: string;
    email: string;
    full_name: string;
  };
  listing_status: string;
  verification_status: string;
}

interface ListingTableProps {
  listings: PropertyListing[];
}

export default function ListingTable({ listings }: ListingTableProps) {
  const formatPrice = (priceStr: string, currency: string) => {
    const num = parseFloat(priceStr);
    if (isNaN(num)) return `${currency} ${priceStr}`;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getVerificationBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'rejected':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!listings || listings.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 text-xs">
        No property listings found.
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="py-3 px-4">Property</th>
          <th className="py-3 px-4">Ref No</th>
          <th className="py-3 px-4">Price</th>
          <th className="py-3 px-4">Location</th>
          <th className="py-3 px-4">Lister</th>
          <th className="py-3 px-4">Verification</th>
          <th className="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {listings.map((item) => {
          const locStr = [item.location?.city, item.location?.state].filter(Boolean).join(', ') || 'N/A';

          return (
            <tr key={item.uuid} className="hover:bg-gray-50/60 transition-colors">
              {/* Property Title & Image */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 line-clamp-1">{item.title || 'Untitled Property'}</span>
                    <span className="text-[10px] text-gray-400 capitalize">
                      {item.property_info?.structure} • {item.property_info?.bedrooms} Bed
                    </span>
                  </div>
                </div>
              </td>

              {/* Ref No */}
              <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">{item.ref_no || 'N/A'}</td>

              {/* Price */}
              <td className="py-3.5 px-4 font-bold text-gray-900">
                {formatPrice(item.base_price, item.currency)}
                <span className="text-[10px] font-normal text-gray-400 block capitalize">
                  {item.payment_frequency?.replace('_', ' ')}
                </span>
              </td>

              {/* Location */}
              <td className="py-3.5 px-4 text-gray-600">{locStr}</td>

              {/* Lister */}
              <td className="py-3.5 px-4">
                <span className="font-medium text-gray-800 block">{item.lister?.full_name || 'N/A'}</span>
                <span className="text-[10px] text-gray-400 block">{item.lister?.email}</span>
              </td>

              {/* Verification Status */}
              <td className="py-3.5 px-4">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getVerificationBadge(
                    item.verification_status
                  )}`}
                >
                  {item.verification_status || 'Draft'}
                </span>
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right">
                <button className="text-xs font-semibold text-[#00AC72] hover:underline cursor-pointer">
                  Review
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}