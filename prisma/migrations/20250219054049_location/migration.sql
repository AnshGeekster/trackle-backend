/*
  Warnings:

  - Added the required column `city` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
