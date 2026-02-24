# Sample Import CSVs

Use these files with Admin → Bulk Import. **Import in this order:**

1. **categories.csv** (10 categories)
2. **stores.csv** (20 stores)
3. **coupons.csv** (59 coupons)

## Download

- [categories.csv](/sample-import/categories.csv)
- [stores.csv](/sample-import/stores.csv)
- [coupons.csv](/sample-import/coupons.csv)

Or get them from Admin → Import pages (download links above each upload form).

## CSV Formats

**Categories:** `name`, `slug`

**Stores:** `name`, `slug`, `logo`, `affiliate_url`, `description`, `is_featured`, `categories` (comma-separated slugs)

**Coupons:** `title`, `store_slug`, `code`, `type` (code/deal), `deal_url`, `expiry_date`, `status`, `is_verified`, `categories` (comma-separated slugs)
