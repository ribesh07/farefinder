'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setIsSuccess(true);
      setEmail('');

      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-blue-800 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <Mail className="h-12 w-12 mx-auto mb-4 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the Best Travel Deals</h2>
        <p className="text-lg opacity-90 mb-8">Subscribe to our newsletter and never miss an exclusive offer</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-white/20 border-white/30 placeholder-white/60 text-white"
            required
          />
          <Button 
            variant="secondary" 
            className="whitespace-nowrap" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Subscribing...' : isSuccess ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>

        {isSuccess && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-200">
            <CheckCircle2 className="h-5 w-5" />
            <span>Thank you for subscribing!</span>
          </div>
        )}
      </div>
    </section>
  );
}
