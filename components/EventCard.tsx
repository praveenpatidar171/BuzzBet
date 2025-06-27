"use client"
import { MarketStatus } from "@/app/generated/prisma"
import { useRouter } from "next/navigation"

export interface EventProps {
    id: number
    title: string,
    description?: string,
    imageUrl?: string,
    question: string,
    status: MarketStatus,
    yesPrice: number
}
export const EventCard = ({ id, title, description, imageUrl, question, status, yesPrice }: EventProps) => {

    const router = useRouter()
    return <div className="bg-white w-[450px] p-6 rounded-lg shadow-lg m-5 cursor-pointer" onClick={() => router.push(`/events/${id}`)}>
        <div className="flex items-center justify-between">
            <h1 className="font-semibold text-sm">{title}</h1>
            <h2 className="font-semibold text-sm">Status: {status}</h2>
        </div>
        <div className="flex space-x-4 mt-3">
            <img className="h-16 w-24 rounded-lg" src={imageUrl as string}>
            </img>
            <p className="font-semibold">{question}</p>
        </div>
        <h2 className="text-sm mt-2 font-semibold">{description}<a className="text-blue-600 font-semibold"> Read More</a></h2>
        <div className="flex justify-between text-[12px] mt-2">
            <button className="rounded-md font-bold bg-blue-100 p-2 w-48 text-blue-600" >Yes &#8377;{yesPrice.toFixed(1)}</button>
            <button className="rounded-md font-bold bg-[#fef6f5] p-2 w-48 text-red-400" >No &#8377;{(10.0 - yesPrice).toFixed(1)}</button>
        </div>
    </div>
}