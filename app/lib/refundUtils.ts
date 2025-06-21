import prisma from "./prisma";

export async function refundUnmatchedBets(marketId: number) {
    const unmatchedBets = await prisma.prediction.findMany({
        where: {
            marketId,
            status: 'PENDING',
            remainingAmount: { gt: 0 },
            parentPredictionId: null,
        },
    });

    for (const bet of unmatchedBets) {
        await prisma.$transaction(async (tx) => {

            await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${bet.id} FOR UPDATE`;

            const lockedBet = await tx.prediction.findUnique({
                where: { id: bet.id },
            });

            if (!lockedBet || lockedBet.status !== 'PENDING' || lockedBet.remainingAmount <= 0) return;

            await tx.wallet.update({
                where: { userId: lockedBet.userId },
                data: { balance: { increment: lockedBet.remainingAmount } },
            });

            await tx.prediction.update({
                where: { id: lockedBet.id },
                data: { status: 'REFUNDED', remainingAmount: 0, refundedAmount: lockedBet.remainingAmount},
            });
        });
    }
}
