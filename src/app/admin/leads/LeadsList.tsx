"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateFlightLeadStatus, deleteFlightLead, updatePackageLeadStatus, deletePackageLead } from "@/actions"
import { Edit2, Trash2 } from "lucide-react"

export default function LeadsList({
  flightLeads,
  packageLeads,
}: {
  flightLeads: any[]
  packageLeads: any[]
}) {
  return (
    <div className="space-y-8">
      {/* Flight Leads */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Flight Booking Leads</h2>
        <div className="grid gap-4">
          {flightLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} type="flight" />
          ))}
        </div>
      </div>

      {/* Package Leads */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Package Leads</h2>
        <div className="grid gap-4">
          {packageLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} type="package" />
          ))}
        </div>
      </div>
    </div>
  )
}

function LeadCard({ lead, type }: { lead: any; type: "flight" | "package" }) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(lead.status)
  const [internalNotes, setInternalNotes] = useState(lead.internalNotes || "")

  const handleSave = async () => {
    if (type === "flight") {
      await updateFlightLeadStatus(lead.id, status, internalNotes)
    } else {
      await updatePackageLeadStatus(lead.id, status, internalNotes)
    }
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this lead?")) {
      if (type === "flight") {
        await deleteFlightLead(lead.id)
      } else {
        await deletePackageLead(lead.id)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{lead.fullName}</CardTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={handleSave}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><span className="text-gray-500">Email:</span> {lead.email}</div>
          <div><span className="text-gray-500">Phone:</span> {lead.phone}</div>
          {lead.whatsapp && <div><span className="text-gray-500">WhatsApp:</span> {lead.whatsapp}</div>}
        </div>

        {type === "flight" && (
          <>
            <div><span className="text-gray-500">Flight:</span> {lead.flight?.airline} {lead.flight?.flightNumber}</div>
            <div><span className="text-gray-500">Travel Date:</span> {new Date(lead.departureDate).toLocaleDateString()}</div>
            <div><span className="text-gray-500">Passengers:</span> {lead.adults} adults {lead.children > 0 && `+ ${lead.children} children`}</div>
          </>
        )}

        {type === "package" && (
          <>
            <div><span className="text-gray-500">Package:</span> {lead.holidayPackage?.title}</div>
            <div><span className="text-gray-500">Travelers:</span> {lead.travelers}</div>
          </>
        )}

        {lead.notes && <div><span className="text-gray-500">Notes:</span> {lead.notes}</div>}

        {isEditing ? (
          <div className="space-y-2 mt-4">
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
              <Textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={2} />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500">Status:</span>
            <StatusBadge status={status} />
          </div>
        )}

        {!isEditing && lead.internalNotes && (
          <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
            <span className="text-gray-500 font-semibold">Internal Notes:</span> {lead.internalNotes}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-yellow-100 text-yellow-800",
    QUOTED: "bg-purple-100 text-purple-800",
    BOOKED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  )
}
