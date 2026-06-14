import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';

interface BlogCardProps {
  image: string;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
}

export default function BlogCard({ image, title, author, date, category, excerpt }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
      <Link href="/blog" className="block">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-4">
          <Badge className="mb-3 text-white">{category}</Badge>
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{excerpt}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
