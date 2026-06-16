'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, CheckCircle, MessageSquare } from 'lucide-react';
import { flightLeadSchema } from '@/types';

interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: {
    id: string;
    airline: string;
    flightNumber: string;
    fromAirport: string;
    toAirport: string;
    farePrice: number;
  };
}

export default function FlightBookingModal({ isOpen, onClose, flight }: FlightBookingModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    adults: '1',
    children: '0',
    departureDate: '',
    returnDate: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedFormData, setSubmittedFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    adults: '1',
    children: '0',
    departureDate: '',
    returnDate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = flightLeadSchema.parse({
        flightId: flight.id,
        ...formData,
        adults: Number(formData.adults),
        children: Number(formData.children),
      });

      // Save to database
      const response = await fetch('/api/leads/flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (response.ok) {
        setSubmittedFormData({ ...formData });
        setIsSuccess(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          whatsapp: '',
          adults: '1',
          children: '0',
          departureDate: '',
          returnDate: '',
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
Hello FareFinderUK! I'm interested in booking a flight:

 Flight Details:
- Airline: ${flight.airline}
- Flight Number: ${flight.flightNumber}
- From: ${flight.fromAirport}
- To: ${flight.toAirport}
- Price: £${flight.farePrice}

 Passenger Details:
- Full Name: ${submittedFormData.fullName}
- Email: ${submittedFormData.email}
- Phone: ${submittedFormData.phone}
${submittedFormData.whatsapp ? `- WhatsApp: ${submittedFormData.whatsapp}` : ''}
- Adults: ${submittedFormData.adults}
- Children: ${submittedFormData.children}
- Departure Date: ${submittedFormData.departureDate}
${submittedFormData.returnDate ? `- Return Date: ${submittedFormData.returnDate}` : ''}
${submittedFormData.notes ? `\n📝 Notes: ${submittedFormData.notes}` : ''}

Please get back to me with more info!
    `.trim();

    // Replace YOUR_WHATSAPP_NUMBER with your actual WhatsApp number (e.g., '447123456789')
    const whatsappNumber = '447599064917'; // Update this with your actual number!
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Booking Request Submitted!</h3>
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
                  <h2 className="text-xl font-bold">Book Flight</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {flight.airline} {flight.flightNumber} - {flight.fromAirport} → {flight.toAirport} - £{flight.farePrice}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                >
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adults">Adults *</Label>
                    <Input
                      id="adults"
                      type="number"
                      min="1"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="children">Children</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departureDate">Departure Date *</Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="returnDate">Return Date (optional)</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    />
                  </div>
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
                    {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
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
