import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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
      supportEmail: 'support@farefinderuk.com',
      supportPhone: '+44 20 7123 4567',
      whatsappNumber: '+9779862551025',
      officeAddress: '123 Travel Street, London, UK'
    }
  })

  // Create sample destinations
  await prisma.destination.createMany({
    data: [
      { name: 'London', slug: 'london', country: 'UK', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=london%20skyline%20big%20ben%20modern%20photography&image_size=square_hd', description: 'The vibrant capital city of the UK', startingFare: 89, featured: true, active: true },
      { name: 'Paris', slug: 'paris', country: 'France', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=eiffel%20tower%20paris%20france%20photography&image_size=square_hd', description: 'The City of Light', startingFare: 99, featured: true, active: true },
      { name: 'Dubai', slug: 'dubai', country: 'UAE', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=dubai%20skyline%20burj%20khalifa%20photography&image_size=square_hd', description: 'Luxury in the desert', startingFare: 420, featured: true, active: true },
      { name: 'New York', slug: 'new-york', country: 'USA', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=new%20york%20city%20skyline%20manhattan%20photography&image_size=square_hd', description: 'The city that never sleeps', startingFare: 520, featured: true, active: true }
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
      { title: 'Last Minute Escape to Spain', type: 'LAST_MINUTE', description: 'Great last minute deals!', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=spain%20beach%20sunshine%20vacation%20photography&image_size=square_hd', oldPrice: 349, newPrice: 199, active: true },
      { title: 'Student Discount - 15% Off All Flights', type: 'STUDENT', description: 'Exclusive for students!', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=student%20travel%20backpack%20airport%20photography&image_size=square_hd', oldPrice: null, newPrice: 0, active: true },
      { title: 'Family Package - Kids Fly Free', type: 'FAMILY', description: 'Family deals!', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=family%20airplane%20travel%20happy%20photography&image_size=square_hd', oldPrice: 899, newPrice: 599, active: true }
    ],
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
