import DealCard from '@/components/deal-card';
import Newsletter from '@/components/newsletter';
import { deals } from '@/data/deals';

export default function DealsPage() {
  const dealTypes = [
    { key: 'last-minute', label: 'Last Minute Deals' },
    { key: 'student', label: 'Student Deals' },
    { key: 'family', label: 'Family Deals' },
    { key: 'business', label: 'Business Class Offers' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-secondary to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Amazing Deals</h1>
          <p className="text-xl opacity-90">Don't miss out on these incredible offers</p>
        </div>
      </section>

      {/* Deals Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dealTypes.map((type) => {
            const filteredDeals = deals.filter(deal => deal.type === type.key);
            if (filteredDeals.length === 0) return null;
            
            return (
              <div key={type.key} className="mb-16 last:mb-0">
                <h2 className="text-2xl font-bold mb-8">{type.label}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDeals.map((deal) => (
                    <DealCard key={deal.id} {...deal} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
