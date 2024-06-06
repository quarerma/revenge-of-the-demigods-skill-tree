/*
  Warnings:

  - The `type` column on the `SkillNode` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SkillNode" DROP COLUMN "type",
ADD COLUMN     "type" TEXT[];

-- DropEnum
DROP TYPE "SkillType";
