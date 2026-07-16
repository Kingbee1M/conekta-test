'use client'

import { useMemo, useState, useEffect } from "react"
import { useDispatch } from "react-redux" // Or your app's dispatch hook
import HomeCarousel from "@/app/components/HomeCarousel"
import HomeSearch from "@/app/components/HomeSearch"
import CustomSelect from "@/app/components/ui/CustomSelect"
import FeaturedHome from "@/app/components/FeaturedHome"
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from "@/shared/enums/nigeriaRegions.enums"
import { StructureEnum } from "@/types"

// Import your query hook!
import { useGetCustomerListingsQuery } from "@/shared/service/customer services/customerListing.services"

export default function Home() {
  const dispatch = useDispatch();

  const [selectedState, setSelectedState] = useState<NigeriaStateEnum | ''>('');
  const [selectedLga, setSelectedLga] = useState<string>('');
  const [selectedType, setSelectedType] = useState<StructureEnum | ''>('');
  const [selectedMaxPrice, setSelectedMaxPrice] = useState<string>('');

  // 1. Fetch the listings (the hook returns the transformed 'message' string as data)
  const { data: message, isLoading } = useGetCustomerListingsQuery();

  // 2. useEffect to dispatch the message when it loads successfully
  useEffect(() => {
    if (message) {
      // Replace this with your exact dispatch action
      dispatch({
        type: 'ui/showNotification', 
        payload: message 
      });
    }
  }, [message, dispatch]);

  // Options configuration
  const stateOptions = useMemo(() => Object.values(NigeriaStateEnum), []);

  const lgaOptions = useMemo(() => {
    if (!selectedState) return [];
    return NIGERIA_LGA_MAP[selectedState] || [];
  }, [selectedState]);

  const propertyTypeOptions = useMemo(() => Object.values(StructureEnum), []);

  const budgetOptions = [
    'Under ₦1,000,000 / yr',
    'Under ₦2,500,000 / yr',
    'Under ₦5,000,000 / yr',
    'Under ₦10,000,000 / yr',
    '₦10,000,000+ / yr'
  ];

  const handleStateChange = (val: string) => {
    setSelectedState(val as NigeriaStateEnum);
    setSelectedLga(''); 
  };

  return (
    <main className="w-full flex flex-col items-center mb-5 gap-7">
      <HomeCarousel />
      <HomeSearch />
      
      {/* Search Filter Strip */}
      <div className="w-9/10 md:w-4/5 grid grid-rows-2 grid-cols-2 md:grid-rows-1 md:grid-cols-4 gap-4">
        {/* STATE */}
        <CustomSelect
          options={stateOptions}
          selected={selectedState}
          onChange={handleStateChange}
          defaultValue="State"
        /> 

        {/* LGA */}
        <CustomSelect
          options={lgaOptions}
          selected={selectedLga}
          onChange={(val) => setSelectedLga(val)}
          defaultValue={selectedState ? "LGA" : "Select State First"}
          className={!selectedState ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}
        /> 

        {/* PROPERTY TYPE */}
        <CustomSelect
          options={propertyTypeOptions}
          selected={selectedType}
          onChange={(val) => setSelectedType(val as StructureEnum)}
          defaultValue="Structure Type"
        /> 

        {/* BUDGET */}
        <CustomSelect
          options={budgetOptions}
          selected={selectedMaxPrice}
          onChange={(val) => setSelectedMaxPrice(val)}
          defaultValue="Budget"
        /> 
      </div>

      {/* Note: Passing empty listings for now as we are 
        only returning the string message from the API.
      */}
      <FeaturedHome listings={[]} isLoading={isLoading} />
    </main>
  );
}