'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as Popover from '@radix-ui/react-popover';
import { PlaneTakeoff, PlaneLanding, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface Airport {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

interface AirportInputProps {
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  icon?: React.ElementType;
  className?: string;
}

export default function AirportInput({ placeholder, value, onChange, icon: Icon, className }: AirportInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (value) {
      setSearchQuery(`${value.name} (${value.code})`);
    } else {
      setSearchQuery('');
    }
  }, [value]);

  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setAirports([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/airports?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setAirports(data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching airports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  const handleSelectAirport = (airport: Airport) => {
    onChange(airport);
    setSearchQuery(`${airport.name} (${airport.code})`);
    setOpen(false);
    setAirports([]);
  };

  const handleClear = () => {
    onChange(null);
    setSearchQuery('');
    setAirports([]);
    setOpen(false);
  };

  return (
    <Popover.Root open={open && airports.length > 0} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <div className={cn("relative w-full", className)}>
          {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />}
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery.length >= 2 && handleSearch(searchQuery)}
            className={cn("pl-10 pr-10 text-primary", className)}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-[var(--radix-popover-trigger-width)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto"
          align="start"
          sideOffset={4}
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              Loading airports...
            </div>
          ) : (
            airports.map((airport) => (
              <button
                key={airport.id}
                type="button"
                onClick={() => handleSelectAirport(airport)}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="font-medium text-primary">
                  {airport.name} ({airport.code})
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {airport.city}, {airport.country}
                </div>
              </button>
            ))
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
