import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/storeProvider";
import CookieBanner from "./components/ui/cookieBanner";
import DevStorageTool from "./components/ui/DevStorageTool";
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from "./components/ui/ToastProvider";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import Navbar from "./components/ui/navbar";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const garamond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conketa",
  description: "Conketa is a platform that connects landlords and tenants, making it easier to find and rent properties. With Conketa, landlords can list their properties and manage their rentals, while tenants can search for available properties and apply for rentals. Conketa provides a seamless experience for both landlords and tenants, ensuring a smooth rental process.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${garamond.variable} font-sans bg-background`}>
        <StoreProvider>
          <ToastProvider>
          <div id="cookie-portal" />
          <Navbar />

          <main className="">
            {children}
          </main>
          </ToastProvider>

          <CookieBanner />
          {process.env.NODE_ENV === 'development' && <DevStorageTool />}
        </StoreProvider>
      </body>
    </html>
  );
}
