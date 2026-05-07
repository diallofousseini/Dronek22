import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/AuthContext";

import { LanguageProvider } from "@/components/dronek/LanguageProvider";
import ScrollToTop from "@/components/dronek/ScrollToTop";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-montserrat',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#149655",
};

export const metadata: Metadata = {
  title: "DRONEK SARL — Expert en Technologies Durables | Côte d'Ivoire",
  description:
    "DRONEK SARL, entreprise ivoirienne de référence en technologies drone, foresterie durable, agroforesterie et agriculture. Cartographie haute précision, inventaire forestier et formation professionnelle depuis 2017.",
  keywords: [
    "DRONEK",
    "drone",
    "foresterie",
    "agroforesterie",
    "Côte d'Ivoire",
    "cartographie",
    "développement durable",
    "reboisement",
    "biomasse",
    "carbone",
    "télédétection",
    "photogrammétrie",
    "SIG",
    "pépinière",
  ],
  authors: [{ name: "DRONEK SARL" }],
  icons: {
    icon: "/images/dronek-nav-icon.png",
    shortcut: "/images/dronek-nav-icon.png",
    apple: "/images/dronek-nav-icon.png",
  },
  openGraph: {
    title: "DRONEK SARL — Technologies Innovantes pour un Avenir Durable",
    description:
      "Expert en cartographie par drone, foresterie durable et agroforesterie en Côte d'Ivoire. Plus de 150 projets réalisés depuis 2017.",
    type: "website",
    siteName: "DRONEK",
    locale: "fr_CI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <ScrollToTop />
          </LanguageProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
