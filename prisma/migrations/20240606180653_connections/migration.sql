/*
  Warnings:

  - Added the required column `number_of_connections` to the `SkillNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SkillNode" ADD COLUMN     "number_of_connections" INTEGER NOT NULL;
