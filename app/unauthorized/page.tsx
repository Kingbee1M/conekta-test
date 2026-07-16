'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 transition-all duration-300 hover:shadow-2xl">
        
        {/* Animated Shield/Warning Icon Container */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center w-20 h-20 bg-red-50 rounded-full animate-pulse">
            <div className="absolute inset-2 bg-red-100 rounded-full"></div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-red-600 relative z-10 transition-transform duration-500 hover:scale-110" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          Access Denied
        </h1>
        
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
          You don&apos;t have the permissions required to view this page. This area is reserved for users with different account roles.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Go Back button (primary action) */}
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>

          {/* Switch Account Link */}
          <Link
            href="/log-in"
            className="w-full block text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 font-medium py-3 px-4 rounded-xl transition duration-200 ease-in-out text-sm"
          >
            Switch Accounts / Log In
          </Link>
        </div>

        {/* Footer/Context details */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Error Code: 403 Forbidden</span>
        </div>

      </div>
    </main>
  );
}