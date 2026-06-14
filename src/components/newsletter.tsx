import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the Best Travel Deals</h2>
        <p className="text-lg opacity-90 mb-8">Subscribe to our newsletter and never miss an exclusive offer</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-white/20 border-white/30 placeholder-white/60 text-white"
          />
          <Button variant="secondary" className="whitespace-nowrap">Subscribe</Button>
        </div>
      </div>
    </section>
  );
}
