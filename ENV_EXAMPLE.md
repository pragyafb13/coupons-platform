# Environment Variables

Copy these to `.env.local` and fill in your values.

## Contact & Formspree

```env
# Contact info (pixelrings.com / your brand)
CONTACT_EMAIL=contact@pixelrings.com
CONTACT_PHONE=+1 (XXX) XXX-XXXX
CONTACT_ADDRESS=Your address

SUPPORT_EMAIL=support@pixelrings.com
ADVERTISE_EMAIL=advertise@pixelrings.com

# Formspree - get form ID from https://formspree.io
NEXT_PUBLIC_FORMSPREE_FORM_ID=your_form_id
```

## Sentry (Error Monitoring)

```env
# Create project at https://sentry.io
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

## Site URL (for sitemap)

```env
NEXT_PUBLIC_SITE_URL=https://coupons-platform.vercel.app
```

## Analytics

Vercel Analytics works automatically when deployed on Vercel—no env vars needed.
