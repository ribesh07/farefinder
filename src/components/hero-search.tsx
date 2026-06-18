'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, PlaneTakeoff, PlaneLanding, Calendar, Users, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AirportInput from './airport-input';

interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

export default function HeroSearch() {
  const router = useRouter();
  const [fromAirport, setFromAirport] = useState<Airport | null>(null);
  const [toAirport, setToAirport] = useState<Airport | null>(null);
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [cabin, setCabin] = useState('economy');

  const handleSwap = () => {
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (fromAirport) {
      params.set('from', fromAirport.code);
      params.set('fromName', fromAirport.name);
      params.set('fromCity', fromAirport.city);
    }
    if (toAirport) {
      params.set('to', toAirport.code);
      params.set('toName', toAirport.name);
      params.set('toCity', toAirport.city);
    }
    if (departure) params.set('departure', departure);
    if (returnDate) params.set('return', returnDate);
    params.set('passengers', passengers);
    params.set('cabin', cabin);
    
    router.push(`/flights?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-2">
            <Label htmlFor="from" className='text-primary mb-2 block'>
              From
            </Label>
            <AirportInput
              placeholder="From where?"
              value={fromAirport}
              onChange={setFromAirport}
              icon={PlaneTakeoff}
            />
          </div>

          <div className="flex justify-center lg:col-span-1 text-primary">
            <Button variant="ghost" size="icon" onClick={handleSwap} type="button">
              <ArrowLeftRight className="h-5 w-5 rotate-90 lg:rotate-0" />
            </Button>
          </div>

          <div className="lg:col-span-2">
            <Label htmlFor="to" className='text-primary mb-2 block'>To</Label>
            <AirportInput
              placeholder="To where?"
              value={toAirport}
              onChange={setToAirport}
              icon={PlaneLanding}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="departure" className='text-primary'>Departure</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                id="departure"
                type="date"
                className="pl-10 text-primary"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="return" className='text-primary' >Return</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                id="return"
                type="date"
                className="pl-10 text-primary"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passengers" className='text-primary'>Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                <Select value={passengers} onValueChange={setPassengers}>
                  <SelectTrigger id="passengers" className="pl-10 text-primary">
                    <SelectValue className="text-primary" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-primary">
                        {num} {num === 1 ? 'Passenger' : 'Passengers'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="cabin" className='text-primary'>Class</Label>
              <Select value={cabin} onValueChange={setCabin}>
                <SelectTrigger id="cabin" className="text-primary">
                  <SelectValue className="text-primary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy" className="text-primary">Economy</SelectItem>
                  <SelectItem value="premium" className="text-primary">Premium Economy</SelectItem>
                  <SelectItem value="business" className="text-primary">Business</SelectItem>
                  <SelectItem value="first" className="text-primary">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto px-12 py-6 text-lg" size="lg">
          <Search className="mr-2 h-5 w-5" /> Search Flights
        </Button>
      </form>
    </div>
  );
}
