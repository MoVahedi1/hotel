import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luxury Hotels - Find Your Perfect Stay",
  description: "Discover luxury hotels worldwide at unbeatable prices. Book with confidence and enjoy premium accommodations.",
  keywords: ["luxury hotels", "hotel booking", "travel", "accommodation", "luxury travel", "premium hotels"],
  authors: [{ name: "Luxury Hotels Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Luxury Hotels - Find Your Perfect Stay",
    description: "Discover luxury hotels worldwide at unbeatable prices",
    url: "https://luxury-hotels.com",
    siteName: "Luxury Hotels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Hotels - Find Your Perfect Stay",
    description: "Discover luxury hotels worldwide at unbeatable prices",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
