'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { getNameInitials } from "@/lib/hooks";
import { FlatUserData } from '@/types';

import { MdModeEdit, MdSave } from "react-icons/md";
import { FaCamera, FaCheckCircle, FaCalendarAlt, FaUser, FaBriefcase } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function MyProfile() {
    const { user } = useSelector((state: RootState) => state.auth);
    const typedUser = user as FlatUserData & { user?: FlatUserData } | null;

    // 1. Edit Mode Toggle State
    const [isEdit, setIsEdit] = useState(false);

    // 2. Initialize state directly from the Redux store (No useEffect needed!)
    const [firstName, setFirstName] = useState(typedUser?.profile?.first_name || '');
    const [lastName, setLastName] = useState(typedUser?.profile?.last_name || '');
    const [email, setEmail] = useState(typedUser?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(typedUser?.profile?.phone_number || '');
    const [location, setLocation] = useState(user?.store?.address || '');
    const [companyName, setCompanyName] = useState(user?.store?.name || '');
    const [bio, setBio] = useState(user?.store?.description || '');
    console.log('📦 MyProfile Component State:', { firstName, lastName, email, phoneNumber, location, companyName, bio });
    console.log('📦 User Object:', user);
    // Live sync for sidebar card avatar info
    const fullName = `${firstName} ${lastName}`.trim() || 'Thomas Clinton';
    const userInitials = getNameInitials(fullName) || 'TM';

    return (
        <section className="w-full flex flex-col gap-6 p-1 h-full min-h-screen bg-[#F8FAFC]">
            
            {/* 1. TOP HEADER SECTION */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
                <div className="flex flex-col gap-0.5">
                    <h1 className="font-black text-2xl text-slate-900 tracking-tight">My Profile</h1>
                    <p className="text-sm font-medium text-slate-500">Manage your personal information</p>
                </div>

                {/* Edit Toggle Button */}
                <button 
                    onClick={() => setIsEdit(!isEdit)}
                    type="button"
                    className={`${
                        isEdit ? 'bg-amber-600' : 'bg-primary-green'
                    } px-5 py-2.5 rounded-xl text-white text-xs font-bold flex gap-2 items-center shadow-md hover:bg-opacity-90 active:scale-95 transition-all cursor-pointer`}
                >
                    {isEdit ? (
                        <>
                            <MdSave className="text-sm" />
                            Save Profile
                        </>
                    ) : (
                        <>
                            <MdModeEdit className="text-sm" />
                            Edit Profile
                        </>
                    )}
                </button>
            </div>

            {/* 2. DYNAMIC WORKSPACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start w-full">
                
                {/* ================= LEFT COLUMN ================= */}
                <div className="flex flex-col gap-6 w-full">
                    
                    {/* User Profile Card */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="relative group cursor-pointer mt-4">
                            <div className="w-24 h-24 bg-emerald-50 border border-emerald-500/20 text-primary-green text-2xl font-black rounded-full flex items-center justify-center shadow-inner">
                                {userInitials}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-primary-green transition-colors">
                                <FaCamera className="text-xs" />
                            </div>
                        </div>

                        <div className="mt-4 space-y-0.5">
                            <h2 className="text-base font-black text-slate-800 tracking-tight">{fullName}</h2>
                            <p className="text-xs font-semibold text-slate-400">{email || 'thomasclinton00@email.com'}</p>
                        </div>

                        <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide">
                            <FaCheckCircle className="text-[11px]" />
                            Verified Account
                        </div>

                        <div className="w-full border-t border-slate-50 mt-6 pt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
                            <FaCalendarAlt className="text-slate-300" />
                            <span>Joined May 2026</span>
                        </div>
                    </div>

                    {/* Quick Analytics Metrics Panel */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Quick Stats</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Properties Listed', count: user?.store?.name ? 12 : 0, color: 'text-slate-700' },
                                { label: 'Properties Sold', count: 0, color: 'text-emerald-600' },
                                { label: 'Active Leases', count: 0, color: 'text-blue-600' },
                            ].map((stat, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-bold border-b border-slate-50/60 pb-2 last:border-0 last:pb-0">
                                    <span className="text-slate-500 font-medium">{stat.label}</span>
                                    <span className={`text-sm font-black ${stat.color}`}>{stat.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div className="flex flex-col gap-6 w-full">
                    
                    {/* Block A: Core Profile Form Information */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-50/80 pb-4">
                            <FaUser className="text-slate-400 text-sm" />
                            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Profile Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">First Name</label>
                                <input 
                                    type="text" 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)}
                                    readOnly={!isEdit} 
                                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                                        isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                    }`} 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">Last Name</label>
                                <input 
                                    type="text" 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)}
                                    readOnly={!isEdit} 
                                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                                        isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                    }`} 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">Email Address</label>
                                <div className="relative flex items-center">
                                    <HiMail className="absolute left-4 text-slate-400 text-sm" />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        readOnly={!isEdit} 
                                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                                            isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                        }`} 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">Phone Number</label>
                                <div className="relative flex items-center">
                                    <HiPhone className="absolute left-4 text-slate-400 text-sm" />
                                    <input 
                                        type="tel" 
                                        value={phoneNumber} 
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        readOnly={!isEdit} 
                                        placeholder="Not Provided"
                                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                                            isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                        }`} 
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">Location</label>
                                <div className="relative flex items-center">
                                    <HiLocationMarker className="absolute left-4 text-slate-400 text-sm" />
                                    <input 
                                        type="text" 
                                        value={location} 
                                        onChange={(e) => setLocation(e.target.value)}
                                        readOnly={!isEdit} 
                                        placeholder="Lagos, Nigeria"
                                        className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                                            isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                        }`} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Block B: Professional Broker Data */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-6">
                        <div className="flex items-center gap-2 border-b border-slate-50/80 pb-4">
                            <FaBriefcase className="text-slate-400 text-sm" />
                            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Professional Information</h3>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">Company / Agency Name</label>
                                <input 
                                    type="text" 
                                    value={companyName} 
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    readOnly={!isEdit} 
                                    placeholder="Independent Agent"
                                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                                        isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                    }`} 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">Bio</label>
                                <textarea 
                                    rows={4}
                                    value={bio} 
                                    onChange={(e) => setBio(e.target.value)}
                                    readOnly={!isEdit} 
                                    placeholder="No business bio description added yet."
                                    className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all resize-none ${
                                        isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                                    }`} 
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}