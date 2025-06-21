import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;
        const marketId = Number(id);

        const allsnapshots = await prisma.marketSnapshot.findMany({
            where: {
                marketId: marketId
            },
            orderBy: {
                createdAt: 'asc'
            },
            select: {
                yesCount: true,
                yesPrice: true,
                noCount: true,
                createdAt: true,
            }
        })

        return NextResponse.json({
            allsnapshots
        }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            message: 'Error in fetching all-snaps',
            error: error.message
        })
    }
}