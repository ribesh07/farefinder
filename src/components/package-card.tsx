import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface PackageCardProps {
  image: string;
  title: string;
  destination: string;
  duration: string;
  hotelRating: number;
  startingPrice: number;
  description: string;
}

export default function PackageCard({ image, title, destination, duration, hotelRating, startingPrice, description }: PackageCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-sm font-semibold">
          {duration}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-2">{destination}</p>
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < hotelRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">{hotelRating} Star Hotel</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <div className="text-right">
          <p className="text-sm text-gray-500">From</p>
          <p className="text-2xl font-bold text-primary">£{startingPrice}</p>
          <p className="text-xs text-gray-400">per person</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full text-white">View Details</Button>
      </CardFooter>
    </Card>
  );
}
