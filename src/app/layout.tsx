import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "../components/common/Navbar";
import FloatingActions from "../components/common/FloatingActions";
import Footer from "../components/common/Footer";
import ThemeInit from "../components/common/ThemeInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxy Galleria",
  description: "Fulfill your global cravings - Premium imported drinks, snacks & more.",
  icons: {
    icon: "/luxy_logo.png",
  },
};

import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import GoogleOAuthWrapper from "../components/auth/GoogleOAuthWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative" suppressHydrationWarning>
        <ThemeInit />
        <ToastProvider>
          <CartProvider>
            <GoogleOAuthWrapper>
              <Navbar />
              {/* pt accounts for fixed navbar (64px mobile / 80px desktop) + promo banner (~36px) */}
              <div className="pt-20 lg:pt-28">
                {children}
              </div>
              <Footer />
              <FloatingActions />
            </GoogleOAuthWrapper>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}


