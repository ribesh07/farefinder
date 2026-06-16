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
    description: 'Book cheap flights, holidays, and travel deals from the UK with FareFinderUK.',
    type: 'website',
  },
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
