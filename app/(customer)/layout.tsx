import React from "react";
import NoSSR from "../components/noSSR";
import CustomerClientLayout from "../components/ui/CustomerClientLayout";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: 'Customer Dashboard | Conketa',
  description: 'Manage your profile, wallet, and history.',
};

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <NoSSR>
      <CustomerClientLayout>{children}</CustomerClientLayout>
    </NoSSR>
  );
}