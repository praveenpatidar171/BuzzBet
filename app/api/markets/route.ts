import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const markets = await prisma.market.findMany({
            where: {
                status: 'OPEN'
            },
            include: {
                snapshots: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }, orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(markets)
    } catch (error) {
        console.error(error);
    }
}