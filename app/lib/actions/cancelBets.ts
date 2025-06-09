"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "../prisma";

export async function cancelBets(betId: number) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }
    const userId = Number(session.user.id);

    try {
        await prisma.$transaction(async (tx) => {
            // Lock the bet to prevent race conditions
            await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${betId} FOR UPDATE`;

            const bet = await tx.prediction.findUnique({
                where: { id: betId },
            });

            if (!bet) {
                throw new Error("Bet Not Found");
            }

            if (bet.userId !== userId) {
                throw new Error("Not Your Bet");
            }

            if (bet.status !== "PENDING" || bet.remainingAmount <= 0) {
                throw new Error("Bet already Matched or Cancelled!");
            }

            // Refund coins
            await tx.wallet.update({
                where: { userId },
                data: {
                    balance: { increment: bet.remainingAmount },
                },
            });

            // Cancel the bet
            await tx.prediction.update({
                where: { id: betId },
                data: {
                    status: "CANCELLED",
                    remainingAmount: 0,
                },
            });
        });

        return { message: "Bet cancelled and refunded!" };
    } catch (error: any) {
        console.error("Error in cancelling bet", error);
        return { message: error.message || "Failed to cancel bet" };
    }
}
