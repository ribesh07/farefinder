import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  avatar: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export default function TestimonialCard({ avatar, name, role, content, rating }: TestimonialCardProps) {
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
        <p className="text-gray-600 dark:text-gray-300 mb-6">{content}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex items-center space-x-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
