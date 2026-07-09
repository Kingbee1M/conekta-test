'use client';

import React, { useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaTrashCan, FaRegStar, FaStar, FaTags } from "react-icons/fa6"; 
import { FaTimes } from "react-icons/fa";
import { propertyType } from '@/shared/enums/propertytype';
import { TiHomeOutline } from "react-icons/ti";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineEdit, MdMeetingRoom } from "react-icons/md";
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { IoLayersOutline } from "react-icons/io5";
import Image from 'next/image';
import Combobox from './ComboBox';
import { MdPool } from "react-icons/md";
import { FaAudioDescription } from "react-icons/fa";
import { PiResizeBold } from "react-icons/pi";
import { purposeType } from '../../../shared/enums/purpose.eums';
import { categoryType } from '@/shared/enums/category.enums';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { StructureEnum } from '@/types';
import { CurrencyEnum } from '@/shared/enums/currency.enums';
import { useCreateListingMutation } from '@/shared/service/listing.services';
import { useToast } from './ToastProvider';
import { CreateListingPayload } from '@/shared/service/listing.services';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MediaItem {
  id: string;
  url: string;
  file: File;
}

const emptySubscribe = () => () => {};
const useIsMounted = () => {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
};

const validationSchema = Yup.object({
  title: Yup.string().required('Property Name is required'),
  description: Yup.string().required('Description is required'),
  purpose: Yup.mixed<purposeType>().oneOf(Object.values(purposeType)).required('Purpose is required'),
  city: Yup.string().required('City is required'),
  zip_code: Yup.string().required('Zip Code is required'),
  street: Yup.string().required('Street Name is required'),
  state: Yup.string().required('State selection is required'),
  lga: Yup.string().required('LGA selection is required'),
  currency: Yup.mixed<CurrencyEnum>().oneOf(Object.values(CurrencyEnum)).required('Currency selection is required'),
  price: Yup.number().typeError('Must be a number').positive('Must be greater than 0').required('Price target is required'),
  structure: Yup.mixed<StructureEnum>().oneOf(Object.values(StructureEnum)).required('Property structure layout is required'),
  bedrooms: Yup.number().typeError('Must be a number').integer('Must be an integer').nullable(),
  bathrooms: Yup.number().typeError('Must be a number').integer('Must be an integer').nullable(),
  toilets: Yup.string().nullable(),
  square_meters: Yup.string().required('Property Size is required'),
  type: Yup.mixed().oneOf([propertyType.commercial, propertyType.residential]).required(),
});

