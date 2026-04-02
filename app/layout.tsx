import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/storeProvider";
import CookieBanner from "./components/cookieBanner";
import DevStorageTool from "./components/ui/DevStorageTool";
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from "./components/ui/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emporium dashboard",
  description: "The Official dashboard for Emporium store users",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="...">
        <StoreProvider>
          <ToastProvider>
          <div id="cookie-portal" /> 

          <main className="...">
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
