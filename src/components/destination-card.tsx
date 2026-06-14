import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DestinationCardProps {
  image: string;
  name: string;
  country: string;
  description: string;
  price: number;
}

export default function DestinationCard({ image, name, country, description, price }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-sm opacity-90">{country}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="text-2xl font-bold text-primary">£{price}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href="/flights" className="w-full">
          <Button className="w-full text-white">View Flights</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
