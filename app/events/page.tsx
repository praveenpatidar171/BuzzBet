"use client"
import { EventCard } from "@/components/EventCard";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { MarketStatus } from "../generated/prisma";
import { getSocket } from "../lib/socket";
import { NotradesCard } from "@/components/NotradesCard";
import { useSession } from "next-auth/react";
import { Loader } from "@/components/Loader";

interface allEvents {
    id: number,
    question: string,
    imageUrl?: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    description?: string
    status: MarketStatus,
    snapshots: {
        yesPrice: number,
        id: number,
        yesCount: number,
        noCount: number,
        createdAt: Date,
        marketId: number
    }[],
}

export default function () {

    const [allEvents, setAllEvents] = useState<allEvents[]>();
    const session = useSession();
    const getAllMarkets = async () => {
        try {
            const config: AxiosRequestConfig = {
                withCredentials: true
            }
            const { data } = await axios.get('/api/markets', config);
            setAllEvents(data);

            console.log('markets are :', data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllMarkets();
    }, [])

    useEffect(() => {

        const socket = getSocket();
        console.log('Socket:', socket.connected);

        socket.emit('join-room', 'markets')

        socket.onAny((event, ...args) => {
            console.log(`📡 Received event: ${event}`, args);
        });

        const handleData = (data: { marketId: string, snapshot: { id: number, marketId: number, createdAt: Date, yesPrice: number, yesCount: number, noCount: number } }) => {
            console.log('recevied data inside socket :', data);
            setAllEvents((prev) => prev?.map((event) => event.id === Number(data.marketId) ? { ...event, snapshots: [data.snapshot] } : event));
        }

        socket.on('snapshot:update', handleData);

        return () => {
            socket.off('snapshot:update', handleData);
            socket.emit('leave-room', 'markets');
        }

    }, [])
    return (
        <div>
            {!session?.data?.user ? <Loader /> :
                allEvents?.length === 0 ?
                    <NotradesCard content="All active markets will appear here" /> :
                    <div className="bg-[#f5f5f5]">
                        <div className="max-w-7xl mx-auto flex flex-col" >
                            <h1 className="text-xl font-semibold">All Events</h1>
                            <div className="border-t-2 border-slate-300 mt-3">
                            </div>
                            <div className="flex justify-center items-center">
                                <div className="md:grid grid-cols-2">
                                    {allEvents && allEvents?.map((market) => <EventCard key={market?.id} id={market?.id} title={market?.title} question={market?.question} description={market?.description} imageUrl={market?.imageUrl} yesPrice={market?.snapshots[0] ? market?.snapshots[0].yesPrice : 5.0} status={market?.status} />)}
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}