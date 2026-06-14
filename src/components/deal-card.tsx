import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DealCardProps {
  image: string;
  title: string;
  type: string;
  price?: number;
  originalPrice?: number;
  savings?: number;
  expires: string;
}

export default function DealCard({ image, title, type, price, originalPrice, savings, expires }: DealCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="capitalize">{type}</Badge>
        </div>
        {savings && (
          <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-bold">
            Save £{savings}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          {price && (
            <div className="flex items-baseline space-x-2">
              {originalPrice && (
                <p className="text-sm text-gray-500 line-through">£{originalPrice}</p>
              )}
              <p className="text-2xl font-bold text-primary">£{price}</p>
            </div>
          )}
          <p className="text-sm text-gray-500">Expires in {expires}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">Book Now</Button>
      </CardFooter>
    </Card>
  );
}
