import { authOptions } from "@/app/lib/auth";
import { payoutMatchedBets } from "@/app/lib/payoutUtils";
import prisma from "@/app/lib/prisma";
import { refundUnmatchedBets } from "@/app/lib/refundUtils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { marketId, result } = await req.json();

    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user?.isAdmin || !session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['YES', 'NO'].includes(result)) {
        return NextResponse.json({ error: 'Invalid result' }, { status: 400 });
    }

    try {
        // Refund unmatched bets first
        await refundUnmatchedBets(marketId);

        // Payout matched bets for the winning side
        await payoutMatchedBets(marketId, result);

        // Update market status
        await prisma.market.update({
            where: { id: marketId },
            data: { status: 'RESOLVED' },
        });

        // TODO: Emit socket event here to notify clients

        return NextResponse.json({ message: 'Market finalized: refunds and payouts done.' }, { status: 200 });
    } catch (error) {
        console.error('Error finalizing market:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};
