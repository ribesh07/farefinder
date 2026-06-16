'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DealBookingModal from './DealBookingModal';

interface DealCardProps {
  id: string;
  image: string;
  title: string;
  type: string;
  description?: string;
  newPrice: number;
  oldPrice?: number;
}

export default function DealCard({ id, image, title, type, description, newPrice, oldPrice }: DealCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const savings = oldPrice && oldPrice > newPrice ? oldPrice - newPrice : null;
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="capitalize">{type.replace('-', ' ')}</Badge>
          </div>
          {savings && (
            <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
              Save £{Math.round(savings)}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          {description && <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{description}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              {oldPrice && (
                <p className="text-sm text-gray-500 line-through">£{oldPrice}</p>
              )}
              <p className="text-2xl font-bold text-primary">£{newPrice}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>Book Now</Button>
        </CardFooter>
      </Card>

      <DealBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={{ id, title, type, newPrice, oldPrice }}
      />
    </>
  );
}
