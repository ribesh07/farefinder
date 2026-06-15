import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star, User } from 'lucide-react';

interface TestimonialCardProps {
  image?: string;
  avatar?: string;
  name: string;
  location?: string;
  role?: string;
  review?: string;
  content?: string;
  rating: number;
}

export default function TestimonialCard({ image, avatar, name, location, role, review, content, rating }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{review || content}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center space-x-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {image || avatar ? (
            <img src={image || avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-primary" />
          )}
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </CardFooter>
    </Card>
  );
}
