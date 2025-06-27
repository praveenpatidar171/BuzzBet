import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: Number(session?.user?.id)
            },
            include: {
                wallet: true
            },
        });

        if (!user || !user.wallet) {
            return NextResponse.json({ success: false, message: 'User or Wallet not found' }, { status: 404 })
        };
        const { id } = await params;
        const marketId = Number(id);
        const { choice, price, quantity } = await req.json();

        if (
            !['YES', 'NO'].includes(choice) ||
            typeof price !== 'number' ||
            typeof quantity !== 'number' ||
            price < 0.1 ||
            price > 9.9 ||
            quantity < 1
        ) {
            return NextResponse.json({ success: false, message: 'Invalid input' }, { status: 400 });
        };

        const market = await prisma.market.findUnique({
            where: {
                id: marketId
            },
            include: {
                snapshots: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        if (!market || market.status !== 'OPEN') {
            return NextResponse.json({
                success: false,
                message: 'Market Not Open'
            }, { status: 400 })
        };

        const totalCost = quantity * price * 100;
        if (user?.wallet?.balance < totalCost) {
            return NextResponse.json({ success: false, message: 'Insufficient balance' }, { status: 400 });
        }

        const betStatus = 'PENDING';
        const updated = await prisma.$transaction(async (tx) => {

            const existingBet = await tx.prediction.findFirst({
                where: {
                    userId: user?.id,
                    marketId: marketId
                }
            })

            if (existingBet) {
                throw new Error('User already has a bet on this market');
            }

            await tx.wallet.update({
                where: {
                    id: user?.wallet?.id
                },
                data: {
                    balance: { decrement: totalCost }
                }
            })

            const bet = await tx.prediction.create({
                data: {
                    userId: user?.id,
                    marketId: market?.id,
                    choice: choice,
                    amount: totalCost,
                    remainingAmount: totalCost,
                    quantity: quantity,
                    status: betStatus,
                    matchedAt: null,
                    entryPrice: price
                }
            })
            return bet;
        })

        return NextResponse.json({ success: true, Bet: updated, message: 'Bet placed Successfully' });

    } catch (error) {

        if (error instanceof Error && error.message === 'User already has a bet on this market') {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        console.error(error);
        return NextResponse.json({
            message: 'Bet placement failed',
            success: false
        })
    }
}