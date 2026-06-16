import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
const flights = [
  {
    airline: "British Airways",
    logo: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=british%20airways%20logo%20simple&image_size=square_hd",
    flightNumber: "BA123",
    fromAirport: "LHR",
    toAirport: "DXB",
    departureTime: new Date("2026-07-10T08:00:00Z"),
    arrivalTime: new Date("2026-07-10T16:30:00Z"),
    duration: "8h 30m",
    farePrice: 450,
    stops: 0,
    cabinClass: "Economy",
    featured: true,
    active: true,
  },
  {
    airline: "Emirates",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/330px-Emirates_logo.svg.png?_=20250508163913",
    flightNumber: "EK456",
    fromAirport: "LGW",
    toAirport: "DUB",
    departureTime: new Date("2026-07-12T10:15:00Z"),
    arrivalTime: new Date("2026-07-12T12:00:00Z"),
    duration: "1h 45m",
    farePrice: 89,
    stops: 0,
    cabinClass: "Economy",
    active: true,
  },
  {
    airline: "Virgin Atlantic",
    logo: "https://upload.wikimedia.org/wikipedia/sco/thumb/4/42/British_Airways_Logo.svg/500px-British_Airways_Logo.svg.png?_=20190213185832",
    flightNumber: "VS789",
    fromAirport: "MAN",
    toAirport: "JFK",
    departureTime: new Date("2026-07-15T14:30:00Z"),
    arrivalTime: new Date("2026-07-15T22:45:00Z"),
    duration: "8h 15m",
    farePrice: 520,
    stops: 0,
    cabinClass: "Economy",
    featured: true,
    active: true,
  },
  {
    airline: "Turkish Airlines",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/62/Turkish_Airlines_logo_%28large%29.svg/1920px-Turkish_Airlines_logo_%28large%29.svg.png?_=20190119222725",
    flightNumber: "TK012",
    fromAirport: "EDI",
    toAirport: "IST",
    departureTime: new Date("2026-07-18T09:00:00Z"),
    arrivalTime: new Date("2026-07-18T15:30:00Z"),
    duration: "6h 30m",
    farePrice: 180,
    stops: 1,
    cabinClass: "Economy",
    active: true,
  },
  {
    airline: "Qatar Airways",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Qatar_Airways_logo.svg/250px-Qatar_Airways_logo.svg.png?_=20230512231452",
    flightNumber: "QR345",
    fromAirport: "BRS",
    toAirport: "DOH",
    departureTime: new Date("2026-07-20T11:45:00Z"),
    arrivalTime: new Date("2026-07-20T19:15:00Z"),
    duration: "6h 30m",
    farePrice: 220,
    stops: 0,
    cabinClass: "Economy",
    featured: true,
    active: true,
  },
];

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.createMany({
    data: [
      { name: 'Admin', email: 'admin@farefinderuk.com', passwordHash: hashedPassword, role: 'SUPER_ADMIN' }
    ],
    skipDuplicates: true
  })

  // Create settings
  await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'FareFinderUK',
      supportEmail: 'customerservice@farefinderuk.co.uk',
      supportPhone: '+44 7599 064917',
      whatsappNumber: '+44 7599 064917',
      officeAddress: 'Glassgow, UK'
    }
  })

  // Create sample destinations
  await prisma.destination.createMany({
    data: [
      { name: 'London', slug: 'london', country: 'UK', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=london%20skyline%20big%20ben%20modern%20photography&image_size=square_hd', description: 'The vibrant capital city of the UK', startingFare: 89, featured: true, active: true },
      { name: 'Paris', slug: 'paris', country: 'France', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=eiffel%20tower%20paris%20france%20photography&image_size=square_hd', description: 'The City of Light', startingFare: 99, featured: true, active: true },
      { name: 'Dubai', slug: 'dubai', country: 'UAE', image: 'https://thumbs.dreamstime.com/b/dubai-marina-beauty-view-rooftop-showing-cityscape-boats-sea-view-51444879.jpg', description: 'Luxury in the desert', startingFare: 420, featured: true, active: true },
      { name: 'New York', slug: 'new-york', country: 'USA', image: 'https://media.istockphoto.com/id/521714583/photo/new-york-city-midtown-with-empire-state-building-at-sunset.jpg?s=612x612&w=0&k=20&c=paLoZfZnaZSfaBK_DxLls_Ii0hD3r2PBKSlS6M1QxVU=', description: 'The city that never sleeps', startingFare: 520, featured: true, active: true }
    ],
    skipDuplicates: true
  })

  // Create sample packages
  await prisma.holidayPackage.createMany({
    data: [
      { title: 'Dubai Luxury Escape', destination: 'Dubai', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dubai%20luxury%20hotel%20beach%20resort%20photography&image_size=square_hd', description: 'All-inclusive luxury', duration: '7 Nights', hotelRating: 5, startingPrice: 1299, featured: true, active: true },
      { title: 'Turkish Riviera', destination: 'Antalya', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=antalya%20turkey%20beach%20resort%20photography&image_size=square_hd', description: 'Sun, sea, and sand', duration: '10 Nights', hotelRating: 4, startingPrice: 899, featured: true, active: true },
      { title: 'Majorca Getaway', destination: 'Majorca', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=majorca%20spain%20beach%20resort%20photography&image_size=square_hd', description: 'Mediterranean paradise', duration: '7 Nights', hotelRating: 4, startingPrice: 699, featured: true, active: true },
      { title: 'Greek Island Hopping', destination: 'Corfu', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=corfu%20greece%20beach%20resort%20photography&image_size=square_hd', description: 'Greek island escape', duration: '14 Nights', hotelRating: 3, startingPrice: 749, featured: true, active: true }
    ],
    skipDuplicates: true
  })

  // Create sample testimonials
  await prisma.testimonial.createMany({
    data: [
      { name: 'Jennifer Adams', location: 'London', image: null, rating: 5, review: 'FareFinderUK helped me save over £300 on my recent trip to New York. The search is so easy to use!', featured: true },
      { name: 'Marcus Brown', location: 'Manchester', image: null, rating: 5, review: 'As someone who travels weekly for work, I rely on FareFinderUK for the best prices and flexibility.', featured: true },
      { name: 'Sophie Clarke', location: 'Birmingham', image: null, rating: 5, review: 'Booked our family holiday to Majorca and it was the best price we found anywhere. Highly recommend!', featured: true }
    ],
    skipDuplicates: true
  })

  // Create sample blog posts
  await prisma.blogPost.createMany({
    data: [
      { title: 'Top 10 Budget Travel Tips for UK Travellers', slug: 'top-10-budget-travel-tips', excerpt: 'Discover how to travel smarter and cheaper with these essential tips...', content: 'Full blog content here...', featuredImage: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=budget%20travel%20tips%20luggage%20passport%20photography&image_size=square_hd', category: 'Tips', author: 'Sarah Johnson', published: true, seoTitle: 'Top 10 Budget Travel Tips for UK Travellers', seoDescription: 'Discover how to travel smarter and cheaper with these essential tips...' },
      { title: 'Best Time to Visit Dubai: A Complete Guide', slug: 'best-time-to-visit-dubai', excerpt: 'Find out when to visit this amazing city for the best weather and deals...', content: 'Full blog content here...', featuredImage: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dubai%20sunset%20skyline%20photography&image_size=square_hd', category: 'Destinations', author: 'Michael Chen', published: true, seoTitle: 'Best Time to Visit Dubai: A Complete Guide', seoDescription: 'Find out when to visit this amazing city for the best weather and deals...' },
      { title: 'Packing List for Tropical Destinations', slug: 'packing-list-for-tropical-destinations', excerpt: 'Everything you need to pack for your next tropical adventure...', content: 'Full blog content here...', featuredImage: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=packing%20suitcase%20beach%20essentials%20photography&image_size=square_hd', category: 'Tips', author: 'Emma Williams', published: true, seoTitle: 'Packing List for Tropical Destinations', seoDescription: 'Everything you need to pack for your next tropical adventure...' }
    ],
    skipDuplicates: true
  })

  // Create sample deals
  await prisma.deal.createMany({
    data: [
      { title: 'Last Minute Escape to Spain', type: 'LAST_MINUTE', description: 'Great last minute deals!', image: 'https://cdn1.tripoto.com/media/filter/tst/img/2176903/Image/1645949425_1_6.jpg.webp', oldPrice: 349, newPrice: 199, active: true },
      {title : 'Last Minute Escape to France', type: 'LAST_MINUTE', description: 'Perfect for a quick escape!', image: 'https://cdn.bunniktours.com.au/public/tours/highlight_images/Europe%202023/EU-Spain-Madrid-Florian-Wehde-feature.jpg', oldPrice: 299, newPrice: 239, active: true },
      { title: 'Student Discount - 15% Off All Flights', type: 'STUDENT', description: 'Exclusive for students!', image: 'https://t3.ftcdn.net/jpg/01/62/48/30/360_F_162483067_EmKnSSM2lCoiydIJsT2PqZL5Xo0Ky733.jpg', oldPrice: null, newPrice: 0, active: true },
      { title: 'Family Package - Kids Fly Free', type: 'FAMILY', description: 'Family deals!', image: 'https://images.unsplash.com/photo-1529180979161-06b8b6d6f2be?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFtaWx5JTIwdHJhdmVsfGVufDB8fDB8fHww', oldPrice: 899, newPrice: 599, active: true }
    ],
    skipDuplicates: true
  })

  await prisma.flight.createMany({
    data: flights,
    skipDuplicates: true
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
