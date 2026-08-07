'use client';

import { useEffect, useState, useSyncExternalStore, ChangeEvent, FormEvent, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCustomerByUuid, clearSelectedCustomer } from '@/shared/store/admincustomerSlice';
import { CustomerProfile } from '@/shared/service/admin/types/customerTypes';
import Combobox, { ComboboxOption } from '../ui/ComboBox';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';
import { 
  LuX, 
  LuUser, 
  LuMail, 
  LuPhone, 
  LuMapPin, 
  LuCalendar, 
  LuPencil, 
  LuSave, 
  LuArrowLeft,
  LuCheckCheck,
  LuGlobe,
  LuHash,
  LuClock,
  LuBuilding,
  LuFlag
} from 'react-icons/lu';

// --- Region Enums & Mapping ---


interface AdminViewCustomerPortalProps {
  uuid: string;
  isOpen: boolean;
  onClose: () => void;
}

const statusOptions: ComboboxOption[] = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
];

// Helper options list generated from state Enum
const stateOptions: ComboboxOption[] = Object.values(NigeriaStateEnum).map((state) => ({
  label: state,
  value: state,
}));

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function AdminViewCustomerPortal({ uuid, isOpen, onClose }: AdminViewCustomerPortalProps) {
  const dispatch = useAppDispatch();
  const isClient = useIsClient();
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { selectedCustomer, singleLoading, singleError } = useAppSelector(
    (state) => state.adminCustomer
  );

  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    nationality: '',
    country: '',
    state: '',
    lga: '',
    address: '',
    postal_code: '',
    active_status: 'active',
  });

  // Calculate dynamic LGA options based on selected state
  const lgaOptions: ComboboxOption[] = useMemo(() => {
    if (!formData.state) return [];
    
    // Find matching state key in enum
    const matchedState = Object.values(NigeriaStateEnum).find(
      (s) => s.toLowerCase() === formData.state.toLowerCase()
    );

    if (!matchedState || !NIGERIA_LGA_MAP[matchedState]) return [];

    return NIGERIA_LGA_MAP[matchedState].map((lga) => ({
      label: lga,
      value: lga,
    }));
  }, [formData.state]);

  useEffect(() => {
    if (selectedCustomer) {
      queueMicrotask(() => {
        setFormData({
          first_name: selectedCustomer.first_name || '',
          middle_name: selectedCustomer.middle_name || '',
          last_name: selectedCustomer.last_name || '',
          email: selectedCustomer.email || '',
          phone_number: selectedCustomer.phone_number || '',
          date_of_birth: selectedCustomer.date_of_birth || '',
          nationality: selectedCustomer.nationality || '',
          country: selectedCustomer.country || '',
          state: selectedCustomer.state || '',
          lga: selectedCustomer.lga || '',
          address: selectedCustomer.address || '',
          postal_code: selectedCustomer.postal_code || '',
          active_status: selectedCustomer.active_status || 'active',
        });
      });
    }
  }, [selectedCustomer]);

  useEffect(() => {
    let animFrameId: number;

    if (isOpen) {
      if (uuid) {
        dispatch(fetchCustomerByUuid(uuid));
      }
      animFrameId = requestAnimationFrame(() => setAnimate(true));
    } else {
      animFrameId = requestAnimationFrame(() => {
        setAnimate(false);
        setIsEditing(false);
      });
      dispatch(clearSelectedCustomer());
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [dispatch, isOpen, uuid]);

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
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleComboboxChange = (name: string, value: string | number | (string | number)[]) => {
    const stringValue = String(value);

    setFormData((prev) => {
      const updated = { ...prev, [name]: stringValue };

      // Reset LGA if state changes and the current LGA is not valid for the new state
      if (name === 'state') {
        const matchedState = Object.values(NigeriaStateEnum).find(
          (s) => s.toLowerCase() === stringValue.toLowerCase()
        );

        if (matchedState && NIGERIA_LGA_MAP[matchedState]) {
          const validLgas = NIGERIA_LGA_MAP[matchedState];
          if (!validLgas.includes(prev.lga)) {
            updated.lga = '';
          }
        } else {
          updated.lga = '';
        }
      }

      return updated;
    });
  };

  const handleSaveSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (!isClient || !isOpen) return null;

  const customer: CustomerProfile | null = selectedCustomer;
  const fullName = customer 
    ? [customer.first_name, customer.middle_name, customer.last_name].filter(Boolean).join(' ') 
    : 'Customer Profile';

  const portalContent = (
    <div className="fixed inset-0 z-9999 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-primary-green/20 backdrop-blur-md transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer Panel */}
      <div
        className={`relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-in-out ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Customer Account
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEditing ? 'Edit Customer Details' : fullName}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && customer && (
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {singleLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
              <p className="text-xs font-medium text-slate-400">Fetching customer record...</p>
            </div>
          ) : singleError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs text-center">
              {singleError}
            </div>
          ) : customer ? (
            isEditing ? (
              /* --- EDIT MODE --- */
              <form id="edit-customer-form" onSubmit={handleSaveSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="first_name">First Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="middle_name">Middle Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="middle_name"
                          name="middle_name"
                          value={formData.middle_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="last_name">Last Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Contact & Demographics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="email">Email</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMail className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="phone_number">Phone Number</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuPhone className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="phone_number"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="date_of_birth">Date of Birth</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuCalendar className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="date"
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <Combobox
                        label="Account Status"
                        name="active_status"
                        value={formData.active_status}
                        options={statusOptions}
                        onChange={handleComboboxChange}
                        searchable={false}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Location & Address
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv col-span-2 w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="address">Address</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMapPin className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    {/* State Combobox */}
                    <div>
                      <Combobox
                        label="State"
                        name="state"
                        value={formData.state}
                        options={stateOptions}
                        onChange={handleComboboxChange}
                        placeholder="Select State"
                        searchable={true}
                      />
                    </div>

                    {/* Dynamic LGA Combobox */}
                    <div>
                      <Combobox
                        label="LGA"
                        name="lga"
                        value={formData.lga}
                        options={lgaOptions}
                        onChange={handleComboboxChange}
                        placeholder={formData.state ? 'Select LGA' : 'Select State first'}
                        searchable={true}
                        disabled={!formData.state}
                      />
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="country">Country</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuGlobe className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="nationality">Nationality</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuFlag className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="nationality"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full col-span-2">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="postal_code">Postal Code</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuHash className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          value={formData.postal_code}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              /* --- VIEW MODE --- */
              <div className="space-y-6">
                {/* Profile Card Header */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                    <LuUser size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 text-base truncate">{fullName}</h3>
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                      <LuMail size={13} /> {customer.email || '—'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    customer.active_status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <LuCheckCheck size={12} />
                    {customer.active_status || 'active'}
                  </span>
                </div>

                {/* Account Identifiers */}
                <div className="pb-4 border-b border-slate-100 space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Account References</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Customer UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{customer.uuid || '—'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">User UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{customer.user_uuid || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Personal Info</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2.5">
                      <LuPhone className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Phone Number</p>
                        <p className="font-semibold text-slate-800">{customer.phone_number || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuCalendar className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Date of Birth</p>
                        <p className="font-semibold text-slate-800">{customer.date_of_birth || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuGlobe className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Nationality</p>
                        <p className="font-semibold text-slate-800 capitalize">{customer.nationality || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Address & Location</span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2 text-xs">
                      <LuMapPin className="text-slate-400 mt-0.5 shrink-0" size={15} />
                      <div>
                        <p className="font-medium text-slate-800">{customer.address || 'No street address provided'}</p>
                        <p className="text-slate-500 text-[11px]">
                          {[customer.lga, customer.state, customer.country].filter(Boolean).join(', ') || '—'}
                        </p>
                      </div>
                    </div>

                    {customer.postal_code && (
                      <div className="flex items-center gap-2 pl-6 text-slate-500 text-[11px]">
                        <LuHash size={12} />
                        <span>Postal Code: {customer.postal_code}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Timestamps */}
                <div className="space-y-3 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">System History</span>
                  <div className="grid grid-cols-2 gap-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <LuClock size={13} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Created At</p>
                        <p className="font-medium text-slate-700">
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuClock size={13} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Updated At</p>
                        <p className="font-medium text-slate-700">
                          {customer.updated_at ? new Date(customer.updated_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No customer record found.
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
                form="edit-customer-form"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-all shadow-sm"
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