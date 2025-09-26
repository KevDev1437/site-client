import { AuthErrorHandler } from "@/components/auth/AuthErrorHandler";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/NavBar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yapha Creative Studio",
  description: "Ateliers créatifs et cours d'art à Paris - Peinture, crochet, poterie et plus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-900 font-sans`}
      >
        <AuthProvider>
          <AuthErrorHandler />
          <Header />
          <main className="pt-28">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
