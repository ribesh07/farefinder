import Link from 'next/link';
import { Plane, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Plane className="h-6 w-6" />
              <span className="text-xl font-bold">FareFinderUK</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted travel partner for finding the best flights, holidays, and deals from the UK.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/flights" className="text-gray-400 hover:text-white transition-colors">Flights</Link></li>
              <li><Link href="/holidays" className="text-gray-400 hover:text-white transition-colors">Holidays</Link></li>
              <li><Link href="/destinations" className="text-gray-400 hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/deals" className="text-gray-400 hover:text-white transition-colors">Deals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Glasgow, UK</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>44 7415 026444</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>customerservice@farefinderuk.co.uk</span>
                
              </li>
            </ul>
            <div>
              <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
              <div className="flex space-x-2">
                <Input placeholder="Your email" className="bg-gray-800 border-gray-700 text-white" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 FareFinderUK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
