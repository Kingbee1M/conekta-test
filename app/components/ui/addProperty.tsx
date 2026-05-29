'use client';

import React, { useEffect, useState, useSyncExternalStore, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaTrashCan } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { propertyType } from '@/shared/enums/propertytype';
import { TiHomeOutline } from "react-icons/ti";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineEdit, MdMeetingRoom } from "react-icons/md";
import { CiLocationOn, CiMoneyBill } from "react-icons/ci";
import { IoLayersOutline } from "react-icons/io5";
import Image from 'next/image';

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

// Validation Schema using Yup
const validationSchema = Yup.object({
  propertyName: Yup.string().required('Property Name is required'),
  address: Yup.string().required('Address is required'),
  city: Yup.string().required('City is required'),
  postalCode: Yup.string().required('Postal Code is required'),
  price: Yup.number().typeError('Must be a number').positive('Must be greater than 0').required('Price target is required'),
  floors: Yup.number().typeError('Must be a number').integer('Must be an integer').nullable(),
  restRoomNo: Yup.number().typeError('Must be a number').integer('Must be an integer').nullable(),
  unitNo: Yup.string().nullable(),
  type: Yup.mixed().oneOf([propertyType.SINGLE_UNIT, propertyType.MULTIPLE_UNIT]).required(),
});

