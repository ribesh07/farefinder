'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Plane, Moon, Sun, PoundSterling } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Flights', href: '/flights' },
  { name: 'Holidays', href: '/holidays' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Deals', href: '/deals' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary cursor-pointer">FareFinderUK</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-700 dark:text-gray-200 hover:text-primary hover:underline dark:hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={theme === 'dark' ? 'hover:bg-transparent hover:text-primary hover:border-b-2 hover:border-primary' : undefined}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="flex items-center justify-center gap-1">
                <span className="text-base">🇬🇧</span>
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-gray-700 dark:text-gray-200 hover:text-primary hover:underline dark:hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className={theme === 'dark' ? 'hover:bg-transparent hover:text-primary hover:border-b-2 hover:border-primary' : undefined}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon">
                <PoundSterling className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
