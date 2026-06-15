"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import {
  hashPassword,
  verifyPassword,
  createToken,
  setAuthCookie,
  removeAuthCookie,
} from "@/lib/auth"
import {
  loginSchema,
  flightSchema,
  holidayPackageSchema,
  destinationSchema,
  blogPostSchema,
  testimonialSchema,
  dealSchema,
  flightLeadSchema,
  packageLeadSchema,
  contactInquirySchema,
  newsletterSchema,
} from "@/types"

export async function login(prevState: any, formData: FormData) {
  console.log("Login action called")
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validated.success) {
    console.log("Validation failed:", validated.error)
    return { success: false, error: "Invalid credentials" }
  }

  const { email, password } = validated.data
  console.log("Attempting login for email:", email)

  const user = await prisma.adminUser.findUnique({ where: { email } })
  console.log("Found user:", user)
  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  console.log("Password valid:", isValid)
  if (!isValid) {
    return { success: false, error: "Invalid credentials" }
  }
  
  const token = await createToken(user.id, user.role)
  console.log("Created token:", token)
  
  // Set cookie directly
  const cookieStore = require("next/headers").cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  console.log("Cookie set, redirecting to /admin")
  
  // Use redirect - this will throw an error that Next.js catches
  redirect("/admin")
}

export async function logout() {
  const cookieStore = require("next/headers").cookies()
  cookieStore.delete("auth-token")
  redirect("/admin/login")
}

// Flight actions
export async function createFlight(data: unknown) {
  console.log("createFlight called with data:", data)
  const validated = flightSchema.safeParse(data)
  if (!validated.success) {
    console.error("Validation errors:", validated.error)
    return { success: false, error: "Invalid data: " + JSON.stringify(validated.error.issues) }
  }
  const { departureTime, arrivalTime, ...rest } = validated.data
  console.log("Creating flight with:", { ...rest, departureTime, arrivalTime })
  try {
    const flight = await prisma.flight.create({
      data: {
        ...rest,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
      },
    })
    console.log("Flight created successfully:", flight)
    revalidatePath("/admin/flights")
    return { success: true }
  } catch (err) {
    console.error("Error creating flight in Prisma:", err)
    return { success: false, error: "Failed to create flight" }
  }
}

export async function updateFlight(id: string, data: unknown) {
  const validated = flightSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  const { departureTime, arrivalTime, ...rest } = validated.data
  await prisma.flight.update({
    where: { id },
    data: {
      ...rest,
      departureTime: new Date(departureTime),
      arrivalTime: new Date(arrivalTime),
    },
  })
  revalidatePath("/admin/flights")
  return { success: true }
}

export async function deleteFlight(id: string) {
  await prisma.flight.delete({ where: { id } })
  revalidatePath("/admin/flights")
}

// Holiday package actions
export async function createHolidayPackage(data: unknown) {
  const validated = holidayPackageSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.holidayPackage.create({ data: validated.data })
  revalidatePath("/admin/packages")
  return { success: true }
}

export async function updateHolidayPackage(id: string, data: unknown) {
  const validated = holidayPackageSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.holidayPackage.update({ where: { id }, data: validated.data })
  revalidatePath("/admin/packages")
  return { success: true }
}

export async function deleteHolidayPackage(id: string) {
  await prisma.holidayPackage.delete({ where: { id } })
  revalidatePath("/admin/packages")
}

// Destination actions
export async function createDestination(data: unknown) {
  const validated = destinationSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.destination.create({ data: validated.data })
  revalidatePath("/admin/destinations")
  return { success: true }
}

export async function updateDestination(id: string, data: unknown) {
  const validated = destinationSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.destination.update({ where: { id }, data: validated.data })
  revalidatePath("/admin/destinations")
  return { success: true }
}

export async function deleteDestination(id: string) {
  await prisma.destination.delete({ where: { id } })
  revalidatePath("/admin/destinations")
}

// Blog actions
export async function createBlogPost(data: unknown) {
  const validated = blogPostSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.blogPost.create({ data: validated.data })
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function updateBlogPost(id: string, data: unknown) {
  const validated = blogPostSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.blogPost.update({ where: { id }, data: validated.data })
  revalidatePath("/admin/blog")
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } })
  revalidatePath("/admin/blog")
}

// Testimonial actions
export async function createTestimonial(data: unknown) {
  const validated = testimonialSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.testimonial.create({ data: validated.data })
  revalidatePath("/admin/testimonials")
  return { success: true }
}

