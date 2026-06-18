-- AlterTable
ALTER TABLE "WebsiteSettings" ALTER COLUMN "supportPhone" SET DEFAULT '447415026444',
ALTER COLUMN "whatsappNumber" SET DEFAULT '447415026444',
ALTER COLUMN "officeAddress" SET DEFAULT 'Glasgow, UK';

-- CreateTable
CREATE TABLE "Airport" (
    "id" TEXT NOT NULL,
    "iata_code" TEXT NOT NULL,
    "name" TEXT,
    "municipality" TEXT,
    "iso_country" TEXT,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airport_iata_code_key" ON "Airport"("iata_code");

-- CreateIndex
CREATE INDEX "Airport_iata_code_idx" ON "Airport"("iata_code");

-- CreateIndex
CREATE INDEX "Airport_municipality_idx" ON "Airport"("municipality");
