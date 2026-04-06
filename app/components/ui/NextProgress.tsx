'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function NextProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This runs whenever the URL changes
    nProgress.done();
    
    // Optional: Cleanup/Start logic
    return () => {
      nProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}