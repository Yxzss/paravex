import type { Metadata } from "next";
import { Geist, Geist_Mono } from 'next/font/google';
import "./globals.css";

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans'
});
const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: "PARAXE - Scanner Morphologique",
  description: "Visualise ton prime avec le scanner morphologique PARAXE. Identifie les 20% d'efforts qui vont sculpter 80% de ton esthétique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
