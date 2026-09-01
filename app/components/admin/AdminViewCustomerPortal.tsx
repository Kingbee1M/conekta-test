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
  LuFlag,
  LuBriefcase,
  LuShieldAlert,
  LuUsers,
  LuDollarSign
} from 'react-icons/lu';

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
    ref_no: '',
    occupation: '',
    monthly_income: '',
    employer_name: '',
    employer_address: '',
    employer_phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    guarantor_name: '',
    guarantor_phone: '',
    guarantor_email: '',
    guarantor_address: '',
    guarantor_relationship: '',
  });

  const lgaOptions: ComboboxOption[] = useMemo(() => {
    if (!formData.state) return [];
    
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
          ref_no: selectedCustomer.ref_no || '',
          occupation: selectedCustomer.occupation || '',
          monthly_income: selectedCustomer.monthly_income ? String(selectedCustomer.monthly_income) : '',
          employer_name: selectedCustomer.employer_name || '',
          employer_address: selectedCustomer.employer_address || '',
          employer_phone: selectedCustomer.employer_phone || '',
          emergency_contact_name: selectedCustomer.emergency_contact_name || '',
          emergency_contact_phone: selectedCustomer.emergency_contact_phone || '',
          emergency_contact_relationship: selectedCustomer.emergency_contact_relationship || '',
          guarantor_name: selectedCustomer.guarantor_name || '',
          guarantor_phone: selectedCustomer.guarantor_phone || '',
          guarantor_email: selectedCustomer.guarantor_email || '',
          guarantor_address: selectedCustomer.guarantor_address || '',
          guarantor_relationship: selectedCustomer.guarantor_relationship || '',
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
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-primary-green/20 backdrop-blur-md transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
      />

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
          <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* Animated Spinner with Pulsing Aura */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-16 h-16 rounded-full bg-emerald-500/10 animate-ping duration-1000" />
              <div className="w-12 h-12 rounded-full border-3 border-slate-100 border-t-slate-800 border-r-slate-800 animate-spin" />
              <div className="absolute w-6 h-6 rounded-full bg-slate-900/5 backdrop-blur-xs flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>

            {/* Text Loader with Dynamic Dots */}
            <div className="text-center space-y-1">
              <h4 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center justify-center gap-1">
                Fetching Customer Record
                <span className="inline-flex overflow-hidden w-4 text-slate-400 animate-pulse">...</span>
              </h4>
              <p className="text-xs text-slate-400">Pulling latest profile and KYC metadata</p>
            </div>

            {/* Subtle Skeleton Loader Preview */}
            <div className="w-full max-w-xs mt-8 space-y-3 p-4 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="h-3 bg-slate-200/70 rounded-full w-3/4 animate-pulse" />
              <div className="h-3 bg-slate-200/50 rounded-full w-1/2 animate-pulse" />
              <div className="h-3 bg-slate-200/30 rounded-full w-5/6 animate-pulse" />
            </div>
          </div>
        ) : singleError ? (
          <div className="py-12 px-4 flex flex-col items-center justify-center">
            {/* Animated Error Card */}
            <div className="w-full max-w-md p-6 bg-linear-to-b from-rose-50/80 to-white border border-rose-100 rounded-2xl shadow-xs text-center flex flex-col items-center transform transition-all animate-in fade-in zoom-in-95 duration-200">
              
              {/* Pulse Warning Icon Badge */}
              <div className="relative mb-4">
                <div className="absolute -inset-1 rounded-full bg-rose-200/60 animate-pulse" />
                <div className="relative w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200 shadow-xs">
                  <LuShieldAlert size={22} className="animate-bounce" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-1">Failed to Load Profile</h4>
              <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
                {singleError || 'An unexpected error occurred while fetching customer records from the database.'}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => uuid && dispatch(fetchCustomerByUuid(uuid))}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <LuClock size={13} />
                  Retry Request
                </button>
              </div>
            </div>
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

                {/* Employment Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Employment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="occupation">Occupation</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuBriefcase className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="occupation"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="monthly_income">Monthly Income</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuDollarSign className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="number"
                          id="monthly_income"
                          name="monthly_income"
                          value={formData.monthly_income}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="employer_name">Employer Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuBriefcase className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="employer_name"
                          name="employer_name"
                          value={formData.employer_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="employer_phone">Employer Phone</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuPhone className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="employer_phone"
                          name="employer_phone"
                          value={formData.employer_phone}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv col-span-2 w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="employer_address">Employer Address</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMapPin className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="employer_address"
                          name="employer_address"
                          value={formData.employer_address}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="emergency_contact_name">Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuShieldAlert className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="emergency_contact_name"
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="emergency_contact_phone">Phone</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuPhone className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="emergency_contact_phone"
                          name="emergency_contact_phone"
                          value={formData.emergency_contact_phone}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv col-span-2 w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="emergency_contact_relationship">Relationship</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="emergency_contact_relationship"
                          name="emergency_contact_relationship"
                          value={formData.emergency_contact_relationship}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guarantor Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 mb-4">
                    Guarantor Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="guarantor_name">Name</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUsers className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="guarantor_name"
                          name="guarantor_name"
                          value={formData.guarantor_name}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="guarantor_phone">Phone</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuPhone className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="guarantor_phone"
                          name="guarantor_phone"
                          value={formData.guarantor_phone}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="guarantor_email">Email</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMail className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="email"
                          id="guarantor_email"
                          name="guarantor_email"
                          value={formData.guarantor_email}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="guarantor_relationship">Relationship</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuUser className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="guarantor_relationship"
                          name="guarantor_relationship"
                          value={formData.guarantor_relationship}
                          onChange={handleInputChange}
                          className="w-full text-xs outline-none bg-transparent"
                        />
                      </div>
                    </div>

                    <div className="outerDiv col-span-2 w-full">
                      <label className="text-xs font-semibold text-slate-600 mb-1 block" htmlFor="guarantor_address">Address</label>
                      <div className="inputDiv flex items-center border border-slate-200 p-2 rounded gap-2 focus-within:border-slate-800">
                        <LuMapPin className="text-slate-400 shrink-0" size={16} />
                        <input
                          type="text"
                          id="guarantor_address"
                          name="guarantor_address"
                          value={formData.guarantor_address}
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
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Customer UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{customer.uuid || customer.profile_uuid || '—'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">User UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{customer.user_uuid || '—'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Ref No.</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{customer.ref_no || '—'}</span>
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

                {/* Employment Information */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Employment & Financials</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2.5">
                      <LuBriefcase className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Occupation</p>
                        <p className="font-semibold text-slate-800">{customer.occupation || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuDollarSign className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Monthly Income</p>
                        <p className="font-semibold text-slate-800">
                          {customer.monthly_income ? customer.monthly_income.toLocaleString() : '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuBriefcase className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Employer</p>
                        <p className="font-semibold text-slate-800">{customer.employer_name || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuPhone className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Employer Phone</p>
                        <p className="font-semibold text-slate-800">{customer.employer_phone || '—'}</p>
                      </div>
                    </div>

                    {customer.employer_address && (
                      <div className="col-span-2 flex items-start gap-2 text-xs">
                        <LuMapPin className="text-slate-400 mt-0.5 shrink-0" size={15} />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Employer Address</p>
                          <p className="font-medium text-slate-800">{customer.employer_address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Emergency Contact</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2.5">
                      <LuShieldAlert className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Contact Name</p>
                        <p className="font-semibold text-slate-800">{customer.emergency_contact_name || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuPhone className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Phone</p>
                        <p className="font-semibold text-slate-800">{customer.emergency_contact_phone || '—'}</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-2.5">
                      <LuUser className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Relationship</p>
                        <p className="font-semibold text-slate-800">{customer.emergency_contact_relationship || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guarantor Details */}
                <div className="pb-4 border-b border-slate-100 space-y-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Guarantor Details</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2.5">
                      <LuUsers className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Guarantor Name</p>
                        <p className="font-semibold text-slate-800">{customer.guarantor_name || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuPhone className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Phone</p>
                        <p className="font-semibold text-slate-800">{customer.guarantor_phone || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuMail className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Email</p>
                        <p className="font-semibold text-slate-800">{customer.guarantor_email || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuUser className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Relationship</p>
                        <p className="font-semibold text-slate-800">{customer.guarantor_relationship || '—'}</p>
                      </div>
                    </div>

                    {customer.guarantor_address && (
                      <div className="col-span-2 flex items-start gap-2 text-xs">
                        <LuMapPin className="text-slate-400 mt-0.5 shrink-0" size={15} />
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase">Address</p>
                          <p className="font-medium text-slate-800">{customer.guarantor_address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* System History */}
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