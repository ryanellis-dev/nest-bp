/*
  Warnings:

  - You are about to drop the column `userId` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostRole" AS ENUM ('OWNER', 'EDITOR', 'READER');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "UsersOnPosts" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "PostRole" NOT NULL DEFAULT 'READER',

    CONSTRAINT "UsersOnPosts_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "UsersOnPosts" ADD CONSTRAINT "UsersOnPosts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnPosts" ADD CONSTRAINT "UsersOnPosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
