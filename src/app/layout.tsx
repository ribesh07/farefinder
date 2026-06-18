import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ContactusPopup from '@/components/ContactusPopup';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FareFinderUK - Find Cheap Flights & Holidays',
  description: 'Book cheap flights, holidays, and travel deals from the UK with FareFinderUK. Your trusted travel partner.',
  openGraph: {
    title: 'FareFinderUK - Find Cheap Flights & Holidays',
        siteName: "FareFinderUK",
    description: 'Book cheap flights, holidays, and travel deals from the UK with FareFinderUK.',
    type: 'website',
  },
  keywords: [
    "FareFinderUK",
    "cheap flights UK",
    "flight booking UK",
    "holiday packages UK",
    "travel agency UK",
    "flights from London",
    "flights from Manchester",
    "Dubai holidays",
    "Turkey holidays",
    "Spain holidays",
    "flight deals UK",
    "airline tickets UK",
    "cheap flights to Dubai",
    "family holiday packages",
    "student travel deals",
    "flights to Dubai from UK" ,
    "flights to Turkey from UK",
    "flights to Spain from UK",
    "flights to Greece from UK",
    "flights to Maldives from UK",
    "flights to Thailand from UK",
    "cheap flights to New York",
    "cheap flights to Paris",
    "cheap flights to Amsterdam"
  ],

  twitter: {
    card: 'summary_large_image',
    title: 'FareFinderUK - Find Cheap Flights & Holidays',
    description: 'Book cheap flights, holidays, and travel deals from the UK.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <ContactusPopup />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
