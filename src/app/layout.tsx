import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: "Sunaina — Graphic Designer & Creative Technologist",
  description: "Portfolio showcasing branding, print, social media creatives, and digital design.",
  openGraph: {
    title: "Sunaina — Graphic Designer & Creative Technologist",
    description: "Portfolio showcasing branding, print, social media creatives, and digital design.",
    url: "/",
    siteName: "Sunaina Portfolio",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunaina — Graphic Designer & Creative Technologist",
    description: "Portfolio showcasing branding, print, social media creatives, and digital design.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${inter.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
