'use client';

import { useState } from 'react';
import { Artisan, ArtisanServiceEnum } from '@/shared/service/artisan services/types';
import ArtisanCard from '@/app/components/ArtisanCard';
import CustomSelect from '@/app/components/ui/CustomSelect';

export default function FindArtisansPage() {
  // Configured local state array ready for future API ingestion
  const [artisans, setArtisans] = useState<Artisan[]>([
    {
      id: 'art-1',
      name: 'Emeka Nwosu',
      service: ArtisanServiceEnum.PLUMBER,
      rating: 4.8,
      reviewCount: 124,
      location: 'Lekki, Lagos',
      jobsCompleted: 156,
      skills: ['Pipe Installation', 'Leak Repair', 'Water Heater'],
      hourlyRate: 5000,
      isVerified: true
    },
    {
      id: 'art-2',
      name: 'Ibrahim Suleiman',
      service: ArtisanServiceEnum.ELECTRICIAN,
      rating: 4.9,
      reviewCount: 98,
      location: 'Ikeja, Lagos',
      jobsCompleted: 203,
      skills: ['Wiring', 'Solar Installation', 'Generator Repair'],
      hourlyRate: 6000,
      isVerified: true
    },
    {
      id: 'art-3',
      name: 'Blessing Adekunle',
      service: ArtisanServiceEnum.PAINTER,
      rating: 4.7,
      reviewCount: 76,
      location: 'Yaba, Lagos',
      jobsCompleted: 89,
      skills: ['Interior Painting', 'Exterior Painting', 'Wallpaper'],
      hourlyRate: 4500,
      isVerified: true
    },
    {
      id: 'art-4',
      name: 'Tunde Ogunleye',
      service: ArtisanServiceEnum.CARPENTER,
      rating: 4.6,
      reviewCount: 112,
      location: 'Surulere, Lagos',
      jobsCompleted: 142,
      skills: ['Furniture Design', 'Roof Repair', 'Cabinet Installation'],
      hourlyRate: 5500,
      isVerified: true
    }
  ]);

  // Options configuration for CustomSelect instances
  const serviceOptions = ['All Services', 'Plumbers', 'Electricians', 'Painters', 'Carpenters'];
  const sortOptions = ['Highest Rated', 'Most Experienced'];

  // Track the string labels chosen in custom UI dropdown lists
  const [selectedServiceLabel, setSelectedServiceLabel] = useState<string>('All Services');
  const [selectedSortLabel, setSelectedSortLabel] = useState<string>('Highest Rated');
  const [selectedCardId, setSelectedCardId] = useState<string | null>('art-1'); 

  const handleBookNow = (id: string) => {
    setSelectedCardId(id);
    console.log(`Booking request generated for Artisan Reference ID: ${id}`);
  };

  // Filter Logic: Mapping Custom Select UI label to data types
  const filteredArtisans = artisans.filter(artisan => {
    if (selectedServiceLabel === 'All Services') return true;
    if (selectedServiceLabel === 'Plumbers') return artisan.service === ArtisanServiceEnum.PLUMBER;
    if (selectedServiceLabel === 'Electricians') return artisan.service === ArtisanServiceEnum.ELECTRICIAN;
    if (selectedServiceLabel === 'Painters') return artisan.service === ArtisanServiceEnum.PAINTER;
    if (selectedServiceLabel === 'Carpenters') return artisan.service === ArtisanServiceEnum.CARPENTER;
    return true;
  });

  // Sort Logic: Mapping Custom Select UI label to ordering values
  const sortedArtisans = [...filteredArtisans].sort((a, b) => {
    if (selectedSortLabel === 'Highest Rated') return b.rating - a.rating;
    if (selectedSortLabel === 'Most Experienced') return b.jobsCompleted - a.jobsCompleted;
    return 0;
  });

  return (
    <main className="min-h-screen bg-[#FBFCFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        
        {/* Title Headline Blocks */}
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">Find Trusted Artisans</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Connect with verified professionals for your property needs</p>
        </div>

        {/* Cleaned Custom Dropdown Toolbar Container Layout */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2 max-w-md select-none">
          <CustomSelect
            options={serviceOptions}
            selected={selectedServiceLabel}
            onChange={(val) => setSelectedServiceLabel(val)}
            defaultValue="All Services"
            className="sm:w-56"
          />

          <CustomSelect
            options={sortOptions}
            selected={selectedSortLabel}
            onChange={(val) => setSelectedSortLabel(val)}
            defaultValue="Highest Rated"
            className="sm:w-56"
          />
        </div>

        {/* Dynamic Card Dashboard Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {sortedArtisans.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              artisan={artisan}
              isSelected={selectedCardId === artisan.id}
              onBookNow={handleBookNow}
            />
          ))}
        </div>

        {sortedArtisans.length === 0 && (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-3xl bg-white mt-4">
            <p className="text-sm font-bold text-gray-400">No active artisans listed under this filter setup.</p>
          </div>
        )}
      </div>
    </main>
  );
}