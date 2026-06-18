import { Metadata } from 'next';
// import Link from 'next/link';
// import HeroSearch from '@/components/hero-search';
// import DestinationCard from '@/components/destination-card';
// import PackageCard from '@/components/package-card';
// import TestimonialCard from '@/components/testimonial-card';
// import BlogCard from '@/components/blog-card';
// import Newsletter from '@/components/newsletter';
// import { Button } from '@/components/ui/button';
// import { CheckCircle, Users, Award, Globe } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import HomeClient from './home-client';


export const metadata: Metadata = {
  title: "FareFinderUK | Cheap Flights, Holidays & Travel Deals",
  description:
    "Compare and book cheap flights, holiday packages, and travel deals from the UK. Find the best fares from London, Manchester, Birmingham and Edinburgh.",
  keywords: [
    "FareFinderUK",
    "cheap flights UK",
    "flight booking UK",
    "holiday packages UK",
    "travel agency UK",
    "flights from London",
    "flights from Manchester",
    "Dubai holidays",
    "Turkey holidays",
    "Spain holidays",
    "flight deals UK"
  ],
};

export const dynamic = "force-dynamic";

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
