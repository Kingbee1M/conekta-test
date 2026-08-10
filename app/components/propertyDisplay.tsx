'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CiLocationOn } from 'react-icons/ci';
import { IoBedOutline } from 'react-icons/io5';
import { PiBathtub } from 'react-icons/pi';
import { FaStar } from 'react-icons/fa';
import { PropertyData } from '@/types';

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
    <motion.article 
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="w-full max-w-sm bg-[#f4f4f4] rounded-xl overflow-hidden border border-gray-200/80 shadow-sm transition-shadow hover:shadow-md flex flex-col cursor-pointer"
    >
      {/* Scaled-down aspect ratio (16:9) & slight top lift on hover */}
      <div className="relative w-full aspect-video bg-gray-200 overflow-hidden">
        <motion.div
          variants={{
            rest: { y: 0, scale: 1 },
            hover: { y: -6, scale: 1.04 },
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </motion.div>
      </div>

      {/* Slimmed-down content space (p-3 flex gap-1.5) */}
      <div className="p-3.5 flex flex-col gap-2">
        {/* Title & Address Row (Address pushed right) */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-gray-800 tracking-tight truncate flex-1">
            {property.title}
          </h2>

          <div className="flex items-center gap-0.5 text-gray-500 shrink-0 text-xs">
            <CiLocationOn className="text-sm shrink-0 text-gray-600" />
            <span className="font-medium truncate max-w-[110px] text-right">
              {property.location}
            </span>
          </div>
        </div>

        {/* Specs, Rating & Price Bottom Row */}
        <div className="flex items-center justify-between text-xs text-gray-700 font-medium pt-1 border-t border-gray-200/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <IoBedOutline className="text-sm text-gray-500" />
              <span>{property.beds}</span>
            </div>
            <div className="flex items-center gap-1">
              <PiBathtub className="text-sm text-gray-500" />
              <span>{property.baths}</span>
            </div>
            <div className="flex items-center gap-1 ml-1">
              <FaStar className="text-amber-500 text-xs" />
              <span className="font-semibold text-gray-800">{property.rating}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-xs font-bold text-gray-900">
            {formattedPrice}
            <span className="text-[10px] text-gray-500 font-normal">/day</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}