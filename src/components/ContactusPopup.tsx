
"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function ContactusPopup() {
  const whatsappNumber = "447415026444";
    const pathname = usePathname();

if (pathname.startsWith('/admin')) {
  return null;
}

  const message =
    "Hello FareFinderUK! I'm interested in finding the best flight and holiday deals. Could you please assist me?";

  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="fixed bottom-2 right-3 z-50 flex flex-col items-center justify-center">
      <button
        onClick={handleWhatsAppClick}
        className="hover:scale-110 transform transition-all duration-700 animate-bounce"
        aria-label="Contact us on WhatsApp"
      >
        <Image
                src="/whatsappicon.png"
                alt="WhatsApp Contact"
                width={120}
                height={120}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
                />
      </button>

      <span className="text-sm sm:text-[14px] md:text-[18px] text-gray-700 font-bold mb-4">
        Contact Us
      </span>
    </div>
  );
}
