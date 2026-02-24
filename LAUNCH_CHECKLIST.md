# DealStack Launch Checklist

## ✅ Completed (Pre-Launch Fixes Applied)

### UI & Design
- [x] Search results page redesigned to match site UI
- [x] Saved coupons page – premium cards, hero section, clickable links
- [x] Store detail page – hero section, premium coupon cards
- [x] 404 page – premium design with clear CTAs
- [x] About, Contact, Advertise – hero sections and consistent styling
- [x] Footer – light purple text, readable
- [x] Category page buttons – light purple background, dark text
- [x] Coupon cards – consistent across homepage, coupons, categories, search

### Data & Logic
- [x] Categories – coupon count filters ACTIVE only
- [x] Homepage – featured coupons and total count filter isActive
- [x] Footer – coupon count filters ACTIVE only
- [x] Category page – direct CategoryCoupon query for reliable coupon display

### Performance & Reliability
- [x] Prisma – connection_limit=1 on Vercel to prevent pool exhaustion
- [x] Footer & Header – cached for 60s to reduce DB queries
- [x] DATABASE_SETUP.md – Neon/Supabase pooled connection instructions

### SEO & Meta
- [x] Layout metadata – Open Graph, Twitter cards, keywords

---

## 🔲 Before Launch – Recommended

### Critical
1. **Database connection pooler** – If using Neon/Supabase, ensure you use the **pooled** connection URL in Vercel env (see DATABASE_SETUP.md)
2. **Contact form** – Currently no backend. Options: Formspree, Resend, or custom API route
3. **Replace placeholder content** – Contact page (phone, address, email) with real info
4. **Admin protection** – Verify `/admin` routes require auth

### Nice to Have
- **Saved coupons** – Add heart/save button on coupon cards (API exists at `/api/save-coupon`)
- **Newsletter signup** – Email capture in footer
- **Sitemap** – `app/sitemap.ts` for SEO
- **robots.txt** – Allow crawling
- **Analytics** – Google Analytics or Vercel Analytics
- **Error monitoring** – Sentry or similar
- **Favicon** – Ensure custom favicon is set
- **PWA** – Manifest for "Add to Home Screen"

### Content
- Update Privacy Policy / Terms with your domain and contact
- Add real social media links in footer (or remove if not ready)
- Submit coupon – ensure email notifications if desired

---

## 📋 Post-Launch

- Monitor Vercel logs for Prisma/DB errors
- Track coupon click-through rates
- Gather user feedback
- Add more stores and coupons for a strong launch
