import type { Metadata, Viewport } from "next";
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
    "agriculture",
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
    icon: "/logo.png",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
