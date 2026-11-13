import type { Metadata } from "next";
import { EB_Garamond, Jost } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const jost = Jost({
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
        className={`${garamond.variable} ${jost.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
