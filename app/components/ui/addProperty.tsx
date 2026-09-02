'use client';

import React, { useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaTrashCan, FaRegStar, FaStar, FaTags } from "react-icons/fa6"; 
import { FaTimes, FaCheck, FaPlus } from "react-icons/fa";
import { propertyType } from '@/shared/enums/propertytype';
import { TiHomeOutline } from "react-icons/ti";
import { HiOutlineBuildingOffice2, HiChevronDoubleRight } from "react-icons/hi2";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineEdit, MdOutlineGarage, MdOutlinePayments, MdPool } from "react-icons/md";
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { IoLayersOutline } from "react-icons/io5";
import Image from 'next/image';
import Combobox from './ComboBox';
import { FaAudioDescription } from "react-icons/fa";
import { PiResizeBold } from "react-icons/pi";
import { purposeType } from '../../../shared/enums/purpose.eums';
import { categoryType } from '@/shared/enums/category.enums';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { StructureEnum } from '@/types';
import { AMENITIES_OPTIONS, AmenitiesEnum } from '@/shared/enums/amenities.enums';
import { PaymentFrequencyEnum, paymentFrequencyOptions } from '@/shared/enums/paymentFreqency.enums';
import { FeeTypeEnum } from '@/shared/enums/feeType.enums';
import { CurrencyEnum } from '@/shared/enums/currency.enums';
import { useCreateListingMutation, CreateListingPayload } from '@/shared/service/listing.services';
import { useUploadMediaMutation } from '@/shared/service/media.services'; // Adjusted import path according to your structure
import { MediaType } from '@/shared/enums/media-type.enum'; // Adjusted import path
import { useToast } from './ToastProvider';

// Types & Interfaces
interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MediaItem {
  id: string;
  url: string;
  file: File;
}

interface FormikFormValues extends Omit<CreateListingPayload, 'base_price' | 'bedrooms' | 'bathrooms' | 'toilets' | 'parking_spaces' | 'payment_frequency'> {
  base_price: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  toilets: number | '';
  parking_spaces: number | '';
  payment_frequency: PaymentFrequencyEnum | '';
}

// Hooks
const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
};

// Step Field Mappings for Scoped Validation
const STEP_FIELDS: Record<number, (keyof FormikFormValues)[]> = {
  1: ['title', 'description', 'property_type', 'purpose', 'category'],
  2: ['state', 'lga', 'city', 'street'],
  3: ['currency', 'base_price', 'structure', 'square_meters', 'bedrooms', 'bathrooms', 'toilets', 'parking_spaces', 'payment_frequency'],
  4: ['amenities', 'fees'],
};

const STEP_TITLES = [
  "General Info",
  "Location",
  "Pricing & Layout",
  "Features & Fees"
];

// Complete Validation Schema
const validationSchema = Yup.object({
  title: Yup.string().required('Property Name is required'),
  description: Yup.string().required('Description is required'),
  purpose: Yup.string().required('Purpose is required'),
  city: Yup.string().required('City is required'),
  street: Yup.string().required('Street Name is required'),
  state: Yup.string().required('State selection is required'),
  lga: Yup.string().required('LGA selection is required'),
  currency: Yup.string().required('Currency selection is required'),
  structure: Yup.string().required('Property structure layout is required'),
  square_meters: Yup.string().optional(),
  property_type: Yup.string().required('Property type is required'),
  category: Yup.string().required('Category selection is required'),
  base_price: Yup.number().typeError('Must be a number').positive('Price must be greater than 0').required('Base price is required'),
  bedrooms: Yup.number().typeError('Must be a number').integer('Must be an integer').min(0, 'Cannot be negative').nullable(),
  bathrooms: Yup.number().typeError('Must be a number').integer('Must be an integer').min(0, 'Cannot be negative').nullable(),
  toilets: Yup.number().typeError('Must be a number').integer('Must be an integer').min(0, 'Cannot be negative').nullable(),
  parking_spaces: Yup.number().typeError('Must be a number').integer('Must be an integer').min(0, 'Cannot be negative').nullable().optional(),
});

