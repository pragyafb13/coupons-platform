-- CreateTable
CREATE TABLE "category_coupons" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_coupons_category_id_coupon_id_key" ON "category_coupons"("category_id", "coupon_id");

-- AddForeignKey
ALTER TABLE "category_coupons" ADD CONSTRAINT "category_coupons_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_coupons" ADD CONSTRAINT "category_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
