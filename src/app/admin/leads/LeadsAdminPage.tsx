"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminListSkeleton } from "@/components/admin/AdminSkeleton";
import { AdminAlert } from "@/components/admin/AdminAlert";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { adminFetch } from "@/lib/admin-fetch";

type FlightLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  departureDate: string;
  adults: number;
  children: number;
  notes: string | null;
  status: string;
  internalNotes: string | null;
  flight?: { airline: string; flightNumber: string };
};

type PackageLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  travelers: number;
  notes: string | null;
  status: string;
  internalNotes: string | null;
  holidayPackage?: { title: string };
};

type DestinationLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  travelers: number;
  notes: string | null;
  status: string;
  internalNotes: string | null;
  destination?: { name: string };
};

type DealLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  travelers: number;
  notes: string | null;
  status: string;
  internalNotes: string | null;
  deal?: { title: string };
};

export default function LeadsAdminPage() {
  const [flightLeads, setFlightLeads] = useState<FlightLead[]>([]);
  const [packageLeads, setPackageLeads] = useState<PackageLead[]>([]);
  const [destinationLeads, setDestinationLeads] = useState<DestinationLead[]>([]);
  const [dealLeads, setDealLeads] = useState<DealLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await adminFetch<{
      flightLeads: FlightLead[];
      packageLeads: PackageLead[];
      destinationLeads: DestinationLead[];
      dealLeads: DealLead[];
    }>("/leads");

    if (result.ok) {
      setFlightLeads(result.data.flightLeads);
      setPackageLeads(result.data.packageLeads);
      setDestinationLeads(result.data.destinationLeads);
      setDealLeads(result.data.dealLeads);
    } else {
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Leads"
        description="Review and manage flight, package, destination, and deal booking leads."
      />

      {error && <AdminAlert type="error" message={error} />}

      {loading ? (
        <AdminListSkeleton count={3} />
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-xl font-semibold">Flight Booking Leads</h2>
            {flightLeads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No flight leads yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {flightLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    type="flight"
                    onUpdated={loadLeads}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Package Leads</h2>
            {packageLeads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No package leads yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {packageLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    type="package"
                    onUpdated={loadLeads}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Destination Leads</h2>
            {destinationLeads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No destination leads yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {destinationLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    type="destination"
                    onUpdated={loadLeads}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Deal Leads</h2>
            {dealLeads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  No deal leads yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {dealLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    type="deal"
                    onUpdated={loadLeads}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function LeadCard({
  lead,
  type,
  onUpdated,
}: {
  lead: FlightLead | PackageLead | DestinationLead | DealLead;
  type: "flight" | "package" | "destination" | "deal";
  onUpdated: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(lead.status);
  const [internalNotes, setInternalNotes] = useState(lead.internalNotes || "");

  const handleSave = async () => {
    setIsSaving(true);
    let endpoint = "";
    if (type === "flight") endpoint = `/leads/flight/${lead.id}`;
    else if (type === "package") endpoint = `/leads/package/${lead.id}`;
    else if (type === "destination") endpoint = `/leads/destination/${lead.id}`;
    else if (type === "deal") endpoint = `/leads/deal/${lead.id}`;

    const result = await adminFetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ status, internalNotes }),
    });

    setIsSaving(false);

    if (result.ok) {
      setIsEditing(false);
      onUpdated();
    } else {
      window.alert(result.error);
    }
  };

  const getDeleteEndpoint = () => {
    if (type === "flight") return `/leads/flight/${lead.id}`;
    if (type === "package") return `/leads/package/${lead.id}`;
    if (type === "destination") return `/leads/destination/${lead.id}`;
    if (type === "deal") return `/leads/deal/${lead.id}`;
    return "";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{lead.fullName}</CardTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <DeleteButton
                  endpoint={getDeleteEndpoint()}
                  itemName={lead.fullName}
                  onDeleted={onUpdated}
                />
              </>
            ) : (
              <>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <div>
            <span className="text-gray-500">Email:</span> {lead.email}
          </div>
          <div>
            <span className="text-gray-500">Phone:</span> {lead.phone}
          </div>
          {lead.whatsapp && (
            <div>
              <span className="text-gray-500">WhatsApp:</span> {lead.whatsapp}
            </div>
          )}
        </div>

        {type === "flight" && "departureDate" in lead && (
          <>
            <div>
              <span className="text-gray-500">Flight:</span>{" "}
              {lead.flight?.airline} {lead.flight?.flightNumber}
            </div>
            <div>
              <span className="text-gray-500">Travel Date:</span>{" "}
              {new Date(lead.departureDate).toLocaleDateString()}
            </div>
            <div>
              <span className="text-gray-500">Passengers:</span> {lead.adults}{" "}
              adults
              {lead.children > 0 && ` + ${lead.children} children`}
            </div>
          </>
        )}

        {type === "package" && "travelers" in lead && "holidayPackage" in lead && (
          <>
            <div>
              <span className="text-gray-500">Package:</span>{" "}
              {lead.holidayPackage?.title}
            </div>
            <div>
              <span className="text-gray-500">Travelers:</span> {lead.travelers}
            </div>
          </>
        )}

        {type === "destination" && "travelers" in lead && "destination" in lead && (
          <>
            <div>
              <span className="text-gray-500">Destination:</span>{" "}
              {lead.destination?.name}
            </div>
            <div>
              <span className="text-gray-500">Travelers:</span> {lead.travelers}
            </div>
          </>
        )}

        {type === "deal" && "travelers" in lead && "deal" in lead && (
          <>
            <div>
              <span className="text-gray-500">Deal:</span>{" "}
              {lead.deal?.title}
            </div>
            <div>
              <span className="text-gray-500">Travelers:</span> {lead.travelers}
            </div>
          </>
        )}

        {lead.notes && (
          <div>
            <span className="text-gray-500">Notes:</span> {lead.notes}
          </div>
        )}

        {isEditing ? (
          <div className="mt-4 space-y-2">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUOTED">Quoted</SelectItem>
                  <SelectItem value="BOOKED">Booked</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Internal Notes</Label>
              <Textarea
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
                rows={2}
              />
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-gray-500">Status:</span>
            <StatusBadge status={status} />
          </div>
        )}

        {!isEditing && lead.internalNotes && (
          <div className="mt-2 rounded border border-yellow-200 bg-yellow-50 p-2">
            <span className="font-semibold text-gray-500">Internal Notes:</span>{" "}
            {lead.internalNotes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    QUOTED: "bg-purple-100 text-purple-800",
    BOOKED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded px-2 py-1 text-xs font-semibold ${colors[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status}
    </span>
  );
}
