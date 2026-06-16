"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminChart from "@/components/AdminChart";
import { AdminDashboardSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { adminFetch } from "@/lib/admin-fetch";

type DashboardStats = {
  totalFlightLeads: number;
  totalPackageLeads: number;
  totalInquiries: number;
  totalSubscribers: number;
  totalFlights: number;
  totalPackages: number;
  totalBlogPosts: number;
};

const chartData = [
  { name: "Jan", leads: 40 },
  { name: "Feb", leads: 30 },
  { name: "Mar", leads: 50 },
  { name: "Apr", leads: 45 },
  { name: "May", leads: 60 },
  { name: "Jun", leads: 55 },
];

export default function DashboardAdmin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      const result = await adminFetch<DashboardStats>("/dashboard");
      if (result.ok) {
        setStats(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <AdminAlert type="error" message={error ?? "Failed to load dashboard"} />
      </div>
    );
  }

  const cards = [
    { label: "Flight Leads", value: stats.totalFlightLeads },
    { label: "Package Leads", value: stats.totalPackageLeads },
    { label: "Inquiries", value: stats.totalInquiries },
    { label: "Subscribers", value: stats.totalSubscribers },
    { label: "Total Flights", value: stats.totalFlights },
    { label: "Total Packages", value: stats.totalPackages },
    { label: "Blog Posts", value: stats.totalBlogPosts },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <AdminChart chartData={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
