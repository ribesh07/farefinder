'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroSearch from '@/components/hero-search';
import DestinationCard from '@/components/destination-card';
import PackageCard from '@/components/package-card';
import TestimonialCard from '@/components/testimonial-card';
import BlogCard from '@/components/blog-card';
import Newsletter from '@/components/newsletter';
import { destinations } from '@/data/destinations';
import { packages } from '@/data/packages';
import { testimonials } from '@/data/testimonials';
import { blogs } from '@/data/blogs';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Award, Globe } from 'lucide-react';

export default function Home() {
  const features = [
    { icon: <CheckCircle className="h-8 w-8 text-primary" />, title: 'Best Prices', description: 'We find the cheapest flights and holidays for you' },
    { icon: <Users className="h-8 w-8 text-primary" />, title: '24/7 Support', description: 'Our customer service team is always here to help' },
    { icon: <Award className="h-8 w-8 text-primary" />, title: 'Trust & Security', description: 'Your bookings are safe and secure with us' },
    { icon: <Globe className="h-8 w-8 text-primary" />, title: 'Wide Selection', description: 'Access to thousands of destinations worldwide' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=london%20skyline%20airplane%20flying%20travel%20photography&image_size=landscape_16_9"
            alt="Travel Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Perfect Flight</h1>
            <p className="text-xl md:text-2xl opacity-90">Discover amazing deals on flights, holidays, and more</p>
          </motion.div>
          <HeroSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center h-full"
            >
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10">
                {feature.icon}
              </div>

              <h3 className="text-lg font-semibold mb-2 min-h-[56px] flex items-center">
                {feature.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
              <p className="text-gray-600 dark:text-gray-300">Discover the most loved places to visit</p>
            </div>
            <Link href="/destinations">
              <Button variant="ghost">View All →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.slice(0, 4).map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <DestinationCard {...dest} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Holiday Packages */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Holiday Packages</h2>
              <p className="text-gray-600 dark:text-gray-300">All-inclusive deals for your perfect getaway</p>
            </div>
            <Link href="/holidays">
              <Button variant="ghost">View All →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.slice(0, 4).map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PackageCard {...pkg} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600 dark:text-gray-300">Trusted by thousands of happy travellers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Travel Tips</h2>
              <p className="text-gray-600 dark:text-gray-300">Travel inspiration and helpful guides</p>
            </div>
            <Link href="/blog">
              <Button variant="ghost">View All →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.slice(0, 4).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BlogCard {...blog} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
