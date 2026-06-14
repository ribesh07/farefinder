import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { airlines } from '@/data/airlines';

interface FlightCardProps {
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  stops: number;
}

export default function FlightCard({ airline, flightNumber, from, to, departure, arrival, duration, price, stops }: FlightCardProps) {
  const airlineData = airlines.find(a => a.name === airline);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              {airlineData?.logo && (
                <img src={airlineData.logo} alt={airline} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="font-semibold">{airline}</p>
              <p className="text-sm text-gray-500">{flightNumber}</p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-1 max-w-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">{departure}</p>
              <p className="text-sm text-gray-500">{from}</p>
            </div>
            <div className="flex-1 mx-4">
              <div className="flex items-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="mx-2">
                  <p className="text-xs text-gray-500 text-center">{duration}</p>
                  <Badge variant={stops === 0 ? 'default' : 'secondary'} className="mt-1">
                    {stops === 0 ? 'Non-stop' : `${stops} stop${stops > 1 ? 's' : ''}`}
                  </Badge>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{arrival}</p>
              <p className="text-sm text-gray-500">{to}</p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-3xl font-bold text-primary">£{price}</p>
            <p className="text-sm text-gray-500">per person</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pb-6 px-6">
        <Button>Select</Button>
      </CardFooter>
    </Card>
  );
}
