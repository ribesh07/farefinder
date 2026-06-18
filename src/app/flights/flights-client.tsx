'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import FlightCard from '@/components/flight-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Filter, PlaneTakeoff, PlaneLanding, Calendar, Users } from 'lucide-react';

interface Flight {
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

export default function FlightsClient() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [stops, setStops] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const from = searchParams.get('from');
  const fromName = searchParams.get('fromName');
  const fromCity = searchParams.get('fromCity');
  const to = searchParams.get('to');
  const toName = searchParams.get('toName');
  const toCity = searchParams.get('toCity');
  const departure = searchParams.get('departure');
  const returnDate = searchParams.get('return');
  const passengers = searchParams.get('passengers');
  const cabin = searchParams.get('cabin');

  useEffect(() => {
    async function fetchFlights() {
      const response = await fetch('/api/flights');
      const data = await response.json();
      setFlights(data);
    }
    fetchFlights();
  }, []);

  const airlines = Array.from(new Set(flights.map(f => f.airline)));

  const filteredFlights = flights.filter(flight => {
    const airlineMatch = selectedAirlines.length === 0 || selectedAirlines.includes(flight.airline);
    const priceMatch = flight.farePrice >= priceRange[0] && flight.farePrice <= priceRange[1];
    const stopsMatch = stops.length === 0 || 
      (stops.includes('0') && flight.stops === 0) ||
      (stops.includes('1') && flight.stops === 1) ||
      (stops.includes('2+') && flight.stops >= 2);
    return airlineMatch && priceMatch && stopsMatch;
  });

  const toggleAirline = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline) ? prev.filter(a => a !== airline) : [...prev, airline]
    );
  };

  const toggleStops = (stop: string) => {
    setStops(prev => 
      prev.includes(stop) ? prev.filter(s => s !== stop) : [...prev, stop]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {/* Later on work on it flight filters */}
          {/* {(from || to || departure || passengers) && (
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-6">
                  {from && (
                    <div className="flex items-center gap-2">
                      <PlaneTakeoff className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                        <p className="font-medium text-primary">{fromName || from} ({from})</p>
                      </div>
                    </div>
                  )}
                  {to && (
                    <div className="flex items-center gap-2">
                      <PlaneLanding className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                        <p className="font-medium text-primary">{toName || to} ({to})</p>
                      </div>
                    </div>
                  )}
                  {departure && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Departure</p>
                        <p className="font-medium text-primary">{new Date(departure).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {passengers && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Passengers</p>
                        <p className="font-medium text-primary">{passengers}</p>
                      </div>
                    </div>
                  )}
                  {cabin && (
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Class</p>
                        <p className="font-medium text-primary">
                          {cabin.charAt(0).toUpperCase() + cabin.slice(1)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )} */}
          <p className="text-gray-600 dark:text-gray-300 mt-4">{filteredFlights.length} flights found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            className="lg:hidden mb-4 flex items-center"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>

          {/* Filters Sidebar */}
          <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Filters</h3>

              {/* Airlines */}
              <div className="mb-8">
                <h4 className="font-medium mb-3">Airlines</h4>
                <div className="space-y-2">
                  {airlines.map(airline => (
                    <div key={airline} className="flex items-center space-x-2">
                      <Checkbox
                        id={`airline-${airline}`}
                        checked={selectedAirlines.includes(airline)}
                        onCheckedChange={() => toggleAirline(airline)}
                      />
                      <Label htmlFor={`airline-${airline}`}>{airline}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-medium mb-3">Price Range</h4>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1500}
                  step={50}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>£{priceRange[0]}</span>
                  <span>£{priceRange[1]}</span>
                </div>
              </div>

              {/* Stops */}
              <div>
                <h4 className="font-medium mb-3">Stops</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="stops-0"
                      checked={stops.includes('0')}
                      onCheckedChange={() => toggleStops('0')}
                    />
                    <Label htmlFor="stops-0">Non-stop</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="stops-1"
                      checked={stops.includes('1')}
                      onCheckedChange={() => toggleStops('1')}
                    />
                    <Label htmlFor="stops-1">1 Stop</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="stops-2"
                      checked={stops.includes('2+')}
                      onCheckedChange={() => toggleStops('2+')}
                    />
                    <Label htmlFor="stops-2">2+ Stops</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div className="flex-1 space-y-4">
            {filteredFlights.map((flight) => (
              <FlightCard key={flight.id} {...flight} />
            ))}
            {filteredFlights.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No flights found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
