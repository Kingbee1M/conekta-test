import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/lib/storeProvider";
import CookieBanner from "./components/ui/cookieBanner";
import DevStorageTool from "./components/ui/DevStorageTool";
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from "./components/ui/ToastProvider";
import { Montserrat, Cormorant_Garamond, Poppins } from "next/font/google";
import NavbarWrapper from "./components/ui/clientNav";
import NextProgress from "./components/ui/NextProgress";
import { Suspense } from "react";
import FooterWrapper from "./components/ui/clientFooter";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
   variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={`${montserrat.variable} ${garamond.variable} ${poppins.variable} font-sans bg-background w-screen overflow-x-hidden min-h-screen flex flex-col items-center justify-between`}>
        <StoreProvider>
          <ToastProvider>
          <div id="cookie-portal" />

          <Suspense fallback={null}>
        <NextProgress />
      </Suspense>
          <NavbarWrapper />

          <main className="w-full max-w-360 mt-10 lg:mt-16">
            {children}
          </main>

          <FooterWrapper />
          </ToastProvider>

          <CookieBanner />
          {process.env.NODE_ENV === 'development' && <DevStorageTool />}
        </StoreProvider>
      </body>
    </html>
  );
}
