'use client'
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { acceptCookies } from "@/shared/store/acceptCookieSlice";
import { clearAuthCookies } from "@/shared/cookie.action";
import { clearUserInfo } from "@/shared/store/authSlice";
import { hideForSession } from "@/shared/store/acceptCookieSlice";


export default function CookieBanner() {
  const [mounted, setMounted] = useState(() => typeof window !== "undefined");
  
  const dispatch = useAppDispatch();

  const declineCookie = async () => {
    await clearAuthCookies()
    dispatch(clearUserInfo());
    dispatch(hideForSession());
    // 2. Attempt to close the tab
  const win = window.open("", "_self");
  if (win) {
    win.close();
  }

  window.location.href = "https://google.com"; 
  }
  const hasAccepted = useAppSelector((state) => state.cookieConsent.hasAccepted);

  useEffect(() => {
    if (!mounted) {
      const timeout = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(timeout);
    }
  }, [mounted]);

  // 3. Logic remains the same
  if (!mounted || hasAccepted) return null;

  const portalTarget = typeof document !== "undefined" 
    ? document.getElementById("cookie-portal") 
    : null;

  if (!portalTarget) return null;

  const bannerContent = (
    <div className="fixed inset-0 z-9999 flex items-end justify-center p-6 pointer-events-none">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-2xl flex flex-col md:flex-row items-center gap-4 pointer-events-auto border border-gray-700 max-w-4xl w-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 text-white">Cookie Consent</h3>
          <p className="text-sm text-gray-400">
            We use cookies to ensure you get the best experience on **Emporium**. 
          </p>
        </div>
        <button 
          onClick={() => dispatch(acceptCookies())}
          className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Accept All
        </button>
        <button 
          onClick={declineCookie}
          className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
        >
          Decline
        </button>
      </div>
    </div>
  );

  return createPortal(bannerContent, portalTarget);
}