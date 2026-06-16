'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FlightBookingModal from './FlightBookingModal';

interface FlightCardProps {
  id: string;
  airline: string;
  logo : string ;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: string;
  stops: number;
  farePrice: number;
}

export default function FlightCard({
  id,
  airline,
  logo,
  flightNumber,
  fromAirport,
  toAirport,
  departureTime,
  arrivalTime,
  duration,
  stops,
  farePrice,
}: FlightCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img src={logo} alt={`${airline} logo`} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
              <div>
                <p className="font-semibold">{airline}</p>
                <p className="text-sm text-gray-500">{flightNumber}</p>
              </div>
            </div>

            <div className="flex items-center justify-between flex-1 max-w-lg">
              <div className="text-center">
                <p className="text-sm text-gray-500">{fromAirport}</p>
              </div>
              <div className="flex-1 mx-4">
                <div className="flex items-center">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="mx-2">
                    <Badge variant={stops === 0 ? 'default' : 'secondary'} className="mt-1">
                      {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                    </Badge>
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{toAirport}</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-3xl font-bold text-primary">£{farePrice}</p>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pb-6 px-6">
          <Button onClick={() => setIsModalOpen(true)}>Select</Button>
        </CardFooter>
      </Card>

      <FlightBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flight={{
          id,
          airline,
          flightNumber,
          fromAirport,
          toAirport,
          farePrice,
        }}
      />
    </>
  );
}
