import prisma from "./prisma";

export async function payoutMatchedBets(marketId: number, result: 'YES' | 'NO') {

    console.log('Result is:', result);
    const matchedBets = await prisma.prediction.findMany({
        where: {
            marketId,
            status: 'MATCHED',
            parentPredictionId: { not: null },
        },
    });

    console.log('matched bets are :', matchedBets);

    for (const bet of matchedBets) {

        console.log('inside matchbet :', bet)
        if (bet.choice !== result) {
            console.log(` skipped bet with choice ${bet.choice} 's result :`, bet.choice !== result)
            continue;
        }

        await prisma.$transaction(async (tx) => {

            await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${bet.id} FOR UPDATE`;

            const locked = await tx.prediction.findUnique({
                where: { id: bet.id },
            });

            console.log('matched quantity is', locked?.matchedQuantity)
            if (!locked || locked.status !== 'MATCHED' || !locked?.matchedQuantity) return;



            console.log('quantity is :', locked.quantity)
            console.log('Matchedquantity is :', locked.matchedQuantity)
            const totalPayoutOriginal = locked.quantity * 10 * 100;
            const totalPayout = locked.matchedQuantity * 10 * 100;
            console.log('totalPayoutOriginal is :', totalPayoutOriginal)
            console.log('totalPayout is :', totalPayout)

            const profitOriginal = totalPayoutOriginal - locked.amount
            console.log('ProfitOriginal is :', profitOriginal)

            const profit = totalPayout - locked.amount
            console.log('Profit is :', profit)


            const LatestBalance = await tx.wallet.update({
                where: { userId: bet.userId },
                data: { balance: { increment: totalPayout } },
            });
            console.log('LatestBalance is :', LatestBalance.balance)

            await tx.prediction.update({
                where: { id: bet.id },
                data: { status: 'RESOLVED' },
            });
        });
    }
}
