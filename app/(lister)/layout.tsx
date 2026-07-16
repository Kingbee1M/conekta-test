// app/(lister)/layout.tsx
import { ReactNode } from 'react';
import NoSSR from '../components/noSSR';
import ListerClientLayout from '../components/ui/ListerClientLayout'; // Simple static import!

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Lister Dashboard | Conketa',
  description: 'Manage your listings and properties.',
};

export default function Layout({ children }: LayoutProps) {
  return (
    <NoSSR>
      <ListerClientLayout>{children}</ListerClientLayout>
    </NoSSR>
  );
}