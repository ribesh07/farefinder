'use client';

import { motion } from 'framer-motion';
import Newsletter from '@/components/newsletter';
import { testimonials } from '@/data/testimonials';
import TestimonialCard from '@/components/testimonial-card';
import { Globe, Users, Award, Heart, TrendingUp, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '1M+', label: 'Happy Customers' },
    { number: '500+', label: 'Destinations' },
    { number: '100+', label: 'Airlines' },
    { number: '24/7', label: 'Support' },
  ];

  const values = [
    { icon: <Heart className="h-8 w-8 text-primary" />, title: 'Customer First', description: 'We always put our customers at the heart of everything we do' },
    { icon: <TrendingUp className="h-8 w-8 text-primary" />, title: 'Best Prices', description: 'We are committed to finding you the best deals available' },
    { icon: <CheckCircle className="h-8 w-8 text-primary" />, title: 'Trust & Transparency', description: 'No hidden fees - what you see is what you get' },
    { icon: <Award className="h-8 w-8 text-primary" />, title: 'Excellence', description: 'We strive for excellence in every aspect of our service' },
  ];

  return (
    
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FareFinderUK</h1>
          <p className="text-xl opacity-90">Your trusted travel partner since 2026</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                FareFinderUK was founded in 2026 with a simple mission: to make travel accessible and affordable for everyone. 
                What started as a small family business has grown into one of the UK's most trusted travel platforms.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Over the years, we've helped millions of travellers find their perfect flights and holiday packages. 
                Our commitment to excellent customer service and competitive prices has made us the go-to choice for travellers across the UK.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Today, we continue to innovate and improve, always keeping our customers at the heart of everything we do.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/2209444/pexels-photo-2209444.jpeg"
                  alt="Our Team"
                className="w-full h-full object-contain rounded-3xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="mx-auto mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
            </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our happy customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
