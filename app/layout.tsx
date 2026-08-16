import type { Metadata } from "next";
import './globals.css';
import StoreProvider from "@/lib/storeProvider";
import CookieBanner from "./components/ui/cookieBanner";
import DevStorageTool from "./components/ui/DevStorageTool";
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from "./components/ui/ToastProvider";
import { Hanken_Grotesk, JetBrains_Mono, Poppins } from "next/font/google";
import NavbarWrapper from "./components/ui/clientNav";
import NextProgress from "./components/ui/NextProgress";
import { Suspense } from "react";
import FooterWrapper from "./components/ui/clientFooter";
import AuthWatcher from "@/lib/authProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KycModalProvider } from "@/lib/KycModalContext";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Conekta",
  description: "Conekta is a platform that connects landlords and tenants...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hanken.variable} ${jetbrains.variable} ${poppins.variable} font-sans w-full max-w-screen min-h-screen flex flex-col items-center justify-between overflow-x-hidden`}>
        <StoreProvider>
          <AuthWatcher>
            <ToastProvider>
              <div id="cookie-portal" />
              <div id="help-portal" />

              <Suspense fallback={null}>
                <NextProgress />
              </Suspense>
              <NavbarWrapper />
              <TooltipProvider>
                <KycModalProvider>
                <main className="w-full max-w-520 flex-1 flex-col items-center justify-center">
                  {children}
                </main>
                </KycModalProvider>
              </TooltipProvider>
              <FooterWrapper />
            </ToastProvider>

            <CookieBanner />
            {process.env.NODE_ENV === 'development' && <DevStorageTool />}
          </AuthWatcher>
        </StoreProvider>
      </body>
    </html>
  );
}