/**
 * Site configuration - Contact details from pixelrings.com
 * Override with env vars: CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS
 */
export const siteConfig = {
  contact: {
    email: process.env.CONTACT_EMAIL || "contact@pixelrings.com",
    phone: process.env.CONTACT_PHONE || "+1 (XXX) XXX-XXXX",
    address: process.env.CONTACT_ADDRESS || "Check pixelrings.com for address",
    // Formspree form ID - create at formspree.io and add to env as FORMSPREE_FORM_ID
    formspreeFormId: process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID || "",
  },
  // For emails in footer, about, etc.
  supportEmail: process.env.SUPPORT_EMAIL || "support@pixelrings.com",
  advertiseEmail: process.env.ADVERTISE_EMAIL || "advertise@pixelrings.com",
};
