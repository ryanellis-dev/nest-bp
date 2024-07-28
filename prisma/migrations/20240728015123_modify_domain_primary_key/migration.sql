/*
  Warnings:

  - The primary key for the `Domain` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Domain" DROP CONSTRAINT "Domain_pkey",
ADD CONSTRAINT "Domain_pkey" PRIMARY KEY ("name", "siteId");
