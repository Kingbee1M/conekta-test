'use client';

import Image, { StaticImageData } from 'next/image';
import { CiLocationOn } from 'react-icons/ci';
import { IoBedOutline } from 'react-icons/io5';
import { PiBathtub } from 'react-icons/pi';
import { FaStar } from 'react-icons/fa';

export interface PropertyData {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  rating: number; // e.g., 7
  price: number;   // e.g., 150000
  imageUrl: StaticImageData;
}

interface PropertyCardProps {
  property: PropertyData;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Format price helper (e.g., 150000 -> ₦150,000)
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <article className="w-full bg-[#f4f4f4] rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md flex flex-col">
      {/* Aspect Ratio container for the image */}
      <div className="relative w-full aspect-[4/3] bg-gray-200">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-w-7xl) 33vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Content Space */}
      <div className="p-5 flex flex-col gap-2.5">
        {/* Title */}
        <h2 className="text-base font-bold text-gray-800 tracking-tight line-clamp-1">
          {property.title}
        </h2>

        {/* Location Row */}
        <div className="flex items-center gap-1 text-gray-600 -ml-0.5">
          <CiLocationOn className="text-lg shrink-0" />
          <span className="text-sm font-medium line-clamp-1">{property.location}</span>
        </div>

        {/* Specs & Rating Grid Row */}
        <div className="flex items-center justify-between text-sm text-gray-700 font-medium mt-0.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <IoBedOutline className="text-lg text-gray-500" />
              <span>{property.beds} {property.beds === 1 ? 'bed' : 'beds'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PiBathtub className="text-lg text-gray-500" />
              <span>{property.baths} {property.baths === 1 ? 'bath' : 'baths'}</span>
            </div>
          </div>

          {/* Rating Block */}
          <div className="flex items-center gap-1">
            <FaStar className="text-orange-500 text-sm" />
            <span className="font-semibold text-gray-800">{property.rating}/10</span>
          </div>
        </div>

        {/* Pricing Segment */}
        <div className="mt-1 text-base font-bold text-gray-900">
          {formattedPrice}
          <span className="text-xs text-gray-500 font-normal">/day</span>
        </div>
      </div>
    </article>
  );
}