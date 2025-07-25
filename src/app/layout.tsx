import type { Metadata } from "next";
import { Playfair_Display, Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from '@/context/CartContext';
import { ClerkProvider } from '@clerk/nextjs'

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const cormorant = Cormorant({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Royal Attire | Luxury Clothing Brand",
  description: "Discover our exclusive collection of luxury clothing and accessories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} antialiased dark`}
      >
         <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        </CartProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}