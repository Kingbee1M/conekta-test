'use client';

import { useEffect, useState, useSyncExternalStore, ChangeEvent, FormEvent, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchListerByUuid, clearSelectedLister } from '@/shared/store/adminListerSlice';
import { ListerProfile, ListerActiveStatus } from '@/shared/service/admin/types/listerTypes';
import Combobox, { ComboboxOption } from '../ui/ComboBox';
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
  LuRefreshCw
} from 'react-icons/lu';
import { AlertTriangleIcon } from 'lucide-react';
import { NigeriaStateEnum, NIGERIA_LGA_MAP } from '@/shared/enums/nigeriaRegions.enums';

interface AdminViewListerPortalProps {
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

export default function AdminViewListerPortal({ uuid, isOpen, onClose }: AdminViewListerPortalProps) {
  const dispatch = useAppDispatch();
  const isClient = useIsClient();
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { selectedLister, singleLoading, singleError } = useAppSelector(
    (state) => state.adminLister
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
    active_status: 'active' as ListerActiveStatus,
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
    if (selectedLister) {
      queueMicrotask(() => {
        setFormData({
          first_name: selectedLister.first_name || '',
          middle_name: selectedLister.middle_name || '',
          last_name: selectedLister.last_name || '',
          email: selectedLister.email || '',
          phone_number: selectedLister.phone_number || '',
          date_of_birth: selectedLister.date_of_birth || '',
          nationality: selectedLister.nationality || '',
          country: selectedLister.country || '',
          state: selectedLister.state || '',
          lga: selectedLister.lga || '',
          address: selectedLister.address || '',
          postal_code: selectedLister.postal_code || '',
          active_status: selectedLister.active_status || 'active',
        });
      });
    }
  }, [selectedLister]);

  useEffect(() => {
    let animFrameId: number;

    if (isOpen) {
      if (uuid) {
        dispatch(fetchListerByUuid(uuid));
      }
      animFrameId = requestAnimationFrame(() => setAnimate(true));
    } else {
      animFrameId = requestAnimationFrame(() => {
        setAnimate(false);
        setIsEditing(false);
      });
      dispatch(clearSelectedLister());
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

  const handleRetry = () => {
    if (uuid) {
      dispatch(fetchListerByUuid(uuid));
    }
  };

  if (!isClient || !isOpen) return null;

  const lister: ListerProfile | null = selectedLister;
  const fullName = lister 
    ? [lister.first_name, lister.middle_name, lister.last_name].filter(Boolean).join(' ') 
    : 'Lister Profile';

  const portalContent = (
    <div className="fixed inset-0 z-9999 flex justify-end">
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
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Lister Account
            </span>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEditing ? 'Edit Lister Details' : fullName}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && lister && !singleLoading && !singleError && (
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
            /* --- ANIMATED LOADING STATE --- */
            <div className="space-y-6 animate-pulse">
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200/60 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 bg-slate-100 rounded-lg border border-slate-200/50" />
                  <div className="h-12 bg-slate-100 rounded-lg border border-slate-200/50" />
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-8 bg-slate-100 rounded" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center pt-8 gap-2">
                <LuRefreshCw className="animate-spin text-slate-400" size={20} />
                <p className="text-xs font-medium text-slate-400">Fetching lister record...</p>
              </div>
            </div>
          ) : singleError ? (
            /* --- ANIMATED ERROR STATE --- */
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mb-3 animate-bounce">
                <AlertTriangleIcon size={24} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">Failed to load profile</h3>
              <p className="text-xs text-slate-500 max-w-xs mb-4">{singleError}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md transition-all shadow-sm active:scale-95"
              >
                <LuRefreshCw size={13} />
                Try Again
              </button>
            </div>
          ) : lister ? (
            isEditing ? (
              /* --- EDIT MODE --- */
              <form id="edit-lister-form" onSubmit={handleSaveSubmit} className="space-y-6">
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
                      <LuMail size={13} /> {lister.email || '—'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    lister.active_status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    <LuCheckCheck size={12} />
                    {lister.active_status || 'active'}
                  </span>
                </div>

                {/* Account Identifiers */}
                <div className="pb-4 border-b border-slate-100 space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">Account References</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Lister UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{lister.profile_uuid || '—'}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">User UUID</span>
                      <span className="font-mono text-slate-700 font-medium truncate block">{lister.user_uuid || '—'}</span>
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
                        <p className="font-semibold text-slate-800">{lister.phone_number || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuCalendar className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Date of Birth</p>
                        <p className="font-semibold text-slate-800">{lister.date_of_birth || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <LuGlobe className="text-slate-400 shrink-0" size={15} />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">Nationality</p>
                        <p className="font-semibold text-slate-800 capitalize">{lister.nationality || '—'}</p>
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
                        <p className="font-medium text-slate-800">{lister.address || 'No street address provided'}</p>
                        <p className="text-slate-500 text-[11px]">
                          {[lister.lga, lister.state, lister.country].filter(Boolean).join(', ') || '—'}
                        </p>
                      </div>
                    </div>

                    {lister.postal_code && (
                      <div className="flex items-center gap-2 pl-6 text-slate-500 text-[11px]">
                        <LuHash size={12} />
                        <span>Postal Code: {lister.postal_code}</span>
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
                          {lister.created_at ? new Date(lister.created_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuClock size={13} className="text-slate-400" />
                      <div>
                        <p className="text-[10px] text-slate-400">Updated At</p>
                        <p className="font-medium text-slate-700">
                          {lister.updated_at ? new Date(lister.updated_at).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No lister record found.
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
                form="edit-lister-form"
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