import cron from 'node-cron';
import prisma from '../prisma';
import redis from '../utils/redis';
async function matchPendingBets() {
  try {
    console.log('[Job Start] Matching pending bets...');

    const pendingBets = await prisma.prediction.findMany({
      where: {
        status: 'PENDING',
        remainingAmount: { gt: 0 },
        parentPredictionId: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    console.log('found pending bets :', pendingBets);

    for (const bet of pendingBets) {
      console.log('inside bet:', bet.id)
      let betRemaining = bet.remainingAmount;
      if (betRemaining <= 0) continue;

      const oppositeChoice = bet.choice === 'YES' ? 'NO' : 'YES';
      const complementaryPrice = +(10 - bet.entryPrice).toFixed(1);
      console.log('bet price is :', bet.entryPrice);
      console.log('complementory price is:', complementaryPrice);

      const oppositeBets = await prisma.prediction.findMany({
        where: {
          status: 'PENDING',
          remainingAmount: { gt: 0 },
          parentPredictionId: null,
          marketId: bet.marketId,
          choice: oppositeChoice,
          entryPrice: complementaryPrice,
          NOT: { id: bet.id },
        },
        orderBy: { createdAt: 'asc' },
      });

      console.log('found opposite bets:', oppositeBets)

      for (const opposite of oppositeBets) {

        console.log('inside the opposite bet :', opposite.id);
        if (betRemaining <= 0) break;

        await prisma.$transaction(async (tx) => {
          // Lock both original bets

          await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${bet.id} FOR UPDATE`;
          await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${opposite.id} FOR UPDATE`;

          const lockedBet = await tx.prediction.findUnique({
            where: { id: bet.id },
          });

          const lockedOpposite = await tx.prediction.findUnique({
            where: { id: opposite.id },
          });

          if (
            !lockedBet || !lockedOpposite ||
            lockedBet.remainingAmount <= 0 ||
            lockedOpposite.remainingAmount <= 0 ||
            lockedBet.status !== 'PENDING' ||
            lockedOpposite.status !== 'PENDING'
          ) {
            return; // Skip this pair
          }

          const matchAmount = Math.min(lockedBet.remainingAmount, lockedOpposite.remainingAmount);
          console.log('found matched amount is :', matchAmount);

          const matchedQuantityRaw = (matchAmount / 100) / lockedBet.entryPrice;
          const matchedQuantity = Math.floor(matchedQuantityRaw * 100) / 100;
          console.log('matched quantity is :', matchedQuantity);

          const matchedQuantityRawOppo = (matchAmount / 100) / lockedOpposite.entryPrice;
          const matchedQuantityOppo = Math.floor(matchedQuantityRawOppo * 100) / 100;
          console.log('matched quantity is :', matchedQuantityOppo);

          const now = new Date();

          // Create child matched records
          await tx.prediction.createMany({
            data: [
              {
                userId: lockedBet.userId,
                marketId: lockedBet.marketId,
                choice: lockedBet.choice,
                amount: matchAmount,
                remainingAmount: 0,
                quantity: lockedBet.quantity,
                matchedQuantity: matchedQuantity,
                entryPrice: lockedBet.entryPrice,
                status: 'MATCHED',
                matchedAt: now,
                parentPredictionId: lockedBet.id,
              },
              {
                userId: lockedOpposite.userId,
                marketId: lockedOpposite.marketId,
                choice: lockedOpposite.choice,
                amount: matchAmount,
                remainingAmount: 0,
                quantity: lockedBet.quantity,
                matchedQuantity: matchedQuantityOppo,
                entryPrice: lockedOpposite.entryPrice,
                status: 'MATCHED',
                matchedAt: now,
                parentPredictionId: lockedOpposite.id,
              },
            ],
          });

          const newBetRemaining = lockedBet.remainingAmount - matchAmount;

          console.log('New BEt Remaining is :', newBetRemaining)
          const newOppositeRemaining = lockedOpposite.remainingAmount - matchAmount;
          console.log('New  opposite BEt Remaining is :', newOppositeRemaining)
          // Update parent bets
          await tx.prediction.update({
            where: { id: lockedBet.id },
            data: {
              remainingAmount: newBetRemaining,
              status: newBetRemaining === 0 ? 'MATCHED' : 'PENDING',
              matchedAt: newBetRemaining === 0 ? now : undefined,
            },
          });

          await tx.prediction.update({
            where: { id: lockedOpposite.id },
            data: {
              remainingAmount: newOppositeRemaining,
              status: newOppositeRemaining === 0 ? 'MATCHED' : 'PENDING',
              matchedAt: newOppositeRemaining === 0 ? now : undefined,
            },
          });

          betRemaining = newBetRemaining;

          console.log(`Matched ${matchAmount} between bet ${bet.id} and opposite ${opposite.id}`);





          // Get total amount per choice (YES)
          const yesSumAmount = await tx.prediction.aggregate({
            _sum: { amount: true },
            where: {
              marketId: lockedBet.marketId,
              choice: 'YES',
              status: 'MATCHED',
              parentPredictionId: { not: null },
            },
          });

          // Get all matched YES bets (amount + price) to compute weighted avg
          const yesMatches = await tx.prediction.findMany({
            where: {
              marketId: lockedBet.marketId,
              choice: 'YES',
              status: 'MATCHED',
              parentPredictionId: { not: null },
            },
            select: { amount: true, entryPrice: true },
          });

          // Calculate weighted average price for YES
          const yesTotalAmount = yesSumAmount._sum.amount || 0;
          const yesWeightedPrice = yesTotalAmount === 0
            ? 5.0
            : yesMatches.reduce((acc, b) => acc + b.entryPrice * b.amount, 0) / yesTotalAmount;

          // Repeat for NO
          const noSumAmount = await tx.prediction.aggregate({
            _sum: { amount: true },
            where: {
              marketId: lockedBet.marketId,
              choice: 'NO',
              status: 'MATCHED',
              parentPredictionId: { not: null },
            },
          });
          const noMatches = await tx.prediction.findMany({
            where: {
              marketId: lockedBet.marketId,
              choice: 'NO',
              status: 'MATCHED',
              parentPredictionId: { not: null },
            },
            select: { amount: true, entryPrice: true },
          });

          const noTotalAmount = noSumAmount._sum.amount || 0;
          const noWeightedPrice = noTotalAmount === 0
            ? 5.0
            : noMatches.reduce((acc, b) => acc + b.entryPrice * b.amount, 0) / noTotalAmount;


          const total = yesWeightedPrice + noWeightedPrice;

          const normalizedYesPrice = total === 0 ? 5.0 : +(yesWeightedPrice / total * 10).toFixed(1);

          const yesCount = await tx.prediction.count({
            where: { marketId: lockedBet.marketId, choice: 'YES', status: 'MATCHED', parentPredictionId: { not: null } }
          });

          console.log('yes Count is :', yesCount)
          const noCount = await tx.prediction.count({
            where: { marketId: lockedBet.marketId, choice: 'NO', status: 'MATCHED', parentPredictionId: { not: null } }
          });

          console.log('no Count is :', noCount)

          const lastSnapshot = await tx.marketSnapshot.findFirst({
            where: { marketId: lockedBet.marketId },
            orderBy: { createdAt: 'desc' },
          });

          console.log('last Snapshot is :', lastSnapshot)

          if (!lastSnapshot || lastSnapshot.yesPrice !== normalizedYesPrice) {
            const newSnap = await tx.marketSnapshot.create({
              data: {
                marketId: lockedBet.marketId,
                yesPrice: normalizedYesPrice,
                yesCount,
                noCount,
              }
            });
            console.log('latest Snap is :', newSnap)

            console.log('starting emmiting event ')

            await redis.publish('snapshot:update', JSON.stringify({
              marketId: lockedBet.marketId,
              newsnap: newSnap
            }))
          }

        });
      }
    }

    console.log('[Job End] Matching complete.');
  } catch (error) {
    console.error('Error in matchPendingBets job:', error);
  }
}

export function startBetMatchingJob() {
  console.log('Starting bet matching job scheduler...');
  cron.schedule('*/10 * * * * *', () => {
    matchPendingBets();
  });
}
