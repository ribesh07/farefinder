import DestinationCard from '@/components/destination-card';
import Newsletter from '@/components/newsletter';
import { destinations } from '@/data/destinations';

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Popular Destinations</h1>
          <p className="text-xl opacity-90">Explore amazing destinations around the world</p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.id} {...dest} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
