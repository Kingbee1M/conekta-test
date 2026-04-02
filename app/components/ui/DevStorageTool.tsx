'use client'
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Database, X, Trash2 } from "lucide-react"; 
import { resetCookieConsent } from "@/shared/store/acceptCookieSlice";
import { clearUserInfo } from "@/shared/store/authSlice";
import { clearAuthCookies } from "@/shared/cookie.action";

// --- Helper for the Linter-safe mounting check ---
const subscribe = () => () => {}; 
const getSnapshot = () => true; 
const getServerSnapshot = () => false; 

export default function DevStorageTool() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state);


  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
const portalTarget = isClient ? document.getElementById("cookie-portal") : null;
  const handleFullReset = async () => {
    await clearAuthCookies();
    dispatch(clearUserInfo());
    dispatch(resetCookieConsent());
    window.location.reload();
  };

  if (!isClient) return null;

  const drawerContent = (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-9998 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 text-slate-50 shadow-2xl z-9999 transform transition-transform duration-300 border-l border-slate-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-800">
          <h2 className="font-bold flex items-center gap-2 text-indigo-400">
            <Database size={18} /> Emporium DevTools
          </h2>
          <button onClick={() => setIsOpen(false)} className="hover:bg-slate-700 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-140px)] space-y-6">
          <section>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">Auth Reducer</h3>
            <pre className="bg-black/50 p-3 rounded text-[10px] overflow-x-auto border border-slate-800 font-mono text-emerald-400">
              {JSON.stringify(state.auth, null, 2)}
            </pre>
          </section>

          <section>
            <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">Cookie Consent</h3>
            <pre className="bg-black/50 p-3 rounded text-[10px] overflow-x-auto border border-slate-800 font-mono text-blue-400">
              {JSON.stringify(state.cookieConsent, null, 2)}
            </pre>
          </section>
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-slate-800 border-t border-slate-700 space-y-2">
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
        className="fixed bottom-50 left-6 p-3 bg-indigo-600 text-white rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all hover:scale-110 z-9997 border border-indigo-400"
      >
        <Database size={24} />
      </button>

      {/* portalTarget check inside the render */}
      {portalTarget && createPortal(drawerContent, portalTarget)}
    </>
  );
}