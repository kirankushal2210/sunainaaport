import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: "Sunaina — Next.js Developer & Creative Technologist",
  description: "Portfolio showcasing full-stack applications, interactive 3D device stages, branding, and digital design.",
  openGraph: {
    title: "Sunaina — Next.js Developer & Creative Technologist",
    description: "Portfolio showcasing full-stack applications, interactive 3D device stages, branding, and digital design.",
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
    title: "Sunaina — Next.js Developer & Creative Technologist",
    description: "Portfolio showcasing full-stack applications, interactive 3D device stages, branding, and digital design.",
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
        className={`${instrumentSerif.variable} ${spaceGrotesk.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
