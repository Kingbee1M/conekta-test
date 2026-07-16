'use client'

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { RootState } from "@/shared/store/store";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Database, X, Trash2 } from "lucide-react"; 
import { resetCookieConsent } from "@/shared/store/acceptCookieSlice";
import { clearUserInfo } from "@/shared/store/authSlice";
import { clearProperties } from "@/shared/store/listingSlice"; 
import { clearAuthCookies } from "@/shared/cookie.action";

const subscribe = () => () => {}; 
const getSnapshot = () => true; 
const getServerSnapshot = () => false; 

export default function DevStorageTool() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // 💡 Pull the full global state object directly to inspect separate slices
  const state = useAppSelector((state: RootState) => state);

  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const portalTarget: HTMLElement | null = isClient ? document.getElementById("cookie-portal") : null;

  const handleFullReset = async (): Promise<void> => {
    await clearAuthCookies();
    dispatch(clearUserInfo());
    dispatch(clearProperties());  
    dispatch(resetCookieConsent());
    window.location.reload();
  };

  if (!isClient) return null;

  const drawerContent = (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-9998 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 text-slate-50 shadow-2xl z-9999 transform transition-transform duration-300 border-l border-slate-700 overflow-hidden flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header Section */}
        <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-800 shrink-0">
          <h2 className="font-bold flex items-center gap-2 text-indigo-400">
            <Database size={18} /> Conketa DevTools
          </h2>
          <button onClick={() => setIsOpen(false)} className="hover:bg-slate-700 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable JSON Inspector Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6 max-h-[calc(100vh-140px)]">
          
          {/* --- AUTH REDUCER SLICE --- */}
          <section>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">Auth Reducer</h3>
            <pre className="bg-black/50 p-3 rounded text-[10px] overflow-x-auto border border-slate-800 font-mono text-emerald-400">
              {JSON.stringify(state.auth, null, 2)}
            </pre>
          </section>

          {/* --- LISTING UI SLICE --- */}
          <section>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">Listing UI State</h3>
            <pre className="bg-black/50 p-3 rounded text-[10px] overflow-x-auto border border-slate-800 font-mono text-amber-400">
              {JSON.stringify(state.listing, null, 2)}
            </pre>
          </section>

          {/* --- COOKIE CONSENT SLICE --- */}
          <section>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">Cookie Consent</h3>
            <pre className="bg-black/50 p-3 rounded text-[10px] overflow-x-auto border border-slate-800 font-mono text-blue-400">
              {JSON.stringify(state.cookieConsent, null, 2)}
            </pre>
          </section>

          {/* --- RTK QUERY SERVER CACHE DATA (Optional Inspector) --- */}
          <section>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">RTK Query Cache (API)</h3>
            <details className="group">
              <summary className="text-[9px] text-slate-400 cursor-pointer hover:text-indigo-400 transition-colors list-none">
                Click to inspect live endpoint caches...
              </summary>
              <pre className="mt-2 bg-black/50 p-3 rounded text-[10px] overflow-x-auto border border-slate-800 font-mono text-purple-400 max-h-60">
                {JSON.stringify(state.api?.queries, null, 2)}
              </pre>
            </details>
          </section>

        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-2 shrink-0">
          <button 
            onClick={handleFullReset}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 py-2.5 rounded text-xs font-bold transition-all active:scale-95"
          >
            <Trash2 size={14} /> Nuke Storage & Logout
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-6 p-3 bg-indigo-600 text-white rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all hover:scale-110 z-9997 border border-indigo-400"
      >
        <Database size={24} />
      </button>

      {portalTarget && createPortal(drawerContent, portalTarget)}
    </>
  );
}