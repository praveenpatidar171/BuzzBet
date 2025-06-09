import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { marketId } = await req.json();

    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
        where: {
            id: Number(session?.user?.id)
        }
    });

    if (!session || !user?.isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const unmatchedBets = await prisma.prediction.findMany({
            where: {
                marketId: marketId,
                status: 'PENDING',
                parentPredictionId: null,
                remainingAmount: { gt: 0 }
            }
        })

        for (const bet of unmatchedBets) {
            await prisma.$transaction(async (tx) => {

                await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${bet.id} FOR UPDATE`;

                const lockedBet = await tx.prediction.findUnique({
                    where: {
                        id: bet.id
                    }
                })

                if (!lockedBet || lockedBet.status !== 'PENDING' || lockedBet.remainingAmount <= 0) return;

                await tx.wallet.update({
                    where: {
                        userId: lockedBet.userId
                    },
                    data: {
                        balance: { increment: lockedBet.remainingAmount }
                    }
                })

                await tx.prediction.update({
                    where: {
                        id: lockedBet.id
                    },
                    data: {
                        status: 'REFUNDED',
                        remainingAmount: 0
                    }
                })

            })
        }
        return NextResponse.json({
            message: `Refunded ${unmatchedBets.length} unmatched bets successfully`
        }, { status: 200 })
    } catch (error) {
        console.error('Refund unmatched bets error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }

}