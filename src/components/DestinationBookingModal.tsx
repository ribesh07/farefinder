'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, CheckCircle, MessageSquare } from 'lucide-react';
import { destinationLeadSchema } from '@/types';

interface DestinationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    id: string;
    name: string;
    country: string;
    startingFare: number;
  };
}

export default function DestinationBookingModal({ isOpen, onClose, destination }: DestinationBookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    travelers: '1',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    travelers: '1',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = destinationLeadSchema.parse({
        destinationId: destination.id,
        ...formData,
        travelers: Number(formData.travelers),
      });

      const response = await fetch('/api/leads/destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (response.ok) {
        setSubmittedFormData({ ...formData });
        setIsSuccess(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          whatsapp: '',
          travelers: '1',
          notes: '',
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppLink = () => {
    const message = `
Hello FareFinderUK! I'm interested in this destination:

Destination Details:
- Name: ${destination.name}
- Country: ${destination.country}
- Starting Fare: £${destination.startingFare}

Customer Details:
- Full Name: ${submittedFormData.fullName}
- Email: ${submittedFormData.email}
- Phone: ${submittedFormData.phone}
${submittedFormData.whatsapp ? `- WhatsApp: ${submittedFormData.whatsapp}` : ''}
- Travelers: ${submittedFormData.travelers}
${submittedFormData.notes ? `\n Notes: ${submittedFormData.notes}` : ''}

Please get back to me with more info!
    `.trim();

    const whatsappNumber = '447415026444';
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Destination Request Submitted!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Thank you! We'll get back to you shortly with more details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Chat on WhatsApp
                </a>
                <Button variant="outline" onClick={resetAndClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold">Destination</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {destination.name}, {destination.country} - £{destination.startingFare}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number (optional)</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="travelers">Number of Travelers *</Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    value={formData.travelers}
                    onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
