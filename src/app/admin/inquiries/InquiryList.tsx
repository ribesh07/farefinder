"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateContactInquiryStatus, deleteContactInquiry } from "@/actions"
import { Edit2, Trash2 } from "lucide-react"

export default function InquiryList({ inquiries }: { inquiries: any[] }) {
  return (
    <div className="grid gap-4">
      {inquiries.map((inquiry) => (
        <InquiryCard key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  )
}

function InquiryCard({ inquiry }: { inquiry: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState(inquiry.status)

  const handleSave = async () => {
    await updateContactInquiryStatus(inquiry.id, status)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      await deleteContactInquiry(inquiry.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{inquiry.name}</CardTitle>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit Status
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
          <div><span className="text-gray-500">Email:</span> {inquiry.email}</div>
          {inquiry.phone && <div><span className="text-gray-500">Phone:</span> {inquiry.phone}</div>}
        </div>
        <div><span className="text-gray-500">Message:</span> {inquiry.message}</div>
        {isEditing ? (
          <div className="mt-4">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="REPLIED">Replied</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-gray-500">Status:</span>
            <StatusBadge status={status} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    NEW: "bg-blue-100 text-blue-800",
    REPLIED: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-green-100 text-green-800",
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  )
}
