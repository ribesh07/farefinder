import Link from 'next/link';
import HeroSearch from '@/components/hero-search';
import DestinationCard from '@/components/destination-card';
import PackageCard from '@/components/package-card';
import TestimonialCard from '@/components/testimonial-card';
import BlogCard from '@/components/blog-card';
import Newsletter from '@/components/newsletter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Award, Globe } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import HomeClient from './home-client';

async function getHomeData() {
  const destinations = await prisma.destination.findMany({
    where: { active: true, featured: true },
    take: 4,
  });
  const packages = await prisma.holidayPackage.findMany({
    where: { active: true, featured: true },
    take: 4,
  });
  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    take: 3,
  });
  const blogs = await prisma.blogPost.findMany({
    where: { published: true },
    take: 4,
  });
  return { destinations, packages, testimonials, blogs };
}

export default async function Home() {
  const data = await getHomeData();
  return <HomeClient {...data} />;
}
