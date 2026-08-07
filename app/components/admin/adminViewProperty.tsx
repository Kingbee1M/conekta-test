'use client';

import { useEffect, useState, useSyncExternalStore, ChangeEvent, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchAdminPropertyByUuid, 
  clearSelectedAdminProperty 
} from '@/shared/store/adminListingSlice';
import { EmployeeListingDetail } from '@/shared/service/admin/types/listingTypes';
import { 
  LuX, 
  LuBuilding, 
  LuMapPin, 
  LuBed, 
  LuBath, 
  LuStar, 
  LuPencil, 
  LuSave, 
  LuArrowLeft,
  LuUser,
  LuCheckCheck,
  LuClock,
  LuDollarSign,
  LuSparkles,
  LuMessageSquare,
  LuCalendar,
  LuImage,
  LuVideo,
  LuShieldCheck
} from 'react-icons/lu';

interface AdminViewPropertyPortalProps {
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function AdminViewPropertyPortal({ uuid, isOpen, onClose }: AdminViewPropertyPortalProps) {
  const dispatch = useAppDispatch();
  const isClient = useIsClient();
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMediaIdx, setSelectedMediaIdx] = useState<number>(0);

  // Retrieve single property state from Redux
  const { selectedProperty, singleLoading, singleError } = useAppSelector(
    (state) => state.adminListing
  );