export default function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const isMounted = useIsMounted();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [animate, setAnimate] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);

  // Multi-step & Animation states
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [createListing, { isLoading: isCreating }] = useCreateListingMutation();
  const [uploadMedia, { isLoading: isUploadingMedia }] = useUploadMediaMutation();
  const { addToast } = useToast();

  const isPending = isCreating || isUploadingMedia;

  const uploadMediaFiles = async (items: MediaItem[]): Promise<string[]> => {
  if (items.length === 0) return [];

  try {
    const uploadPromises = items.map(async (item) => {
      const media_type = item.file.type.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE;
      
      const res = await uploadMedia({
        file: item.file,
        media_type
      }).unwrap();

      return res?.data?.id;
    });

    const results = await Promise.all(uploadPromises);
    // Filter out undefined/null items to ensure a strict string[] return type
    return results.filter((id): id is string => Boolean(id));
  } catch (error) {
    console.error("Media upload error:", error);
    throw new Error("Failed to upload attached property media files.");
  }
};

  const formik = useFormik<FormikFormValues>({
    initialValues: {
      title: '', description: '', purpose: '', property_type: propertyType.residential, category: categoryType.building,
      street: '', city: '', state: '', lga: '', structure: '', currency: 'NGN', base_price: '', amenities: [],
      square_meters: '', bathrooms: '', bedrooms: '', toilets: '', parking_spaces: '', images: [], primary_image_index: 0,
      payment_frequency: '', fees: []
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // 1. Upload media files via RTK query mutation to retrieve real backend UUIDs
        const uploadedImageUuids = await uploadMediaFiles(mediaList);

        // 2. Build payload with uploaded image UUIDs
        const submittedPayload: CreateListingPayload = {
          title: values.title,
          description: values.description,
          purpose: values.purpose,
          property_type: values.property_type,
          category: values.category,
          street: values.street,
          city: values.city,
          state: values.state,
          lga: values.lga,
          structure: values.structure,
          currency: values.currency,
          base_price: Number(values.base_price),
          square_meters: values.square_meters || undefined,
          primary_image_index: Number(values.primary_image_index),
          images: uploadedImageUuids,
          amenities: values.amenities as AmenitiesEnum[],
          fees: values.fees,
          payment_frequency: values.payment_frequency === '' ? undefined : (values.payment_frequency as PaymentFrequencyEnum),
          ...(values.bedrooms !== '' && { bedrooms: Number(values.bedrooms) }),
          ...(values.bathrooms !== '' && { bathrooms: Number(values.bathrooms) }),
          ...(values.toilets !== '' && { toilets: Number(values.toilets) }),
          ...(values.parking_spaces !== '' && { parking_spaces: Number(values.parking_spaces) }),
        };

        await createListing(submittedPayload).unwrap();
        addToast({ title: 'Success', description: 'Property published successfully!', variant: "success", duration: 3000 });
        
        setTimeout(() => { 
          // Memory cleanup
          mediaList.forEach(item => URL.revokeObjectURL(item.url));
          formik.resetForm(); 
          setMediaList([]); 
          setActiveMediaId(null); 
          setCurrentStep(1);
          onClose(); 
        }, 1500);
      } catch (error: unknown) {
        const typedError = error as { data?: { message?: string }; message?: string };
        const errorMessage = typedError?.data?.message || typedError?.message || 'Failed to publish listing.';
        addToast({ title: 'Error', description: errorMessage, variant: "error", duration: 3000 });
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setAnimate(true), 20);
    return () => { clearTimeout(timer); setAnimate(false); };
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const typesOptions = [
    { value: propertyType.residential, label: 'Residential', icon: <TiHomeOutline className="text-base" /> },
    { value: propertyType.commercial, label: 'Commercial', icon: <HiOutlineBuildingOffice2 className="text-base" /> }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const nextMediaItems: MediaItem[] = files.map(file => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), file }));
    setMediaList(prev => {
      const combined = [...prev, ...nextMediaItems];
      if (prev.length === 0 && nextMediaItems.length > 0) { 
        setActiveMediaId(nextMediaItems[0].id); 
        formik.setFieldValue('primary_image_index', 0); 
      }
      return combined;
    });
  };

  const removeMediaItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaList(prev => {
      const targetItem = prev.find(item => item.id === id);
      if (targetItem) {
        URL.revokeObjectURL(targetItem.url);
      }

      const targetIndex = prev.findIndex(item => item.id === id);
      const filtered = prev.filter(item => item.id !== id);
      const currentPrimaryIndex = formik.values.primary_image_index ?? 0;
      
      if (currentPrimaryIndex === targetIndex) { 
        formik.setFieldValue('primary_image_index', 0); 
      } else if (currentPrimaryIndex > targetIndex) { 
        formik.setFieldValue('primary_image_index', currentPrimaryIndex - 1); 
      }
      if (activeMediaId === id) { 
        setActiveMediaId(filtered.length > 0 ? filtered[0].id : null); 
      }
      return filtered;
    });
  };

  const activeMediaItem = mediaList.find(item => item.id === activeMediaId);
  const activeMediaIndex = mediaList.findIndex(item => item.id === activeMediaId);
  const isCurrentlyCover = activeMediaIndex === formik.values.primary_image_index;
  const selectedStateKey = formik.values.state as NigeriaStateEnum;
  const availableLgas = selectedStateKey ? NIGERIA_LGA_MAP[selectedStateKey] : [];

  const handleNextStep = async () => {
    const currentStepFields = STEP_FIELDS[currentStep];
    
    const touchedFields: Record<string, boolean> = {};
    currentStepFields.forEach(field => { touchedFields[field] = true; });
    await formik.setTouched({ ...formik.touched, ...touchedFields });

    const errors = await formik.validateForm();
    const hasCurrentStepErrors = currentStepFields.some(field => Boolean(errors[field]));

    if (hasCurrentStepErrors) return;

    setSlideDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setIsTransitioning(false);
    }, 200);
  };

  const handlePrevStep = () => {
    setSlideDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      setIsTransitioning(false);
    }, 200);
  };

  const addFeeItem = () => {
    const currentFees = formik.values.fees || [];
    formik.setFieldValue('fees', [
      ...currentFees,
      { fee: '', frequency: PaymentFrequencyEnum.QUARTERLY, fee_type: FeeTypeEnum.LEGAL_FEE }
    ]);
  };

  const removeFeeItem = (index: number) => {
    const currentFees = formik.values.fees || [];
    formik.setFieldValue('fees', currentFees.filter((_, i) => i !== index));
  };

  const getFieldErrorClass = (fieldName: keyof FormikFormValues) => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? 'border-rose-500 text-rose-600 bg-rose-50/20' : 'border-gray-300';
  };

  return createPortal(
    <div 
      className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 transition-opacity duration-300 ${animate && isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={isPending ? undefined : onClose}
    >
      <section 
        className={`bg-white w-full max-w-3xl rounded-2xl h-fit max-h-[95vh] sm:h-full sm:max-h-[85vh] shadow-xl border border-gray-100 flex flex-col transform transition-all duration-300 overflow-hidden ${animate && isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className='flex w-full justify-between items-center border-b border-gray-100 px-4 md:px-6 py-4 shrink-0 bg-gray-50/50'>
          <div>
            <h1 className='text-sm sm:text-base font-bold text-gray-800 tracking-wide'>Add New Property</h1>
            <p className="text-[11px] text-gray-400">Step {currentStep} of 4: {STEP_TITLES[currentStep - 1]}</p>
          </div>
          <button type="button" disabled={isPending} onClick={onClose} className='text-gray-400 hover:text-rose-500 cursor-pointer p-1 transition-colors disabled:opacity-50'><FaTimes /></button>
        </div>

        {/* PROGRESS BAR */}
        <div className="px-6 sm:px-12 pt-5 pb-3 shrink-0 bg-white border-b border-gray-50">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary-green -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {[1, 2, 3, 4].map((stepNum) => {
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;

              return (
                <div key={stepNum} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                      isCompleted 
                        ? 'bg-primary-green border-primary-green text-white shadow-md scale-100' 
                        : isActive 
                        ? 'bg-white border-primary-green text-primary-green ring-4 ring-primary-green/20 scale-110 shadow-sm' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <FaCheck className="text-xs" /> : stepNum}
                  </div>
                  <span className={`text-[10px] font-semibold mt-1 hidden sm:block ${isActive ? 'text-primary-green font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    {STEP_TITLES[stepNum - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*,video/*" className="hidden" />

        {/* FORM CONTAINER */}
        <form onSubmit={formik.handleSubmit} className='w-full flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col scrollbar-thin scrollbar-thumb-gray-200 relative'>
          <div 
            className={`w-full transition-all duration-300 transform ${
              isTransitioning 
                ? slideDirection === 'right' 
                  ? '-translate-x-6 opacity-0' 
                  : 'translate-x-6 opacity-0' 
                : 'translate-x-0 opacity-100'
            }`}
          >
            {/* STEP 1: GENERAL INFO */}
            {currentStep === 1 && (
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
                <div className='flex flex-col gap-4 justify-start'>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                    <div className="relative flex w-full bg-gray-100 p-1 rounded-xl border border-gray-200/50 select-none items-center">
                      <div className="absolute top-1 bottom-1 left-1 rounded-lg bg-primary-green shadow-sm transition-all duration-300 ease-out" style={{ width: 'calc(50% - 4px)', transform: formik.values.property_type === propertyType.commercial ? 'translateX(100%)' : 'translateX(0%)' }} />
                      {typesOptions.map((option) => (
                        <button key={option.value} type="button" disabled={isPending} onClick={() => formik.setFieldValue('property_type', option.value)} className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer outline-none ${formik.values.property_type === option.value ? 'text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                          {option.icon} {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Combobox label="Listing Purpose" name="purpose" options={Object.values(purposeType).map(p => ({ label: p, value: p }))} value={formik.values.purpose} onChange={formik.setFieldValue} onBlur={formik.handleBlur} icon={<FaTags />} placeholder="Select Purpose" error={formik.touched.purpose ? formik.errors.purpose : undefined} />
                    <Combobox label="Category" name="category" options={Object.values(categoryType).map(c => ({ label: c, value: c }))} value={formik.values.category} onChange={formik.setFieldValue} onBlur={formik.handleBlur} icon={<IoLayersOutline />} placeholder="Select Category" error={formik.touched.category ? (formik.errors.category as string) : undefined} />
                  </div>

                  <div className="w-full">
                    <label className="text-xs font-semibold mb-1 block">Property Name</label>
                    <div className={`flex items-center border p-2 rounded-xl gap-3 transition-all ${getFieldErrorClass('title')}`}>
                      <MdOutlineEdit className="text-gray-400 shrink-0" />
                      <input type="text" disabled={isPending} {...formik.getFieldProps('title')} placeholder="e.g. Sovereign Luxury Heights" className="w-full text-sm outline-none text-gray-800 bg-transparent" />
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="text-xs font-semibold mb-1 block">Description</label>
                    <div className={`flex items-center border p-2 rounded-xl gap-2 min-h-9.5 transition-all ${getFieldErrorClass('description')}`}>
                      <FaAudioDescription className="text-gray-400 shrink-0" />
                      <input type="text" disabled={isPending} {...formik.getFieldProps('description')} placeholder="Luxurious apartment..." className="w-full text-sm outline-none text-gray-800 bg-transparent" />
                    </div>
                  </div>
                </div>

                {/* Media Uploader Hub */}
                <div className='flex flex-col space-y-3 h-full min-h-55'>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Property Media</label>
                  <div className="relative flex-1 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center group transition-colors hover:border-primary-green/40 min-h-40">
                    {activeMediaItem ? (
                      <div className="w-full h-full relative group">
                        <Image src={activeMediaItem.url} alt="Preview" width={400} height={250} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[10px] font-semibold">
                          {isCurrentlyCover ? <><FaStar className="text-amber-400" /><span>Poster Image</span></> : <><FaRegStar className="text-gray-300" /><span>Secondary Image</span></>}
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          {!isCurrentlyCover && <button type="button" disabled={isPending} onClick={() => formik.setFieldValue('primary_image_index', activeMediaIndex)} className="px-3 py-1.5 bg-primary-green text-white rounded-lg text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"><FaStar /> Set Poster</button>}
                          <button type="button" disabled={isPending} onClick={(e) => removeMediaItem(activeMediaId!, e)} className="p-2.5 bg-white/90 rounded-full text-rose-600 hover:scale-110 active:scale-95 transition-all shadow-md"><FaTrashCan className="text-sm" /></button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" disabled={isPending} onClick={() => fileInputRef.current?.click()} className='w-full h-full flex flex-col justify-center items-center gap-1.5 text-gray-400 hover:text-primary-green transition-colors outline-none py-6'><IoAddCircleOutline className='text-3xl'/><span className='text-xs font-semibold'>Click to upload media</span></button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar min-h-16">
                    {mediaList.map((item, index) => {
                      const isActive = item.id === activeMediaId;
                      const isPoster = index === formik.values.primary_image_index;
                      return (
                        <div key={item.id} onClick={() => !isPending && setActiveMediaId(item.id)} className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all transform hover:scale-105 ${isActive ? 'border-primary-green ring-2 ring-primary-green/20' : isPoster ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-gray-200'}`}>
                          <Image src={item.url} alt="Thumb" fill className="object-cover" />
                          {isPoster && <div className="absolute bottom-0.5 right-0.5 bg-amber-400 text-white p-0.5 rounded-full text-[8px]"><FaStar /></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4 max-w-xl mx-auto py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Combobox label="State" name="state" options={Object.values(NigeriaStateEnum).map(s => ({ label: s, value: s }))} value={formik.values.state} onChange={(n, v) => { formik.setFieldValue(n, v); formik.setFieldValue('lga', ''); }} onBlur={formik.handleBlur} error={formik.touched.state ? formik.errors.state : undefined} />
                  <Combobox label="LGA" name="lga" options={availableLgas.map(l => ({ label: l, value: l }))} value={formik.values.lga} onChange={formik.setFieldValue} onBlur={formik.handleBlur} disabled={!selectedStateKey} error={formik.touched.lga ? formik.errors.lga : undefined} />
                </div>

                <div className="w-full">
                  <label className="text-xs font-semibold mb-1 block">City</label>
                  <div className={`flex items-center border p-2 rounded-xl gap-2 h-9.5 transition-all ${getFieldErrorClass('city')}`}>
                    <CiLocationOn className="text-gray-400 shrink-0" />
                    <input type="text" disabled={isPending} {...formik.getFieldProps('city')} className="w-full text-sm outline-none text-gray-800 bg-transparent" placeholder="e.g. Ikeja" />
                  </div>
                </div>

                <div className="w-full">
                  <label className="text-xs font-semibold mb-1 block">Street Name</label>
                  <div className={`flex items-center border p-2 rounded-xl gap-2 h-9.5 transition-all ${getFieldErrorClass('street')}`}>
                    <CiLocationOn className="text-gray-400 shrink-0" />
                    <input type="text" disabled={isPending} {...formik.getFieldProps('street')} className="w-full text-sm outline-none text-gray-800 bg-transparent" placeholder="e.g. 12 Allen Avenue" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRICING & LAYOUT */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-4 max-w-xl mx-auto py-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <Combobox label="Currency" name="currency" options={Object.values(CurrencyEnum).map(c => ({ label: c, value: c }))} value={formik.values.currency} onChange={formik.setFieldValue} onBlur={formik.handleBlur} error={formik.touched.currency ? formik.errors.currency : undefined} />
                  </div>
                  <div className="col-span-2 w-full">
                    <label className="text-xs font-semibold mb-1 block">Base Price</label>
                    <div className={`flex items-center border p-2 rounded-xl gap-2 h-9.5 transition-all ${getFieldErrorClass('base_price')}`}>
                      <CiMoneyBill className="text-gray-400 shrink-0" />
                      <input type="number" disabled={isPending} {...formik.getFieldProps('base_price')} className="w-full text-sm outline-none text-gray-800 bg-transparent" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Combobox label="Payment Frequency" name="payment_frequency" options={paymentFrequencyOptions} value={formik.values.payment_frequency} onChange={formik.setFieldValue} onBlur={formik.handleBlur} icon={<MdOutlinePayments />} />
                  <Combobox label="Property Structure" name="structure" options={Object.values(StructureEnum).map(str => ({ label: str, value: str }))} value={formik.values.structure} onChange={formik.setFieldValue} onBlur={formik.handleBlur} error={formik.touched.structure ? formik.errors.structure : undefined} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="w-full">
                    <label className="text-xs font-semibold mb-1 block">Size (sqm)</label>
                    <div className="flex items-center border p-2 rounded-xl gap-2 h-9.5 border-gray-300">
                      <PiResizeBold className="text-gray-400 shrink-0" />
                      <input type="text" {...formik.getFieldProps('square_meters')} className="w-full text-sm outline-none bg-transparent" placeholder="e.g. 450" />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-xs font-semibold mb-1 block">Parking Spaces</label>
                    <div className="flex items-center border p-2 rounded-xl gap-2 h-9.5 border-gray-300">
                      <MdOutlineGarage className="text-gray-400 shrink-0" />
                      <input type="number" {...formik.getFieldProps('parking_spaces')} className="w-full text-sm outline-none bg-transparent" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Bedrooms</label>
                    <input type="number" {...formik.getFieldProps('bedrooms')} className={`border rounded-xl p-2 text-xs text-center transition-all ${getFieldErrorClass('bedrooms')}`} placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Baths</label>
                    <input type="number" {...formik.getFieldProps('bathrooms')} className={`border rounded-xl p-2 text-xs text-center transition-all ${getFieldErrorClass('bathrooms')}`} placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Toilets</label>
                    <input type="number" {...formik.getFieldProps('toilets')} className={`border rounded-xl p-2 text-xs text-center transition-all ${getFieldErrorClass('toilets')}`} placeholder="0" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: AMENITIES & FEES */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-6 max-w-xl mx-auto py-2">
                <Combobox label="Property Amenities" name="amenities" options={AMENITIES_OPTIONS} value={formik.values.amenities || []} onChange={formik.setFieldValue} onBlur={formik.handleBlur} icon={<MdPool />} placeholder="Select amenities..." multiSelect={true} creatable={true} />

                {/* Dynamic Fees Section */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Additional Fees & Charges</h3>
                      <p className="text-[11px] text-gray-400">Specify legal, management, or service charge fees</p>
                    </div>
                    <button type="button" onClick={addFeeItem} className="text-xs font-semibold text-primary-green flex items-center gap-1 hover:underline outline-none">
                      <FaPlus className="text-[10px]" /> Add Fee
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formik.values.fees?.map((feeItem, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-2.5 rounded-xl border border-gray-200/60">
                        <div className="col-span-4">
                          <Combobox
                            label=""
                            name={`fees[${idx}].fee_type`}
                            options={Object.values(FeeTypeEnum).map(ft => ({ label: ft, value: ft }))}
                            value={feeItem.fee_type}
                            onChange={(n, v) => formik.setFieldValue(`fees.${idx}.fee_type`, v)}
                            placeholder="Fee Type"
                          />
                        </div>
                        <div className="col-span-4">
                          <input
                            type="number"
                            placeholder="Amount"
                            value={feeItem.fee}
                            onChange={(e) => formik.setFieldValue(`fees.${idx}.fee`, e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-lg p-2 text-xs outline-none bg-white"
                          />
                        </div>
                        <div className="col-span-3">
                          <Combobox
                            label=""
                            name={`fees[${idx}].frequency`}
                            options={paymentFrequencyOptions}
                            value={feeItem.frequency}
                            onChange={(n, v) => formik.setFieldValue(`fees.${idx}.frequency`, v)}
                            placeholder="Frequency"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button type="button" onClick={() => removeFeeItem(idx)} className="text-rose-500 hover:text-rose-700 p-1 text-xs">
                            <FaTrashCan />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!formik.values.fees || formik.values.fees.length === 0) && (
                      <p className="text-xs text-gray-400 italic text-center py-2">No additional fees added.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Modal Controls Footer */}
        <div className="border-t border-gray-100 px-4 md:px-6 py-3.5 shrink-0 bg-gray-50/50 flex justify-between items-center">
          {currentStep > 1 ? (
            <button
              type="button"
              disabled={isPending}
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-all outline-none disabled:opacity-50"
            >
              Back
            </button>
          ) : <div />}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2 bg-primary-green text-white rounded-xl text-xs font-semibold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 outline-none"
            >
              Next Step <HiChevronDoubleRight className="text-xs" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={() => formik.handleSubmit()}
              className="px-6 py-2 bg-primary-green text-white rounded-xl text-xs font-semibold shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5 outline-none disabled:opacity-50"
            >
              {isPending ? 'Publishing...' : 'Publish Listing'}
            </button>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}