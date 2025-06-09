import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    const { marketId, result } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    const user = await prisma.user.findFirst({
        where: { id: userId },
    });

    if (!user?.isAdmin || !session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["YES", "NO"].includes(result)) {
        return NextResponse.json({ error: "Invalid result" }, { status: 400 });
    }

    try {
        const matchedBets = await prisma.prediction.findMany({
            where: {
                marketId,
                status: "MATCHED",
                parentPredictionId: { not: null },
            },
        });

        for (const bet of matchedBets) {
            // Only payout winning side
            if (bet.choice !== result) continue;

            await prisma.$transaction(async (tx) => {
                await tx.$queryRaw`SELECT * FROM "Prediction" WHERE "id" = ${bet.id} FOR UPDATE`;

                const locked = await tx.prediction.findUnique({
                    where: { id: bet.id },
                });

                if (!locked || locked.status !== "MATCHED") return;


                const profit = Math.floor((locked.amount * locked.entryPrice) / 10);
                const totalPayout = locked.amount + profit;

                await tx.wallet.update({
                    where: { userId: bet.userId },
                    data: {
                        balance: { increment: totalPayout },
                    },
                });

                await tx.prediction.update({
                    where: { id: bet.id },
                    data: {
                        status: 'RESOLVED',
                    },
                });
            });
        }

        await prisma.market.update({
            where: { id: marketId },
            data: {
                status: "RESOLVED",
            },
        });

        return NextResponse.json(
            { message: "Payouts successful and market resolved" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Payout error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
