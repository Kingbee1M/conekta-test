'use client'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface HelpPortalProps {
    isOpen: boolean;
    onClose: () => void;
    themeColor: string;
}

export default function HelpPortal({ isOpen, onClose, themeColor }: HelpPortalProps) {
    if (typeof window === "undefined") return null;

    const portalElement = document.getElementById('help-portal');
    if (!portalElement) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    
                    {/* 1. DIMMED BACKGROUND (Backdrop) */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} // Close when clicking outside
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    />

                    {/* 2. THE MODAL CONTENT */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col min-h-[400px]"
                    >
                        {/* Status Bar / Header Decor */}
                        <div className="h-2 w-full" style={{ backgroundColor: themeColor }} />

                        <div className="p-8 flex flex-col gap-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">How can we help?</h2>
                                    <p className="text-gray-500 mt-1">Our team is here to support your Conekta journey.</p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                >
                                    <span className="text-xl">✕</span>
                                </button>
                            </div>

                            {/* Help Content Area */}
                            <div className="grid grid-cols-1 gap-4 mt-4">
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all cursor-pointer group">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-black">Support Email Address</h3>
                                    <p className="text-sm text-gray-500">support@useconekta.com, Send us a message and we&apos;ll get back to you within 24h.</p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-all cursor-pointer group">
                                    <h3 className="font-semibold text-gray-800 group-hover:text-black">Customer Support Line</h3>
                                    <p className="text-sm text-gray-500"> 08072383942, Call our support line and speak directly with our agent</p>
                                </div>
                            </div>

                            {/* Optional Footer Branding */}
                            <div className="mt-auto pt-6 flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Conekta Support System</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        portalElement
    );
}