export default function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const isMounted = useIsMounted();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [animate, setAnimate] = useState(false);
  
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);

  const [createListing, { isLoading: isPending }] = useCreateListingMutation();
  const { addToast } = useToast();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      city: '',
      zip_code: '',
      currency: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      toilets: '',
      amenities: [],
      category: categoryType.building, 
      purpose: '', 
      structure: '',
      square_meters: '',
      street: '',
      state: '',
      primary_image_index: 0,
      lga: '',
      type: propertyType.residential,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const submittedPayload: CreateListingPayload = {
          title: values.title,
          description: values.description,
          category: values.category,
          street: values.street,
          city: values.city,
          zip_code: values.zip_code,
          state: values.state,
          lga: values.lga,
          structure: values.structure,
          currency: values.currency,
          square_meters: values.square_meters,
          primary_image_index: Number(values.primary_image_index),
          images: mediaList.map(m => m.url),
          payment_options: [{ price: Number(values.price) }],
          purpose: values.purpose.toLowerCase() as purposeType,
          property_type: values.type.toLowerCase() as propertyType,
          ...(values.bedrooms && { bedrooms: Number(values.bedrooms) }),
          ...(values.bathrooms && { bathrooms: Number(values.bathrooms) }),
          ...(values.toilets && { toilets: Number(values.toilets) }),
        };
        console.log("Submitting listing payload:", submittedPayload);

        await createListing(submittedPayload).unwrap();
        addToast({ title: 'Success', description: 'Property published successfully!', variant: "success", duration: 3000 });

        setTimeout(() => {
          formik.resetForm();
          setMediaList([]);
          setActiveMediaId(null);
          onClose();
        }, 1500);

      } catch (error: unknown) {
        console.error("Mutation failure metadata tracking:", error);
        const typedError = error as { data?: { message?: string } };
        const errorMessage = typedError?.data?.message || 'Failed to publish listing. Please check your data fields.';
        addToast({ title: 'Error', description: errorMessage, variant: "error", duration: 3000 });
      }
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => setAnimate(true), 20);
    return () => {
      clearTimeout(timer);
      setAnimate(false); 
    };
  }, [isOpen]);

  if (!isOpen || !isMounted) return null;

  const typesOptions = [
    { value: propertyType.residential, label: 'Residential', icon: <TiHomeOutline className="text-base" /> },
    { value: propertyType.commercial, label: 'Commercial', icon: <HiOutlineBuildingOffice2 className="text-base" /> }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const nextMediaItems: MediaItem[] = files.map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file
    }));

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
      const targetIndex = prev.findIndex(item => item.id === id);
      const filtered = prev.filter(item => item.id !== id);
      
      if (formik.values.primary_image_index === targetIndex) {
        formik.setFieldValue('primary_image_index', 0); 
      } else if (formik.values.primary_image_index > targetIndex) {
        formik.setFieldValue('primary_image_index', formik.values.primary_image_index - 1); 
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

  return createPortal(
    <div 
      className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        animate && isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={isPending ? undefined : onClose}
    >
      <section 
        className={`bg-white w-full max-w-4xl rounded-2xl h-full max-h-[90vh] shadow-xl border border-gray-100 flex flex-col transform transition-all duration-300 overflow-hidden ${
          animate && isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className='flex w-full justify-between items-center border-b border-gray-100 px-6 py-4 shrink-0 bg-gray-50/50'>
          <h1 className='text-sm font-bold text-gray-800 tracking-wide'>Add New Property</h1>
          <button 
            type="button" 
            disabled={isPending}
            onClick={onClose} 
            className='text-gray-400 hover:text-rose-500 cursor-pointer transition-colors p-1 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <FaTimes />
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*,video/*" 
          className="hidden" 
        />

        <form onSubmit={formik.handleSubmit} className='w-full flex-1 overflow-y-auto p-6 flex flex-col space-y-6'>
          
          {/* TOP SECTION: META INFO & MEDIA UPLOADER */}
          <div className='grid grid-cols-2 gap-6 items-stretch'>

            {/* LEFT COMPARTMENT ITEMS */}
            {/* 🔴 FIXED: Changed from justify-between to gap-4 with full vertical expansion capability */}
            <div className='flex flex-col gap-4 justify-start'>

              {/* TOGGLES ROW: TYPE & PURPOSE */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                <div className="relative flex w-full bg-gray-100 p-1 rounded-xl border border-gray-200/50 select-none h-[38px] items-center">
                  <div 
                    className="absolute top-1 bottom-1 left-1 rounded-lg bg-primary-green shadow-sm transition-all duration-300 ease-out"
                    style={{
                      width: 'calc(50% - 4px)',
                      transform: formik.values.type === propertyType.commercial ? 'translateX(100%)' : 'translateX(0%)'
                    }}
                  />
                  {typesOptions.map((option) => {
                    const isSelected = formik.values.type === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={isPending}
                        onClick={() => formik.setFieldValue('type', option.value)}
                        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer outline-none ${
                          isSelected ? 'text-white' : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {option.icon}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Combobox
                label="Listing Purpose"
                name="purpose"
                options={Object.values(purposeType).map(p => ({ label: p, value: p }))}
                value={formik.values.purpose}
                onChange={formik.setFieldValue}
                onBlur={formik.handleBlur}
                icon={<FaTags />}
                placeholder="Select Purpose"
                error={formik.touched.purpose ? formik.errors.purpose : undefined}
              />

              {/* PROPERTY NAME FIELD */}
              <div className="outerDiv w-full">
                <label className="text-xs font-semibold mb-1 block" htmlFor="title">Property Name</label>
                <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300'}`}>
                  <MdOutlineEdit className="text-gray-400" />
                  <input type="text" id="title" disabled={isPending} {...formik.getFieldProps('title')} placeholder="e.g. Sovereign Luxury Heights" className="w-full text-sm outline-none text-gray-800" />
                </div>
                {formik.touched.title && formik.errors.title && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.title}</span>}
              </div>

              {/* DESCRIPTION FIELD */}
              <div className="outerDiv w-full">
                <label className="text-xs font-semibold mb-1 block" htmlFor="propertyDescription">Description</label>
                <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'}`}>
                  <FaAudioDescription className="text-gray-400" />
                  <input type="text" id="propertyDescription" disabled={isPending} {...formik.getFieldProps('description')} placeholder="e.g. Luxurious apartment with city views" className="w-full text-sm outline-none text-gray-800" />
                </div>
                {formik.touched.description && formik.errors.description && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.description}</span>}
              </div>
              
              <Combobox
                label="Property Amenities"
                name="amenities"
                options={[
                  { label: 'Swimming Pool', value: 'pool' },
                  { label: '24/7 Electricity', value: 'power' },
                  { label: 'Gymnasium', value: 'gym' },
                ]}
                value={formik.values.amenities}
                onChange={formik.setFieldValue}
                onBlur={formik.handleBlur}
                icon={<MdPool />}
                placeholder="Select or type custom amenities..."
                multiSelect={true}
                creatable={true}
              />
            </div>

            {/* RIGHT COMPARTMENT ITEMS: MEDIA HUB */}
            <div className='flex flex-col space-y-3 h-full justify-between'>
              <div className="relative flex-1 min-h-[250px] border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center group transition-colors hover:border-primary-green/40">
                {activeMediaItem ? (
                  <div className="w-full h-full relative group">
                    <Image 
                      src={activeMediaItem.url} 
                      alt="Selected Property Resource Preview" width={400} height={250}
                      className="w-full h-full object-cover" 
                    />
                    
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[10px] font-semibold">
                      {isCurrentlyCover ? (
                        <>
                          <FaStar className="text-amber-400" />
                          <span>Poster Image</span>
                        </>
                      ) : (
                        <>
                          <FaRegStar className="text-gray-300" />
                          <span>Secondary Image</span>
                        </>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      {!isCurrentlyCover && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => formik.setFieldValue('primary_image_index', activeMediaIndex)}
                          className="px-3 py-1.5 bg-primary-green text-white rounded-lg text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <FaStar /> Set as Poster
                        </button>
                      )}
                      
                      <button 
                        type="button"
                        disabled={isPending}
                        onClick={(e) => removeMediaItem(activeMediaId!, e)}
                        className="p-2.5 bg-white/90 rounded-full text-rose-600 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        <FaTrashCan className="text-sm" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    disabled={isPending}
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full h-full flex flex-col justify-center items-center gap-1.5 text-gray-400 hover:text-primary-green transition-colors cursor-pointer outline-none disabled:opacity-50'
                  >
                    <IoAddCircleOutline className='text-3xl'/>
                    <span className='text-xs font-semibold tracking-wide'>Drop or click to upload media</span>
                  </button>
                )}
              </div>

              {/* Slider Thumbnails Track */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-h-[64px]">
                {mediaList.map((item, index) => {
                  const isActive = item.id === activeMediaId;
                  const isPoster = index === formik.values.primary_image_index;
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isPending && setActiveMediaId(item.id)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
                        isActive 
                          ? 'border-primary-green ring-2 ring-primary-green/20' 
                          : isPoster 
                          ? 'border-amber-400 ring-2 ring-amber-400/20' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image src={item.url} alt="Thumbnail preview" fill className="w-full h-full object-cover" />
                      
                      {isPoster && (
                        <div className="absolute bottom-0.5 right-0.5 bg-amber-400 text-white p-0.5 rounded-full shadow-sm text-[8px]">
                          <FaStar />
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={isPending}
                        onClick={(e) => removeMediaItem(item.id, e)}
                        className="absolute -top-1 -right-1 p-0.5 bg-rose-600 rounded-full text-white opacity-0 hover:scale-110 transition-opacity absolute-delete shadow-sm"
                        style={{ opacity: 'inherit' }}
                      >
                        <FaTimes className="text-[8px]" />
                      </button>
                    </div>
                  );
                })}

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-primary-green hover:border-primary-green/50 transition-colors shrink-0 cursor-pointer outline-none"
                >
                  <IoAddCircleOutline className="text-base" />
                  <span className="text-[8px] font-bold uppercase tracking-tight">More</span>
                </button>
              </div>
            </div>
          </div>

          {/* LOWER FORM MATRIX BLOCK */}
          <div className="flex flex-col gap-5">
            
            {/* ROW 1: CITY & ZIP CODE */}
            <div className="grid grid-cols-2 gap-4">
              <div className="outerDiv w-full">
                <label className="text-xs font-semibold mb-1 block" htmlFor="city">City</label>
                <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'}`}>
                  <CiLocationOn className="text-gray-400" />
                  <input type="text" id="city" disabled={isPending} {...formik.getFieldProps('city')} placeholder="e.g. Lekki" className="w-full text-sm outline-none text-gray-800" />
                </div>
                {formik.touched.city && formik.errors.city && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.city}</span>}
              </div>

              <div className="outerDiv w-full">
                <label className="text-xs font-semibold mb-1 block" htmlFor="zip_code">Zip Code</label>
                <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.zip_code && formik.errors.zip_code ? 'border-red-500' : 'border-gray-300'}`}>
                  <CiLocationOn className="text-gray-400" />
                  <input type="text" id="zip_code" disabled={isPending} {...formik.getFieldProps('zip_code')} placeholder="e.g. 105102" className="w-full text-sm outline-none text-gray-800" />
                </div>
                {formik.touched.zip_code && formik.errors.zip_code && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.zip_code}</span>}
              </div>
            </div>

            {/* ROW 2: CURRENCY & VALUATION */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <Combobox
                    label="Currency"
                    name="currency"
                    options={Object.values(CurrencyEnum).map(c => ({ label: c, value: c }))}
                    value={formik.values.currency}
                    onChange={formik.setFieldValue}
                    onBlur={formik.handleBlur}
                    placeholder="Code"
                    error={formik.touched.currency ? formik.errors.currency : undefined}
                  />
                </div>

                <div className="outerDiv col-span-2 w-full">
                  <label className="text-xs font-semibold mb-1 block" htmlFor="price">Valuation Price Target</label>
                  <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300'}`}>
                    <CiMoneyBill className="text-gray-400" />
                    <input type="number" id="price" disabled={isPending} {...formik.getFieldProps('price')} placeholder="e.g. 450000" className="w-full text-sm outline-none text-gray-800" />
                  </div>
                  {formik.touched.price && formik.errors.price && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.price}</span>}
                </div>
              </div>

              {/* ROOMS STRUCTURAL MATRIX UNIT */}
              <div className="grid grid-cols-3 gap-3">
                <div className="outerDiv w-full">
                  <label className="text-xs font-semibold mb-1 block" htmlFor="bedrooms">Bedrooms</label>
                  <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.bedrooms && formik.errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}>
                    <IoLayersOutline className="text-gray-400" />
                    <input type="number" id="bedrooms" disabled={isPending} {...formik.getFieldProps('bedrooms')} placeholder="2" className="w-full text-sm outline-none text-gray-800" />
                  </div>
                  {formik.touched.bedrooms && formik.errors.bedrooms && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.bedrooms}</span>}
                </div>

                <div className="outerDiv w-full">
                  <label className="text-xs font-semibold mb-1 block" htmlFor="bathrooms">Baths</label>
                  <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.bathrooms && formik.errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}>
                    <MdMeetingRoom className="text-gray-400" />
                    <input type="number" id="bathrooms" disabled={isPending} {...formik.getFieldProps('bathrooms')} placeholder="4" className="w-full text-sm outline-none text-gray-800" />
                  </div>
                  {formik.touched.bathrooms && formik.errors.bathrooms && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.bathrooms}</span>}
                </div>

                <div className="outerDiv w-full">
                  <label className="text-xs font-semibold mb-1 block" htmlFor="toilets">Toilets</label>
                  <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.toilets && formik.errors.toilets ? 'border-red-500' : 'border-gray-300'}`}>
                    <TiHomeOutline className="text-gray-400" />
                    <input type="text" id="toilets" disabled={isPending} {...formik.getFieldProps('toilets')} placeholder="4" className="w-full text-sm outline-none text-gray-800" />
                  </div>
                  {formik.touched.toilets && formik.errors.toilets && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.toilets}</span>}
                </div>
              </div>
            </div>

            {/* ROW 3: STREET NAME & REGIONAL PLACEMENT (STATE / LGA) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="outerDiv w-full">
                <label className="text-xs font-semibold mb-1 block" htmlFor="street">Street Name</label>
                <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.street && formik.errors.street ? 'border-red-500' : 'border-gray-300'}`}>
                  <CiLocationOn className="text-gray-400" />
                  <input type="text" id="street" disabled={isPending} {...formik.getFieldProps('street')} placeholder="e.g. 15 Cooper Road" className="w-full text-sm outline-none text-gray-800" />
                </div>
                {formik.touched.street && formik.errors.street && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.street}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Combobox
                  label="State"
                  name="state"
                  options={Object.values(NigeriaStateEnum).map(s => ({ label: s, value: s }))}
                  value={formik.values.state}
                  onChange={(name, value) => {
                    formik.setFieldValue(name, value);
                    formik.setFieldValue('lga', ''); 
                  }}
                  onBlur={formik.handleBlur}
                  icon={<CiLocationOn />}
                  placeholder="Select State"
                  error={formik.touched.state ? formik.errors.state : undefined}
                />

                <Combobox
                  label="LGA"
                  name="lga"
                  options={availableLgas.map(l => ({ label: l, value: l }))}
                  value={formik.values.lga}
                  onChange={formik.setFieldValue}
                  onBlur={formik.handleBlur}
                  icon={<CiLocationOn />}
                  placeholder={!selectedStateKey ? "Choose State First" : "Select LGA"}
                  disabled={isPending || !selectedStateKey || availableLgas.length === 0}
                  error={formik.touched.lga ? formik.errors.lga : undefined}
                />
              </div>
            </div>

            {/* ROW 4: PROPERTY STRUCTURE LAYOUT & PROPERTY SIZE */}
            <div className="grid grid-cols-2 gap-4">
              <Combobox
                label="Property Structure"
                name="structure"
                options={Object.values(StructureEnum).map(str => ({ label: str, value: str }))}
                value={formik.values.structure}
                onChange={formik.setFieldValue}
                onBlur={formik.handleBlur}
                icon={<IoLayersOutline />}
                placeholder="Select Layout Structure"
                error={formik.touched.structure ? formik.errors.structure : undefined}
              />

              <div className="outerDiv w-full">
                <label className="text-xs font-semibold mb-1 block" htmlFor="square_meters">Property Size (sqm)</label>
                <div className={`inputDiv flex items-center border p-2 rounded-xl gap-2 h-[38px] ${formik.touched.square_meters && formik.errors.square_meters ? 'border-red-500' : 'border-gray-300'}`}>
                  <PiResizeBold className="text-gray-400" />
                  <input type="text" id="square_meters" disabled={isPending} {...formik.getFieldProps('square_meters')} placeholder="e.g. 150" className="w-full text-sm outline-none text-gray-800" />
                </div>
                {formik.touched.square_meters && formik.errors.square_meters && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.square_meters}</span>}
              </div>
            </div>

          </div>

          {/* ACTION BUTTON FOOTER */}
          <div className="flex space-x-3 pt-4 border-t border-gray-100 mt-auto w-full shrink-0">
            <button 
              type="button" 
              disabled={isPending}
              onClick={onClose} 
              className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-primary-green hover:bg-primary-green/90 text-white shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>

        </form>
      </section>
    </div>,
    document.body
  );
}