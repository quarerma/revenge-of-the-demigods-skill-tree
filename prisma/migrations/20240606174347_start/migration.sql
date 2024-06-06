-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('DEFENSE', 'STRENGHT', 'MANA');

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defense" INTEGER NOT NULL,
    "strength" INTEGER NOT NULL,
    "mana" INTEGER NOT NULL,
    "skill_tree" TEXT[],

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillNode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "SkillType" NOT NULL,
    "effect_on_char" TEXT[],

    CONSTRAINT "SkillNode_pkey" PRIMARY KEY ("id")
);
