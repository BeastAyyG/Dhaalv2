import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { Header } from "@/components/ui/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Dhaal - Civic Shield",
    template: "%s | Dhaal"
  },
  description: "AI-Powered Civic Reporting. Report potholes, garbage, and emergencies instantly with AI and Geo-tagging.",
  applicationName: "Dhaal",
  authors: [{ name: "Dhaal Team" }],
  keywords: ["civic", "reporting", "ai", "smart city", "emergency", "india"],
  manifest: "/manifest.json",
  metadataBase: new URL("https://dhaal.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dhaal.vercel.app",
    title: "Dhaal - AI Civic Reporting",
    description: "Report civic issues instantly with AI analysis and location tracking.",
    siteName: "Dhaal",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Dhaal App Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhaal - Civic Shield",
    description: "AI-Powered Civic Reporting & Response System",
    images: ["/logo.png"],
    creator: "@dhaal_app",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dhaal",
  },
};

export const viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
