import type { Metadata } from "next";
import { Playfair_Display, Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import ClientLayout from "@/components/home/ClientLayout";

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
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Royal Attire",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "msapplication-TileColor": "#ffffff",
    "msapplication-tap-highlight": "no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <head>
      <link rel="manifest" href="/manifest.json"/>

      <link rel="apple-touch-icon" sizes="180x180" href="/appicon180x180"/>
      </head>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} antialiased dark`}
      >

     <ClientLayout>{children}</ClientLayout>


      </body>
    </html>
    </ClerkProvider>
  );
}