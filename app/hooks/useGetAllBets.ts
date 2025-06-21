'use client'
import axios, { AxiosRequestConfig } from "axios"
import { act, useEffect, useState } from "react"
import { getSocket } from "../lib/socket"

export interface Imarket {
    id: number,
    question: string,
    title: string,
    imageUrl: string,
    description: string,
    status: 'OPEN' | 'CLOSED' | 'RESOLVED',
    createdAt: Date,
    updatedAt: Date,
    finalResult: 'LIVE' | 'YES' | 'NO'
}

export interface IpartialBets {
    id: number,
    userId: number,
    marketId: number,
    choice: 'YES' | 'NO',
    amount: number,
    remainingAmount: number,
    refundedAmount: number,
    quantity: number,
    matchedQuantity: number | null,
    status: 'PENDING' | 'MATCHED' | 'REFUNDED' | 'CANCELLED' | 'RESOLVED',
    matchedAt: Date | null
    parentPredictionId: number | null,
    createdAt: Date,
    updatedAt: Date,
    entryPrice: number
}
export interface Ibets {

    id: number,
    userId: number,
    marketId: number,
    choice: 'YES' | 'NO',
    amount: number,
    remainingAmount: number,
    refundedAmount: number,
    quantity: number,
    matchedQuantity: number | null,
    status: 'PENDING' | 'MATCHED' | 'REFUNDED' | 'CANCELLED' | 'RESOLVED',
    matchedAt: Date | null
    parentPredictionId: number | null,
    partialBets: IpartialBets[]
    createdAt: Date,
    updatedAt: Date,
    market: Imarket

}


export const useGetAllBets = (userId: number) => {

    const [active, setActive] = useState<Ibets[]>();
    const [inactive, setInactive] = useState<Ibets[]>();
    const fetchAllBets = async () => {

        try {
            const config: AxiosRequestConfig = {
                withCredentials: true
            }

            const { data } = await axios.get(`/api/portfolio`, config);

            setActive(data.active);
            setInactive(data.inactive);

        } catch (error: any) {
            console.log('error in fetching all trades, ', error);
        }

    }

    useEffect(() => {
        fetchAllBets();

        if (!userId) return;

        const socket = getSocket();
        console.log('Socket:', socket.connected);

        socket.onAny((event, ...args) => {
            console.log(`📡 Received event: ${event}`, args);
        });


        const onPortfolioUpdate = (data: { active: Ibets[], inactive: Ibets[] }) => {
            console.log("🔁 Received real-time portfolio update from socket:", data);
            setActive(data.active);
            setInactive(data.inactive);
        };

        socket.emit('join-room', `user-${userId}`);
        socket.off('portfolio:update:full', onPortfolioUpdate);
        socket.on('portfolio:update:full', onPortfolioUpdate);

        return () => {
            socket.emit("leave-room", `user-${userId}`);
        };

    }, [userId]);


    return { active, inactive };
}