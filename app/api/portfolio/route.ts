import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest,) => {

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const userId = Number(session?.user?.id);

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

        // console.log('all bets are: ', predictions)

        const active = predictions.filter(
            (prediction) =>
                prediction.market.status === 'OPEN' && (prediction.status === 'PENDING' || prediction.status === 'MATCHED')
        )
        const inactive = predictions.filter(
            (prediction) =>
                prediction.status === 'CANCELLED' || prediction.status === 'REFUNDED' || (prediction.status === 'MATCHED' && prediction.market.status === 'RESOLVED')
        )


        return NextResponse.json({
            active,
            inactive
        }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            message: 'Error in fetching all-snaps',
            error: error.message
        })
    }
}