  // Form state fully covering EmployeeListingDetail
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: '',
    base_price: '',
    payment_frequency: '',
    listing_status: '',
    verification_status: '',
    bedrooms: 0,
    bathrooms: 0,
    structure: '',
    street: '',
    city: '',
    state: '',
    lga: '',
    country: '',
  });

  // Hydrate form data asynchronously
  useEffect(() => {
    if (selectedProperty) {
      queueMicrotask(() => {
        setFormData({
          title: selectedProperty.title || '',
          description: selectedProperty.description || '',
          purpose: selectedProperty.purpose || '',
          base_price: selectedProperty.base_price || '',
          payment_frequency: selectedProperty.payment_frequency || '',
          listing_status: selectedProperty.listing_status || '',
          verification_status: selectedProperty.verification_status || '',
          bedrooms: selectedProperty.property_info?.bedrooms || 0,
          bathrooms: selectedProperty.property_info?.bathrooms || 0,
          structure: selectedProperty.property_info?.structure || '',
          street: selectedProperty.location?.street || '',
          city: selectedProperty.location?.city || '',
          state: selectedProperty.location?.state || '',
          lga: selectedProperty.location?.lga || '',
          country: selectedProperty.location?.country || '',
        });
      });
    }
  }, [selectedProperty]);

  // Handle slide-in animations & Redux data dispatch
  useEffect(() => {
    let animFrameId: number;

    if (isOpen) {
      if (uuid) {
        dispatch(fetchAdminPropertyByUuid(uuid));
      }
      animFrameId = requestAnimationFrame(() => setAnimate(true));
    } else {
      animFrameId = requestAnimationFrame(() => {
        setAnimate(false);
        setIsEditing(false);
        setSelectedMediaIdx(0);
      });
      dispatch(clearSelectedAdminProperty());
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [dispatch, isOpen, uuid]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSaveSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (!isClient || !isOpen) return null;

  const property: EmployeeListingDetail | null = selectedProperty;

  // Media handling (sorted by sort_order or primary status)
  const sortedMedia = property?.media 
    ? [...property.media].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order)
    : [];
  const currentMedia = sortedMedia[selectedMediaIdx] || sortedMedia[0];

  const portalContent = (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-md transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-in-out ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Property Overview
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEditing ? 'Edit Property Details' : property?.title || 'Property Record'}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && property && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <LuPencil size={13} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <LuX size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {singleLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green" />
              <p className="text-xs font-medium text-slate-400">Fetching record details...</p>
            </div>
          ) : singleError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs text-center">
              {singleError}
            </div>
          ) : property ? (
            isEditing ? (
              /* --- EDIT FORM MODE --- */
              <form id="edit-property-form" onSubmit={handleSaveSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Basic Listing Info
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Property Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Description</label>
                      <textarea
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Purpose</label>
                      <input
                        type="text"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Base Price</label>
                      <input
                        type="text"
                        name="base_price"
                        value={formData.base_price}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Payment Frequency</label>
                      <input
                        type="text"
                        name="payment_frequency"
                        value={formData.payment_frequency}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Status Configurations
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Listing Status</label>
                      <select
                        name="listing_status"
                        value={formData.listing_status}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-slate-800"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Verification Status</label>
                      <select
                        name="verification_status"
                        value={formData.verification_status}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-slate-800"
                      >
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Property Specifications
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Structure</label>
                      <input
                        type="text"
                        name="structure"
                        value={formData.structure}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Location
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Street</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">LGA</label>
                      <input
                        type="text"
                        name="lga"
                        value={formData.lga}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              /* --- VIEW MODE --- */
              <div className="space-y-6">
                {/* Media Gallery & Preview */}
                <div className="space-y-3">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                    {currentMedia ? (
                      currentMedia.media_type === 'video' ? (
                        <video 
                          src={currentMedia.url} 
                          controls 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Image 
                          src={currentMedia.url} 
                          alt={currentMedia.name || property.title}
                          width={600}
                          height={200} 
                          className="w-full h-full object-cover" 
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                        <LuBuilding size={28} />
                        <span className="text-xs">No media preview</span>
                      </div>
                    )}
                    {currentMedia?.is_primary && (
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-sm">
                        Primary Media
                      </span>
                    )}
                  </div>

                  {/* Media Thumbnails List */}
                  {sortedMedia.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {sortedMedia.map((m, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedMediaIdx(idx)}
                          className={`relative w-14 h-14 rounded border flex-shrink-0 overflow-hidden transition-all ${
                            selectedMediaIdx === idx 
                              ? 'border-slate-900 ring-1 ring-slate-900' 
                              : 'border-slate-200 opacity-60 hover:opacity-100'
                          }`}
                        >
                          {m.media_type === 'video' ? (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                              <LuVideo size={16} />
                            </div>
                          ) : (
                            <Image 
                              src={m.url} 
                              alt={m.name || `Thumbnail ${idx}`} 
                              fill 
                              className="object-cover" 
                            />
                          )}
                          {m.is_primary && (
                            <span className="absolute bottom-0 right-0 bg-slate-900 text-[8px] text-white px-1">
                              P
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Status Strip & System Metadata */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Ref:</span>
                      <span className="font-mono font-medium text-slate-800">{property.ref_no || 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        property.listing_status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {property.listing_status === 'active' ? <LuCheckCheck size={12} /> : <LuClock size={12} />}
                        <span className="capitalize">{property.listing_status || 'Unknown'}</span>
                      </span>

                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        property.verification_status === 'verified'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <LuShieldCheck size={12} />
                        <span className="capitalize">{property.verification_status || 'Unverified'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Engagement / Ratings Breakdown */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg Rating</span>
                    <span className="inline-flex items-center gap-1 text-slate-800 font-bold text-xs mt-0.5">
                      <LuStar size={12} className="text-amber-500 fill-amber-500" />
                      {property.average_rating ?? '0.0'} ({property.ratings_count ?? 0})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">User Rating</span>
                    <span className="text-slate-800 font-bold text-xs mt-0.5 block">
                      {property.user_rating ? `${property.user_rating} / 5` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Comments</span>
                    <span className="inline-flex items-center gap-1 text-slate-800 font-bold text-xs mt-0.5">
                      <LuMessageSquare size={12} className="text-slate-400" />
                      {property.comments_count ?? 0}
                    </span>
                  </div>
                </div>

                {/* Purpose & Description */}
                <div className="pb-4 border-b border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">About Listing</span>
                    {property.purpose && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize font-medium">
                        Purpose: {property.purpose}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{property.description || 'No description available.'}</p>
                  
                  {property.published_at && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <LuCalendar size={12} /> Published on: {new Date(property.published_at).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Financial Summary & Fees */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Pricing & Fees</p>
                  <div className="flex items-baseline gap-1 text-slate-900">
                    <span className="text-2xl font-semibold">
                      ₦{Number(property.base_price || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500">/ {property.payment_frequency || 'period'}</span>
                  </div>

                  {property.fees && property.fees.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Additional Fees Breakdown</span>
                      <div className="grid grid-cols-1 gap-2">
                        {property.fees.map((fee, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-slate-700 pb-1 border-b border-slate-100 last:border-0 last:pb-0">
                            <span className="capitalize font-medium flex items-center gap-1">
                              <LuDollarSign size={13} className="text-slate-400" />
                              {fee.fee_type}
                            </span>
                            <div className="text-right">
                              <span className="font-semibold">₦{Number(fee.fee).toLocaleString()}</span>
                              {fee.frequency && <span className="text-[10px] text-slate-400 ml-1">({fee.frequency})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Property Specs */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Property Specs</p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <LuBed className="text-slate-400 shrink-0" size={16} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Bedrooms</p>
                        <p className="font-semibold text-slate-800">{property.property_info?.bedrooms ?? '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <LuBath className="text-slate-400 shrink-0" size={16} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Bathrooms</p>
                        <p className="font-semibold text-slate-800">{property.property_info?.bathrooms ?? '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <LuBuilding className="text-slate-400 shrink-0" size={16} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Structure</p>
                        <p className="font-semibold text-slate-800 capitalize">{property.property_info?.structure || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Location</p>
                  <div className="flex items-start gap-2 text-xs">
                    <LuMapPin className="text-slate-400 mt-0.5 shrink-0" size={15} />
                    <div>
                      <p className="font-medium text-slate-800">{property.location?.street || 'Address not listed'}</p>
                      <p className="text-slate-500 text-[11px]">
                        {[property.location?.lga, property.location?.city, property.location?.state, property.location?.country].filter(Boolean).join(', ') || '—'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <div className="pb-4 border-b border-slate-100 space-y-3">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {property.amenities.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium capitalize">
                          <LuSparkles size={11} className="text-slate-400" />
                          {String(item).replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lister Details */}
                {property.lister && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Lister Profile</p>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center font-semibold text-xs shrink-0">
                        <LuUser size={15} />
                      </div>
                      <div className="min-w-0 text-xs flex-1">
                        <p className="font-semibold text-slate-800 truncate">
                          {property.lister.full_name || 'Unknown Lister'}
                        </p>
                        <p className="text-slate-500 truncate text-[11px]">{property.lister.email || 'No email registered'}</p>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 shrink-0">
                        ID: {property.lister.uuid ? `${property.lister.uuid.slice(0, 8)}...` : 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No property record found.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md transition-all"
              >
                <LuArrowLeft size={14} />
                Cancel
              </button>
              <button
                type="submit"
                form="edit-property-form"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary-green hover:bg-primary-green-hover text-white font-semibold text-xs rounded-md transition-all shadow-sm"
              >
                <LuSave size={14} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md transition-all"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(portalContent, document.body);
}