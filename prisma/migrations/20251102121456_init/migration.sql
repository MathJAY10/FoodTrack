/*
  Warnings:

  - You are about to drop the column `date` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `foodItemId` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `mealType` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `FoodLog` table. All the data in the column will be lost.
  - You are about to drop the `ChatLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NutritionInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Recipe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `FoodLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatLog" DROP CONSTRAINT "ChatLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoodLog" DROP CONSTRAINT "FoodLog_foodItemId_fkey";

-- DropForeignKey
ALTER TABLE "NutritionInfo" DROP CONSTRAINT "NutritionInfo_foodItemId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_foodItemId_fkey";

-- AlterTable
ALTER TABLE "FoodLog" DROP COLUMN "date",
DROP COLUMN "foodItemId",
DROP COLUMN "mealType",
DROP COLUMN "quantity",
ADD COLUMN     "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "fat" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "fiber" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "recipeTitle" TEXT,
ADD COLUMN     "recipeUrl" TEXT,
ADD COLUMN     "servingSize" TEXT NOT NULL DEFAULT '100g',
ADD COLUMN     "sodium" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sugar" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ChatLog";

-- DropTable
DROP TABLE "FoodItem";

-- DropTable
DROP TABLE "NutritionInfo";

-- DropTable
DROP TABLE "Recipe";

-- CreateIndex
CREATE INDEX "FoodLog_userId_idx" ON "FoodLog"("userId");
