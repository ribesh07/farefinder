"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateSettings, exportNewsletterSubscribers } from "@/actions"

interface Settings {
  id: string
  companyName: string
  supportEmail: string
  supportPhone: string
  whatsappNumber: string
  facebook: string | null
  instagram: string | null
  twitter: string | null
  linkedin: string | null
  officeAddress: string
  smtpHost: string | null
  smtpPort: number | null
  smtpUser: string | null
  smtpPassword: string | null
}

export default function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      companyName: initialSettings.companyName,
      supportEmail: initialSettings.supportEmail,
      supportPhone: initialSettings.supportPhone,
      whatsappNumber: initialSettings.whatsappNumber,
      facebook: initialSettings.facebook || "",
      instagram: initialSettings.instagram || "",
      twitter: initialSettings.twitter || "",
      linkedin: initialSettings.linkedin || "",
      officeAddress: initialSettings.officeAddress,
      smtpHost: initialSettings.smtpHost || "",
      smtpPort: initialSettings.smtpPort || "",
      smtpUser: initialSettings.smtpUser || "",
      smtpPassword: initialSettings.smtpPassword || "",
    },
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    await updateSettings(data)
    setIsLoading(false)
  }

  const handleExport = async () => {
    const subscribers = await exportNewsletterSubscribers()
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Email,Subscribed At\n"
      + subscribers.map(s => `${s.email},${new Date(s.subscribedAt).toLocaleString()}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "newsletter_subscribers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Company Info */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input {...register("companyName")} />
              </div>
              <div>
                <Label>Support Email</Label>
                <Input {...register("supportEmail")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Support Phone</Label>
                <Input {...register("supportPhone")} />
              </div>
              <div>
                <Label>WhatsApp Number</Label>
                <Input {...register("whatsappNumber")} />
              </div>
            </div>

            <div>
              <Label>Office Address</Label>
              <Input {...register("officeAddress")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Facebook</Label>
                <Input {...register("facebook")} />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input {...register("instagram")} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Twitter</Label>
                <Input {...register("twitter")} />
              </div>
              <div>
                <Label>LinkedIn</Label>
                <Input {...register("linkedin")} />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>SMTP Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>SMTP Host</Label>
                    <Input {...register("smtpHost")} placeholder="smtp.example.com" />
                  </div>
                  <div>
                    <Label>SMTP Port</Label>
                    <Input type="number" {...register("smtpPort")} placeholder="587" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>SMTP User</Label>
                    <Input {...register("smtpUser")} placeholder="user@example.com" />
                  </div>
                  <div>
                    <Label>SMTP Password</Label>
                    <Input type="password" {...register("smtpPassword")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
              <Button type="button" variant="secondary" onClick={handleExport}>
                Export Newsletter Subscribers
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}