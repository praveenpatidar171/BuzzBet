
          // const yesTotal = await tx.prediction.aggregate({
          //   where: { marketId: lockedBet.marketId, choice: 'YES', status: 'MATCHED', parentPredictionId: { not: null } },
          //   _sum: { amount: true }
          // });

          // console.log('yes Total is :', yesTotal)

          // const noTotal = await tx.prediction.aggregate({
          //   where: { marketId: lockedBet.marketId, choice: 'NO', status: 'MATCHED', parentPredictionId: { not: null } },
          //   _sum: { amount: true }
          // });

          // console.log('no Total is :', noTotal)

          // const yesAmount = (yesTotal._sum.amount ?? 0) / 100;
          // console.log('yes Amount is :', yesAmount)
          // const noAmount = (noTotal._sum.amount ?? 0) / 100;
          // console.log('no Amount is :', noAmount)
          // const total = yesAmount + noAmount;

          // const newYesPrice = total === 0 ? 5.0 : parseFloat(((yesAmount / total) * 10).toFixed(1));

          // console.log('newYesPrice is :', newYesPrice)
