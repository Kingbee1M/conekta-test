'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const NoSSRWrapper = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

// This dynamically exports a client-only wrapper
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});