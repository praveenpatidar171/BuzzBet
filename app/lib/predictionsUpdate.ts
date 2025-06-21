import prisma from "./prisma"
export const getUpdatedPortfolio = async (userId: number) => {

    const predictions = await prisma.prediction.findMany({
        where: {
            userId: userId,
            parentPredictionId: null
        },
        include: {
            market: true,
            partialBets: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const active = predictions.filter(
        (prediction) =>
            prediction.market.status === 'OPEN' && (prediction.status === 'PENDING' || prediction.status === 'MATCHED')
    )
    const inactive = predictions.filter(
        (prediction) =>
            prediction.status === 'CANCELLED' || prediction.status === 'REFUNDED' || (prediction.status === 'MATCHED' && prediction.market.status === 'RESOLVED')
    )

    return { active, inactive };

}