export async function updateTestimonial(id: string, data: unknown) {
  const validated = testimonialSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.testimonial.update({ where: { id }, data: validated.data })
  revalidatePath("/admin/testimonials")
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/admin/testimonials")
}

// Deal actions
export async function createDeal(data: unknown) {
  const validated = dealSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.deal.create({ data: validated.data })
  revalidatePath("/admin/deals")
  return { success: true }
}

export async function updateDeal(id: string, data: unknown) {
  const validated = dealSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.deal.update({ where: { id }, data: validated.data })
  revalidatePath("/admin/deals")
  return { success: true }
}

export async function deleteDeal(id: string) {
  await prisma.deal.delete({ where: { id } })
  revalidatePath("/admin/deals")
}

// Lead actions
export async function createFlightLead(data: unknown) {
  const validated = flightLeadSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  const { departureDate, returnDate, ...rest } = validated.data
  await prisma.flightBookingLead.create({
    data: {
      ...rest,
      departureDate: new Date(departureDate),
      returnDate: returnDate ? new Date(returnDate) : null,
    },
  })
  return { success: true }
}

export async function createPackageLead(data: unknown) {
  const validated = packageLeadSchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.packageLead.create({ data: validated.data })
  return { success: true }
}

// Contact inquiry
export async function createContactInquiry(data: unknown) {
  const validated = contactInquirySchema.safeParse(data)
  if (!validated.success) {
    return { success: false, error: "Invalid data" }
  }
  await prisma.contactInquiry.create({ data: validated.data })
  return { success: true }
}

// Newsletter
export async function subscribeToNewsletter(email: string) {
  const validated = newsletterSchema.safeParse({ email })
  if (!validated.success) {
    return { success: false, error: "Invalid email" }
  }
  try {
    await prisma.newsletterSubscriber.create({
      data: { email: validated.data.email },
    })
  } catch {
    // Ignore duplicate errors
  }
  return { success: true }
}

// Flight Lead actions
export async function updateFlightLeadStatus(id: string, status: string, internalNotes?: string) {
  await prisma.flightBookingLead.update({
    where: { id },
    data: {
      status: status as any,
      internalNotes,
    },
  })
  revalidatePath("/admin/leads")
}

export async function deleteFlightLead(id: string) {
  await prisma.flightBookingLead.delete({ where: { id } })
  revalidatePath("/admin/leads")
}

// Package Lead actions
export async function updatePackageLeadStatus(id: string, status: string, internalNotes?: string) {
  await prisma.packageLead.update({
    where: { id },
    data: {
      status: status as any,
      internalNotes,
    },
  })
  revalidatePath("/admin/leads")
}

export async function deletePackageLead(id: string) {
  await prisma.packageLead.delete({ where: { id } })
  revalidatePath("/admin/leads")
}

// Contact Inquiry actions
export async function updateContactInquiryStatus(id: string, status: string) {
  await prisma.contactInquiry.update({
    where: { id },
    data: {
      status: status as any,
    },
  })
  revalidatePath("/admin/inquiries")
}

export async function deleteContactInquiry(id: string) {
  await prisma.contactInquiry.delete({ where: { id } })
  revalidatePath("/admin/inquiries")
}

// Settings actions
export async function updateSettings(data: any) {
  await prisma.websiteSettings.upsert({
    where: { id: "default" },
    update: {
      companyName: data.companyName,
      supportEmail: data.supportEmail,
      supportPhone: data.supportPhone,
      whatsappNumber: data.whatsappNumber,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      twitter: data.twitter || null,
      linkedin: data.linkedin || null,
      officeAddress: data.officeAddress,
      smtpHost: data.smtpHost || null,
      smtpPort: data.smtpPort ? Number(data.smtpPort) : null,
      smtpUser: data.smtpUser || null,
      smtpPassword: data.smtpPassword || null,
    },
    create: {
      id: "default",
      companyName: data.companyName,
      supportEmail: data.supportEmail,
      supportPhone: data.supportPhone,
      whatsappNumber: data.whatsappNumber,
      facebook: data.facebook || null,
      instagram: data.instagram || null,
      twitter: data.twitter || null,
      linkedin: data.linkedin || null,
      officeAddress: data.officeAddress,
      smtpHost: data.smtpHost || null,
      smtpPort: data.smtpPort ? Number(data.smtpPort) : null,
      smtpUser: data.smtpUser || null,
      smtpPassword: data.smtpPassword || null,
    },
  })
  revalidatePath("/admin/settings")
  return { success: true }
}

export async function exportNewsletterSubscribers() {
  const subscribers = await prisma.newsletterSubscriber.findMany()
  return subscribers
}
