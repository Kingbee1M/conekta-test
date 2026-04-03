'use client'
import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
// 1. Import your RootState type directly
import { RootState } from "@/shared/store/store";
import { userInfoType } from "@/types"; 
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Database, X, Trash2, User, Home } from "lucide-react"; 
import { resetCookieConsent } from "@/shared/store/acceptCookieSlice";
import { clearUserInfo } from "@/shared/store/authSlice";
import { clearAuthCookies } from "@/shared/cookie.action";

const subscribe = () => () => {}; 
const getSnapshot = () => true; 
const getServerSnapshot = () => false; 

export default function DevStorageTool() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const auth = useAppSelector((state: RootState) => state.auth);
  const cookieConsent = useAppSelector((state: RootState) => state.cookieConsent);
  
  // Cast the nested user data to your custom type
  const authData = auth.user as userInfoType | null; 

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
        // FIX Tailwind: Removed brackets from z-index
        <div className="fixed inset-0 bg-black/60 z-9998 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-80 bg-slate-900 text-slate-50 shadow-2xl z-9999 transform transition-transform duration-300 border-l border-slate-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-800">
          <h2 className="font-bold flex items-center gap-2 text-indigo-400">
            <Database size={18} /> Conketa DevTools
          </h2>
          <button onClick={() => setIsOpen(false)} className="hover:bg-slate-700 p-1 rounded transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-140px)] space-y-6">
  {/* --- USER PROFILE SECTION --- */}
  <section>
    <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest flex items-center gap-2">
      <User size={12} /> User Profile
    </h3>
    {authData?.user ? (
      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg space-y-2 text-[11px]">
        <div className="flex items-center gap-3 border-b border-slate-700 pb-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
            {authData.user.name.charAt(0)}
          </div>
          <div>
            <p className="text-emerald-400 font-bold leading-none">{authData.user.name}</p>
            <p className="text-slate-400 text-[10px]">{authData.user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-1 text-slate-300">
          <p className="flex items-center gap-2"><span className="text-slate-500">ID:</span> {authData.user.landlord_id}</p>
          <p className="flex items-center gap-2"><span className="text-slate-500">Role:</span> <span className="text-indigo-400 uppercase text-[9px] font-bold">{authData.user.role}</span></p>
          <p className="flex items-center gap-2"><span className="text-slate-500">Phone:</span> {authData.user.phone}</p>
          <p className="flex items-center gap-2 truncate"><span className="text-slate-500">Addr:</span> {authData.user.address}</p>
        </div>
      </div>
    ) : (
      <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded text-[11px] text-rose-400 italic">
        No active session found.
      </div>
    )}
  </section>

  {/* --- PRODUCTS SECTION --- */}
  <section>
    <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest flex items-center gap-2">
      <Home size={12} /> Registered Products ({authData?.product?.length || 0})
    </h3>
    <div className="space-y-2">
      {authData?.product && authData.product.length > 0 ? (
        authData.product.map((item) => (
          <div key={item.house_id} className="bg-black/30 border border-slate-800 p-2 rounded text-[10px] hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-1">
              <p className="text-blue-400 font-bold truncate w-2/3">{item.name}</p>
              <p className="text-emerald-400">${item.price.toLocaleString()}</p>
            </div>
            <p className="text-slate-500 flex items-center gap-1 italic">
               <Database size={10} /> {item.location}
            </p>
          </div>
        ))
      ) : (
        <p className="text-[10px] text-slate-500 italic px-2">No products in state.</p>
      )}
    </div>
  </section>

  <div className="flex items-center gap-2 mb-2">
  <span className="text-[10px] text-slate-500 font-bold uppercase">Auth Flag:</span>
  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isAuthenticated ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
    {isAuthenticated ? 'TRUE' : 'FALSE'}
  </span>
</div>

  {/* --- RAW STATE (Minimized) --- */}
  <section>
    <h3 className="text-[10px] font-bold uppercase text-slate-500 mb-2 tracking-widest">Raw Store</h3>
    <details className="group">
      <summary className="text-[9px] text-slate-400 cursor-pointer hover:text-indigo-400 transition-colors list-none">
        Click to view full JSON payload...
      </summary>
      <pre className="mt-2 bg-black/50 p-2 rounded text-[9px] overflow-x-auto border border-slate-800 font-mono text-slate-500 max-h-40">
        {JSON.stringify({ auth, cookieConsent }, null, 2)}
      </pre>
    </details>
  </section>
</div>

        <div className="absolute bottom-0 w-full p-4 bg-slate-800 border-t border-slate-700">
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