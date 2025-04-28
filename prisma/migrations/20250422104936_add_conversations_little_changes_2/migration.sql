/*
  Warnings:

  - A unique constraint covering the columns `[fromEmail,toEmail]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Conversation_fromEmail_toEmail_key" ON "Conversation"("fromEmail", "toEmail");
