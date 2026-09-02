'use client';

import { useEffect, useState, useSyncExternalStore, ChangeEvent, FormEvent, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { 
  fetchAdminUserByUuid, 
  clearSelectedAdmin 
} from '@/shared/store/adminUsersSlice';
import { 
  LuX, 
  LuMail, 
  LuPhone, 
  LuUser, 
  LuShieldCheck, 
  LuMapPin, 
  LuCalendar, 
  LuPencil, 
  LuSave, 
  LuArrowLeft,
  LuRefreshCw,
} from 'react-icons/lu';
import { AlertTriangle } from 'lucide-react';
interface EmployeePortalProps {
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

export default function EmployeePortal({ uuid, isOpen, onClose }: EmployeePortalProps) {
  const dispatch = useAppDispatch();
  const isClient = useIsClient();
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Retrieve single employee state from Redux
  const { selectedAdmin, singleLoading, singleError } = useAppSelector(
    (state) => state.adminUsers
  );

  // Form State for Editing
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role_name: '',
    nationality: '',
    country: '',
    state: '',
    lga: '',
    address: '',
    postal_code: '',
    date_of_birth: '',
  });

  // Retry handler for error state
  const handleRetry = useCallback(() => {
    if (uuid) {
      dispatch(fetchAdminUserByUuid(uuid));
    }
  }, [dispatch, uuid]);

  // Safely hydrate form data asynchronously without triggering synchronous cascading renders
  useEffect(() => {
    if (selectedAdmin) {
      queueMicrotask(() => {
        setFormData({
          first_name: selectedAdmin.first_name || '',
          middle_name: selectedAdmin.middle_name || '',
          last_name: selectedAdmin.last_name || '',
          email: selectedAdmin.email || '',
          phone_number: selectedAdmin.phone_number || '',
          role_name: selectedAdmin.role || '',
          nationality: selectedAdmin.nationality || '',
          country: selectedAdmin.country || '',
          state: selectedAdmin.state || '',
          lga: selectedAdmin.lga || '',
          address: selectedAdmin.address || '',
          postal_code: selectedAdmin.postal_code || '',
          date_of_birth: selectedAdmin.date_of_birth || '',
        });
      });
    }
  }, [selectedAdmin]);

  // Handle slide-in / backdrop animation triggers & Redux fetching
  useEffect(() => {
    let animFrameId: number;

    if (isOpen) {
      if (uuid) {
        dispatch(fetchAdminUserByUuid(uuid));
      }
      animFrameId = requestAnimationFrame(() => setAnimate(true));
    } else {
      animFrameId = requestAnimationFrame(() => {
        setAnimate(false);
        setIsEditing(false);
      });
      dispatch(clearSelectedAdmin());
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [dispatch, isOpen, uuid]);

  // Lock body scroll when drawer is open
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (!isClient || !isOpen) return null;

  const portalContent = (
    <div className="fixed inset-0 z-9999 flex justify-end">
      {/* Blurred Fullscreen Overlay / Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 ease-out ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Right-Aligned Slide-In Panel */}
      <div
        className={`relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-gray-100 transition-transform duration-300 ease-in-out ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/70">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Employee Profile' : 'Employee Details'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing ? 'Update personnel record details below' : 'View personnel details'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isEditing && selectedAdmin && !singleLoading && !singleError && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-green/10 text-primary-green hover:bg-primary-green/20 transition-colors"
              >
                <LuPencil size={14} />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <LuX size={20} />
            </button>
          </div>
        </div>

        {/* Body Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
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
                <p className="text-xs font-medium text-slate-400">Fetching employee record...</p>
              </div>
            </div>
          ) : singleError ? (
            /* --- ANIMATED ERROR STATE --- */
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mb-3 animate-bounce">
                <AlertTriangle size={24} />
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
          ) : selectedAdmin ? (
            isEditing ? (
              /* --- EDIT FORM --- */
              <form id="edit-employee-form" onSubmit={handleSaveSubmit} className="flex flex-col gap-5">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-green">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Middle Name</label>
                      <input
                        type="text"
                        name="middle_name"
                        value={formData.middle_name}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Date of Birth</label>
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-green">Contact & Role</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number</label>
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Role Name</label>
                      <input
                        type="text"
                        name="role_name"
                        value={formData.role_name}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-green">Location Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">LGA</label>
                      <input
                        type="text"
                        name="lga"
                        value={formData.lga}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Postal Code</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                      />
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              /* --- VIEW DETAILS --- */
              <div className="flex flex-col gap-5">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-primary-green/10 text-primary-green flex items-center justify-center font-bold text-2xl border border-primary-green/20 shrink-0">
                    {selectedAdmin.first_name?.[0] || selectedAdmin.email?.[0] || 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {[selectedAdmin.first_name, selectedAdmin.middle_name, selectedAdmin.last_name]
                          .filter(Boolean)
                          .join(' ') || 'Admin User'}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{selectedAdmin.email}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-green/10 text-primary-green border border-primary-green/20">
                      <LuShieldCheck size={12} />
                      {selectedAdmin.role || 'Admin'}
                    </span>
                  </div>
                </div>

                {/* Personal & Contact Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-green mb-1">
                    Personal & Contact Info
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <LuUser className="text-primary-green shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Full Name</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {[selectedAdmin.first_name, selectedAdmin.middle_name, selectedAdmin.last_name]
                            .filter(Boolean)
                            .join(' ') || '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <LuMail className="text-primary-green shrink-0" size={18} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Email Address</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{selectedAdmin.email || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <LuPhone className="text-primary-green shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedAdmin.phone_number || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <LuCalendar className="text-primary-green shrink-0" size={18} />
                      <div>
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Date of Birth</p>
                        <p className="text-sm font-semibold text-gray-800">{selectedAdmin.date_of_birth || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-green mb-1">
                    Location & Address
                  </h4>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                    <LuMapPin className="text-primary-green shrink-0" size={18} />
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Street Address</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedAdmin.address || '—'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">LGA</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{selectedAdmin.lga || '—'}</p>
                    </div>

                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">State</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{selectedAdmin.state || '—'}</p>
                    </div>

                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Country</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{selectedAdmin.country || '—'}</p>
                    </div>

                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Nationality</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{selectedAdmin.nationality || '—'}</p>
                    </div>

                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase">Postal Code</p>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">{selectedAdmin.postal_code || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Audit Information */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-green mb-1">
                    System Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <span className="text-gray-400 block mb-0.5">Created At</span>
                      <span className="font-semibold text-gray-700">
                        {new Date(selectedAdmin.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50/70 border border-gray-100 rounded-xl">
                      <span className="text-gray-400 block mb-0.5">Last Updated</span>
                      <span className="font-semibold text-gray-700">
                        {new Date(selectedAdmin.updated_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              No employee record found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all active:scale-[0.98]"
              >
                <LuArrowLeft size={16} />
                Cancel
              </button>
              <button
                type="submit"
                form="edit-employee-form"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-green hover:opacity-90 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.98]"
              >
                <LuSave size={16} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all active:scale-[0.98]"
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