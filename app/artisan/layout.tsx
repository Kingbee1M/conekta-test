import { ReactNode } from 'react';
import ArtisanClientLayout from '../components/ui/ArtisanClientLayout';
import NoSSR from '../components/noSSR';

interface LayoutProps {
  children: ReactNode;
}

export const metadata = {
  title: 'Artisan Dashboard | Conketa',
  description: "Manage your profile as a Artisan on conekta's platphom",
};


export default function Layout({ children }: LayoutProps) {
  return (
    <NoSSR>
      <ArtisanClientLayout>{children}</ArtisanClientLayout>
    </NoSSR>
  );
}