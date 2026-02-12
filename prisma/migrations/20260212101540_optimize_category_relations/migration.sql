-- DropIndex
DROP INDEX "category_coupons_category_id_coupon_id_key";

-- DropIndex
DROP INDEX "category_stores_category_id_store_id_key";

-- CreateIndex
CREATE INDEX "category_coupons_category_id_idx" ON "category_coupons"("category_id");

-- CreateIndex
CREATE INDEX "category_coupons_coupon_id_idx" ON "category_coupons"("coupon_id");

-- CreateIndex
CREATE INDEX "category_stores_category_id_idx" ON "category_stores"("category_id");

-- CreateIndex
CREATE INDEX "category_stores_store_id_idx" ON "category_stores"("store_id");

-- CreateIndex
CREATE INDEX "coupons_isActive_idx" ON "coupons"("isActive");
