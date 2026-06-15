"use client";

import { sendToWhatsApp } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const handleClick = () => {
    const url = sendToWhatsApp({
      title: "General Inquiry",
      message: "Hello FareFinderUK, I would like a flight quotation.",
    });

    window.open(url, "_blank");
  };

  return (
    <button onClick={handleClick}>
      Chat on WhatsApp
    </button>
  );
}