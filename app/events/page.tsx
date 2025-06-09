"use client"
import { EventCard } from "@/components/EventCard";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { MarketStatus } from "../generated/prisma";

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
    }[]
}

export default function () {

    const [allEvents, setAllEvents] = useState<allEvents[]>()

    const getAllMarkets = async () => {
        try {
            const config: AxiosRequestConfig = {
                withCredentials: true
            }
            const { data } = await axios.get('http://localhost:3000/api/markets', config);
            setAllEvents(data);

            console.log('markets are :', data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllMarkets();
    }, [])
    return (
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
    )
}