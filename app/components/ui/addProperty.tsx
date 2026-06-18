'use client';

import React, { useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaTrashCan, FaRegStar, FaStar } from "react-icons/fa6"; // 🟢 Added Star icons
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
  city: Yup.string().required('City is required'),
  zip_code: Yup.string().required('zip Code is required'),
  street: Yup.string().required('street Name is required'),
  state: Yup.string().required('State selection is required'),
  lga: Yup.string().required('LGA selection is required'),
  price: Yup.number().typeError('Must be a number').positive('Must be greater than 0').required('Price target is required'),
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

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      city: '',
      zip_code: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      toilets: '',
      amenities: [],
      category: categoryType,
      purpose: purposeType,
      square_meters: '',
      street: '',
      state: '',
      primary_image_index: 0,
      lga: '',
      type: propertyType.residential,
    },
    validationSchema,
    onSubmit: (values) => {
      const submittedPayload = {
        ...values,
        price: Number(values.price),
        bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
        media: mediaList.map(m => m.file),
        created_at: new Date().toISOString(),
      };
      console.log("Saving new property with structured assets:", submittedPayload);
      formik.resetForm();
      setMediaList([]);
      setActiveMediaId(null);
      onClose();
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
        formik.setFieldValue('primary_image_index', 0); // 🟢 Auto-fallback index
      }
      return combined;
    });
  };

  const removeMediaItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setMediaList(prev => {
      const targetIndex = prev.findIndex(item => item.id === id);
      const filtered = prev.filter(item => item.id !== id);
      
      // 🟢 Keep Formik's primary_image_index from breaking if an item is removed
      if (formik.values.primary_image_index === targetIndex) {
        formik.setFieldValue('primary_image_index', 0); // Reset to first item
      } else if (formik.values.primary_image_index > targetIndex) {
        formik.setFieldValue('primary_image_index', formik.values.primary_image_index - 1); // Shift index down
      }

      if (activeMediaId === id) {
        setActiveMediaId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  // 🟢 Helper to pinpoint if an item matches the current cover photo index
  const activeMediaItem = mediaList.find(item => item.id === activeMediaId);
  const activeMediaIndex = mediaList.findIndex(item => item.id === activeMediaId);
  const isCurrentlyCover = activeMediaIndex === formik.values.primary_image_index;

  const selectedStateKey = formik.values.state as NigeriaStateEnum;
  const availableLgas = selectedStateKey ? NIGERIA_LGA_MAP[selectedStateKey] : [];

  return createPortal(
    <div 
      className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 transition-opacity duration-300 ${
        animate && isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
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
          <button type="button" onClick={onClose} className='text-gray-400 hover:text-rose-500 cursor-pointer transition-colors p-1 rounded-lg'><FaTimes /></button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*,video/*" 
          className="hidden" 
        />

        <form onSubmit={formik.handleSubmit} className='w-full flex-1 overflow-y-auto p-6 flex flex-col space-y-5'>
          
          <div className='grid grid-cols-2 gap-2 items-stretch min-h-72.5'>

            {/* LEFT COMPARTMENT ITEMS */}
            <div className='flex flex-col gap-3 justify-between'>

              {/* SLIDER SEGMENTED MATRIX */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Property Type</label>
                <div className="relative flex w-full max-w-xs bg-gray-100 p-1 rounded-xl border border-gray-200/50 select-none">
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
                        onClick={() => formik.setFieldValue('type', option.value)}
                        className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer outline-none ${
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

              {/* PROPERTY NAME FIELD */}
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="title">Property Name</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300'}`}>
                  <MdOutlineEdit />
                  <input type="text" id="title" {...formik.getFieldProps('title')} placeholder="e.g. Sovereign Luxury Heights" className="w-full outline-none" />
                </div>
                {formik.touched.title && formik.errors.title && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.title}</span>}
              </div>

              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="propertyDescription">Description</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'}`}>
                  <FaAudioDescription  />
                  <input type="text" id="propertyDescription" {...formik.getFieldProps('description')} placeholder="e.g. Luxurious apartment with city views" className="w-full outline-none" />
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
                  placeholder="Select or type a custom amenity..."
                  multiSelect={true}
                  creatable={true}
                />
              </div>

            {/* RIGHT COMPARTMENT ITEMS: MEDIA STUDIO HUB */}
            <div className='flex flex-col space-y-3 h-full justify-between'>
              
              {/* Interactive Viewing Canvas Display Window Frame */}
              <div className="relative flex-1 min-h-50 max-h-50 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center group transition-colors hover:border-primary-green/40">
                {activeMediaItem ? (
                  <div className="w-full h-full relative group">
                    <Image 
                      src={activeMediaItem.url} 
                      alt="Selected Property Resource Preview" width={100} height={100}
                      className="w-full h-full object-cover" 
                    />
                    
                    {/* 🟢 Badge indicating if current photo is the cover image */}
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
                      {/* 🟢 Action Button to trigger the state change */}
                      {!isCurrentlyCover && (
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue('primary_image_index', activeMediaIndex)}
                          className="px-3 py-1.5 bg-primary-green text-white rounded-lg text-xs font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <FaStar /> Set as Poster
                        </button>
                      )}
                      
                      <button 
                        type="button"
                        onClick={(e) => removeMediaItem(activeMediaId!, e)}
                        className="p-2.5 bg-white/90 rounded-full text-rose-600 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                      >
                        <FaTrashCan className="text-sm" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className='w-full h-full flex flex-col justify-center items-center gap-1.5 text-gray-400 hover:text-primary-green transition-colors cursor-pointer outline-none'
                  >
                    <IoAddCircleOutline className='text-3xl'/>
                    <span className='text-xs font-semibold tracking-wide'>Drop or click to upload media</span>
                  </button>
                )}
              </div>

              {/* Slider Thumbnails Row List Stream Track */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-h-16">
                {mediaList.map((item, index) => {
                  const isActive = item.id === activeMediaId;
                  const isPoster = index === formik.values.primary_image_index;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveMediaId(item.id)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
                        isActive 
                          ? 'border-primary-green ring-2 ring-primary-green/20' 
                          : isPoster 
                          ? 'border-amber-400 ring-2 ring-amber-400/20' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <Image src={item.url} alt="Thumbnail preview" fill className="w-full h-full object-cover" />
                      
                      {/* 🟢 Miniature star badge overlay on thumbnails layer track */}
                      {isPoster && (
                        <div className="absolute bottom-0.5 right-0.5 bg-amber-400 text-white p-0.5 rounded-full shadow-sm text-[8px]">
                          <FaStar />
                        </div>
                      )}

                      <button
                        type="button"
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
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-0.5 text-gray-400 hover:text-primary-green hover:border-primary-green/50 transition-colors shrink-0 cursor-pointer outline-none"
                >
                  <IoAddCircleOutline className="text-base" />
                  <span className="text-[8px] font-bold uppercase tracking-tight">More</span>
                </button>
              </div>

            </div>
          </div>

          {/* BOTTOM REGION ROWS */}
          <div className="grid grid-cols-2 gap-2 mt-10">
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="city">City</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'}`}>
                <CiLocationOn />
                <input type="text" id="city" {...formik.getFieldProps('city')} placeholder="e.g. Lekki" className="w-full outline-none" />
              </div>
              {formik.touched.city && formik.errors.city && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.city}</span>}
            </div>

            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="zip_code">Zip Code</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.zip_code && formik.errors.zip_code ? 'border-red-500' : 'border-gray-300'}`}>
                <CiLocationOn />
                <input type="text" id="zip_code" {...formik.getFieldProps('zip_code')} placeholder="e.g. 105102" className="w-full outline-none" />
              </div>
              {formik.touched.zip_code && formik.errors.zip_code && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.zip_code}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="price">Valuation Price Target</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300'}`}>
                <CiMoneyBill />
                <input type="number" id="price" {...formik.getFieldProps('price')} placeholder="e.g. 450000" className="w-full outline-none" />
              </div>
              {formik.touched.price && formik.errors.price && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.price}</span>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="bedrooms">Bedrooms</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.bedrooms && formik.errors.bedrooms ? 'border-red-500' : 'border-gray-300'}`}>
                  <IoLayersOutline />
                  <input type="number" id="bedrooms" {...formik.getFieldProps('bedrooms')} placeholder="2" className="w-full outline-none" />
                </div>
                {formik.touched.bedrooms && formik.errors.bedrooms && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.bedrooms}</span>}
              </div>

              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="bathrooms">Baths</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.bathrooms && formik.errors.bathrooms ? 'border-red-500' : 'border-gray-300'}`}>
                  <MdMeetingRoom />
                  <input type="number" id="bathrooms" {...formik.getFieldProps('bathrooms')} placeholder="4" className="w-full outline-none" />
                </div>
                {formik.touched.bathrooms && formik.errors.bathrooms && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.bathrooms}</span>}
              </div>

              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="toilets">Toilets</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.toilets && formik.errors.toilets ? 'border-red-500' : 'border-gray-300'}`}>
                  <TiHomeOutline />
                  <input type="text" id="toilets" {...formik.getFieldProps('toilets')} placeholder="B4" className="w-full outline-none" />
                </div>
                {formik.touched.toilets && formik.errors.toilets && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.toilets}</span>}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="street">Street Name</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.street && formik.errors.street ? 'border-red-500' : 'border-gray-300'}`}>
                <CiLocationOn />
                <input type="text" id="street" {...formik.getFieldProps('street')} placeholder="e.g. 15 Cooper Road" className="w-full outline-none" />
              </div>
              {formik.touched.street && formik.errors.street && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.street}</span>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="state">State</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 bg-white ${formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300'}`}>
                  <CiLocationOn />
                  <select
                    id="state"
                    value={formik.values.state}
                    className="w-full outline-none bg-transparent text-sm cursor-pointer"
                    onChange={(e) => {
                      formik.setFieldValue('state', e.target.value);
                      formik.setFieldValue('lga', ''); 
                    }}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select State</option>
                    {Object.values(NigeriaStateEnum).map((stateName) => (
                      <option key={stateName} value={stateName}>{stateName}</option>
                    ))}
                  </select>
                </div>
                {formik.touched.state && formik.errors.state && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.state}</span>}
              </div>

              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="lga">LGA</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 bg-white ${
                  !selectedStateKey ? 'opacity-50 bg-gray-50' : ''
                } ${formik.touched.lga && formik.errors.lga ? 'border-red-500' : 'border-gray-300'}`}>
                  <CiLocationOn />
                  <select
                    id="lga"
                    {...formik.getFieldProps('lga')}
                    disabled={!selectedStateKey || availableLgas.length === 0}
                    className="w-full outline-none bg-transparent text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!selectedStateKey ? 'Select State first...' : 'Select LGA'}
                    </option>
                    {availableLgas.map((lgaName) => (
                      <option key={lgaName} value={lgaName}>{lgaName}</option>
                    ))}
                  </select>
                </div>
                {formik.touched.lga && formik.errors.lga && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.lga}</span>}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="square_meters">Property Size</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.square_meters && formik.errors.square_meters ? 'border-red-500' : 'border-gray-300'}`}>
                <PiResizeBold />
                <input type="text" id="square_meters" {...formik.getFieldProps('square_meters')} placeholder="e.g. 150" className="w-full outline-none" />
              </div>
              {formik.touched.square_meters && formik.errors.square_meters && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.square_meters}</span>}
            </div>
          </div>

          <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-auto w-full shrink-0">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-primary-green hover:bg-primary-green/90 text-white shadow-md transition-colors cursor-pointer"
            >
              Publish Listing
            </button>
          </div>

        </form>
      </section>
    </div>,
    document.body
  );
}