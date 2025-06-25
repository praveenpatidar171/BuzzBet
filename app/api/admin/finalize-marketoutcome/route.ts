import { authOptions } from "@/app/lib/auth";
import { payoutMatchedBets } from "@/app/lib/payoutUtils";
import prisma from "@/app/lib/prisma";
import { refundUnmatchedBets } from "@/app/lib/refundUtils";
import redis from "@/app/lib/utils/redis";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { marketId, result } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.isAdmin || !session) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!['YES', 'NO'].includes(result)) {
        return NextResponse.json({ success: false, message: 'Invalid result' }, { status: 400 });
    }

    try {
        // Refund unmatched bets first
        const refundedUsers = await refundUnmatchedBets(marketId);

        // Payout matched bets for the winning side
        const paidUsers = await payoutMatchedBets(marketId, result);

        // Update market status
        await prisma.market.update({
            where: { id: marketId },
            data: { status: 'RESOLVED', finalResult: result },
        });

        // TODO: Emit socket event here to notify clients
        const affectedUsers = [...new Set([...refundedUsers, ...paidUsers])];

        for (const userId of affectedUsers) {
            await redis.publish('prediction:update', JSON.stringify({ userId }));
        }

        return NextResponse.json({ success: true, message: 'Market finalized: refunds and payouts done.' }, { status: 200 });
    } catch (error) {
        console.error('Error finalizing market:', error);
        return NextResponse.json({ success: false, message: 'Error finalizing market:' }, { status: 500 });
    }
};