export default function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const isMounted = useIsMounted();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [animate, setAnimate] = useState(false);
  
  // Media states
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [activeMediaId, setActiveMediaId] = useState<string | null>(null);

  // Formik Initializer
  const formik = useFormik({
    initialValues: {
      propertyName: '',
      address: '',
      city: '',
      postalCode: '',
      price: '',
      floors: '',
      restRoomNo: '',
      unitNo: '',
      type: propertyType.SINGLE_UNIT,
    },
    validationSchema,
    onSubmit: (values) => {
      const submittedPayload = {
        ...values,
        price: Number(values.price),
        floors: values.floors ? Number(values.floors) : null,
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
    { value: propertyType.SINGLE_UNIT, label: 'Single Unit', icon: <TiHomeOutline className="text-base" /> },
    { value: propertyType.MULTIPLE_UNIT, label: 'Multi Unit', icon: <HiOutlineBuildingOffice2 className="text-base" /> }
  ];

  // Media Management Controllers
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
      }
      return combined;
    });
  };

  const removeMediaItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaList(prev => {
      const filtered = prev.filter(item => item.id !== id);
      if (activeMediaId === id) {
        setActiveMediaId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const activeMediaItem = mediaList.find(item => item.id === activeMediaId);

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

        {/* Hidden Global Input Trigger for File uploads */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          multiple 
          accept="image/*,video/*" 
          className="hidden" 
        />

        {/* Main Processing Form Context wrapper */}
        <form onSubmit={formik.handleSubmit} className='w-full flex-1 overflow-y-auto p-6 flex flex-col space-y-5'>
          
          {/* ========================================== */}
          {/* FIRST LAYOUT BLOCK ROW: TWO-COLUMN PARTITION */}
          {/* ========================================== */}
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
                      transform: formik.values.type === propertyType.MULTIPLE_UNIT ? 'translateX(100%)' : 'translateX(0%)'
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
                <label className="text-xs font-semibold" htmlFor="propertyName">Property Name</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.propertyName && formik.errors.propertyName ? 'border-red-500' : 'border-gray-300'}`}>
                  <MdOutlineEdit />
                  <input type="text" id="propertyName" {...formik.getFieldProps('propertyName')} placeholder="e.g. Sovereign Luxury Heights" className="w-full outline-none" />
                </div>
                {formik.touched.propertyName && formik.errors.propertyName && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.propertyName}</span>}
              </div>
              
              {/* STREET ADDRESS FIELD */}
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="address">Address</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.address && formik.errors.address ? 'border-red-500' : 'border-gray-300'}`}>
                  <CiLocationOn />
                  <input type="text" id="address" {...formik.getFieldProps('address')} placeholder="e.g. 14 Admiralty Way" className="w-full outline-none" />
                </div>
                {formik.touched.address && formik.errors.address && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.address}</span>}
              </div>

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
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
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
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none min-h-[64px]">
                {mediaList.map((item) => {
                  const isActive = item.id === activeMediaId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveMediaId(item.id)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
                        isActive ? 'border-primary-green ring-2 ring-primary-green/20' : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img src={item.url} alt="Thumbnail preview" className="w-full h-full object-cover" />
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

                {/* Always-Visible Appending Square Capsule Trigger */}
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

          {/* ========================================== */}
          {/* BOTTOM REGION ROWS: NATURAL FLUID WRAPPERS */}
          {/* ========================================== */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* CITY FIELD */}
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="city">City</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.city && formik.errors.city ? 'border-red-500' : 'border-gray-300'}`}>
                <CiLocationOn />
                <input type="text" id="city" {...formik.getFieldProps('city')} placeholder="e.g. Lekki" className="w-full outline-none" />
              </div>
              {formik.touched.city && formik.errors.city && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.city}</span>}
            </div>

            {/* POSTAL CODE FIELD */}
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="postalCode">Postal Code</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.postalCode && formik.errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}>
                <CiLocationOn />
                <input type="text" id="postalCode" {...formik.getFieldProps('postalCode')} placeholder="e.g. 105102" className="w-full outline-none" />
              </div>
              {formik.touched.postalCode && formik.errors.postalCode && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.postalCode}</span>}
            </div>

          </div>

          <div className="grid grid-cols-2 gap-2">

            {/* FINANCIAL TARGET TARGETING INPUT */}
            <div className="outerDiv mb-4 w-full">
              <label className="text-xs font-semibold" htmlFor="price">Valuation Price Target ($)</label>
              <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.price && formik.errors.price ? 'border-red-500' : 'border-gray-300'}`}>
                <CiMoneyBill />
                <input type="number" id="price" {...formik.getFieldProps('price')} placeholder="e.g. 450000" className="w-full outline-none" />
              </div>
              {formik.touched.price && formik.errors.price && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.price}</span>}
            </div>

            {/* INTERNAL STRUCTURAL DESIGN DATA SPECS SUB-GRID (Floors, Restrooms, Units) */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* TOTAL FLOORS */}
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="floors">Floors</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.floors && formik.errors.floors ? 'border-red-500' : 'border-gray-300'}`}>
                  <IoLayersOutline />
                  <input type="number" id="floors" {...formik.getFieldProps('floors')} placeholder="2" className="w-full outline-none" />
                </div>
                {formik.touched.floors && formik.errors.floors && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.floors}</span>}
              </div>

              {/* RESTROOMS */}
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="restRoomNo">Baths</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.restRoomNo && formik.errors.restRoomNo ? 'border-red-500' : 'border-gray-300'}`}>
                  <MdMeetingRoom />
                  <input type="number" id="restRoomNo" {...formik.getFieldProps('restRoomNo')} placeholder="4" className="w-full outline-none" />
                </div>
                {formik.touched.restRoomNo && formik.errors.restRoomNo && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.restRoomNo}</span>}
              </div>

              {/* UNIT NUMBER */}
              <div className="outerDiv mb-4 w-full">
                <label className="text-xs font-semibold" htmlFor="unitNo">Unit No.</label>
                <div className={`inputDiv flex items-center border p-2 rounded gap-2 ${formik.touched.unitNo && formik.errors.unitNo ? 'border-red-500' : 'border-gray-300'}`}>
                  <TiHomeOutline />
                  <input type="text" id="unitNo" {...formik.getFieldProps('unitNo')} placeholder="B4" className="w-full outline-none" />
                </div>
                {formik.touched.unitNo && formik.errors.unitNo && <span className="text-[10px] text-red-500 mt-1 block">{formik.errors.unitNo}</span>}
              </div>

            </div>

          </div>

          {/* Form Actions Footer Panel Row */}
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