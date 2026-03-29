import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "leaflet/dist/leaflet.css";
import { Providers } from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "VitalFlow | Blood Donation Platform",
    template: "%s | VitalFlow",
  },
  description:
    "Connect blood donors with those in need. Fast, reliable, and life-saving.",
  keywords: [
    "blood donation",
    "donate blood",
    "healthcare",
    "emergency",
    "blood donor",
  ],
  openGraph: {
    title: "VitalFlow | Blood Donation Platform",
    description:
      "Connect blood donors with those in need. Fast, reliable, and life-saving.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VitalFlow | Blood Donation Platform",
    description: "Connect blood donors with those in need.",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // MedicalOrganization JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "VitalFlow Blood Donation",
    url: "https://vitalflow.example.com",
    description: "A platform connecting blood donors with patients in need.",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-background flex flex-col`}
      >
        <Providers>
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
