import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const flightSchema = z.object({
  airline: z.string(),
  logo: z.string().nullable().optional(),
  flightNumber: z.string(),
  fromAirport: z.string(),
  toAirport: z.string(),
  departureTime: z.string().nullable().optional(),
  arrivalTime: z.string().nullable().optional(),
  duration: z.string(),
  stops: z.number().int().min(0),
  cabinClass: z.string(),
  baggageInfo: z.string().optional(),
  farePrice: z.number().min(0),
  oldPrice: z.number().min(0).optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const holidayPackageSchema = z.object({
  title: z.string(),
  destination: z.string(),
  image: z.string(),
  description: z.string(),
  duration: z.string(),
  hotelRating: z.number().int().min(1).max(5),
  startingPrice: z.number().min(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const destinationSchema = z.object({
  name: z.string(),
  slug: z.string(),
  country: z.string(),
  image: z.string(),
  description: z.string(),
  startingFare: z.number().min(0),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
})

export const blogPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  featuredImage: z.string(),
  category: z.string(),
  author: z.string(),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const testimonialSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  image: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  review: z.string(),
  featured: z.boolean().default(false),
})

export const dealSchema = z.object({
  title: z.string(),
  type: z.enum(["LAST_MINUTE", "STUDENT", "FAMILY", "BUSINESS"]),
  description: z.string().optional(),
  image: z.string(),
  oldPrice: z.number().min(0).optional(),
  newPrice: z.number().min(0),
  active: z.boolean().default(true),
})

export const flightLeadSchema = z.object({
  flightId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  adults: z.number().int().min(1),
  children: z.number().int().min(0).default(0),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  notes: z.string().optional(),
})

export const packageLeadSchema = z.object({
  packageId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  travelers: z.number().int().min(1),
  notes: z.string().optional(),
})

export const destinationLeadSchema = z.object({
  destinationId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  travelers: z.number().int().min(1),
  notes: z.string().optional(),
})

export const dealLeadSchema = z.object({
  dealId: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  travelers: z.number().int().min(1),
  notes: z.string().optional(),
})

export const contactInquirySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string(),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
})
