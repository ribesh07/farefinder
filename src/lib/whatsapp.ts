export const WHATSAPP_NUMBER = "9779862551025";

export function sendToWhatsApp(options: {
  title?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  message: string;
}) {
  const text = `
${options.title ?? "New Inquiry"}

Name: ${options.customerName ?? "-"}
Email: ${options.email ?? "-"}
Phone: ${options.phone ?? "-"}

${options.message}
`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    text.trim()
  )}`;
}