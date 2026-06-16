"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { AdminFormSkeleton } from "@/components/admin/AdminSkeleton";
import { adminFetch } from "@/lib/admin-fetch";

interface Settings {
  id: string;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  officeAddress: string;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPassword: string | null;
}

export default function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    async function loadSettings() {
      const result = await adminFetch<Settings>("/settings");
      if (result.ok) {
        const settings = result.data;
        reset({
          companyName: settings.companyName,
          supportEmail: settings.supportEmail,
          supportPhone: settings.supportPhone,
          whatsappNumber: settings.whatsappNumber,
          facebook: settings.facebook || "",
          instagram: settings.instagram || "",
          twitter: settings.twitter || "",
          linkedin: settings.linkedin || "",
          officeAddress: settings.officeAddress,
          smtpHost: settings.smtpHost || "",
          smtpPort: settings.smtpPort || "",
          smtpUser: settings.smtpUser || "",
          smtpPassword: settings.smtpPassword || "",
        });
      } else {
        setError(result.error);
      }
      setIsFetching(false);
    }

    loadSettings();
  }, [reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await adminFetch("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    setIsLoading(false);

    if (result.ok) {
      setSuccess("Settings saved successfully.");
    } else {
      setError(result.error);
    }
  };

  const handleExport = async () => {
    const result = await adminFetch<Array<{ email: string; subscribedAt: string }>>(
      "/newsletter"
    );

    if (!result.ok) {
      window.alert(result.error);
      return;
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Email,Subscribed At\n" +
      result.data
        .map(
          (subscriber) =>
            `${subscriber.email},${new Date(subscriber.subscribedAt).toLocaleString()}`
        )
        .join("\n");

    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isFetching) {
    return <AdminFormSkeleton />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {error && <AdminAlert type="error" message={error} />}
      {success && <AdminAlert type="success" message={success} />}

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Company Name</Label>
                <Input {...register("companyName")} />
              </div>
              <div>
                <Label>Support Email</Label>
                <Input {...register("supportEmail")} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Facebook</Label>
                <Input {...register("facebook")} />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input {...register("instagram")} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>SMTP Host</Label>
                    <Input {...register("smtpHost")} placeholder="smtp.example.com" />
                  </div>
                  <div>
                    <Label>SMTP Port</Label>
                    <Input type="number" {...register("smtpPort")} placeholder="587" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
              <Button type="button" variant="secondary" onClick={handleExport}>
                Export Newsletter Subscribers
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
