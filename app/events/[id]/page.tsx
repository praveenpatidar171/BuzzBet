"use client"
import { useGetlatestSnap } from "@/app/hooks/useGetlatestSnap";
import { IsnapShot, useMarketSocket } from "@/app/hooks/useMarketSocket";
import { BetPlacing } from "@/components/BetPlacing";
import { snapshotAtom } from "@/store/atoms/snapShot";
import axios, { AxiosRequestConfig } from "axios";
import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

export default function ({ params }: { params: { id: string } }) {
    const session = useSession();
    const marketId = params.id

    const latestSnap: IsnapShot = useAtomValue(snapshotAtom);

    console.log('latestSnap is :', latestSnap)


    useGetlatestSnap(Number(marketId));
    useMarketSocket(marketId);

    const handleBet = async ({ choice, price, quantity }: { choice: 'YES' | 'NO', price: number, quantity: number }) => {
        try {

            const config: AxiosRequestConfig = {
                withCredentials: true
            }

            const sendData = {
                choice: choice,
                price: Number(price.toFixed(1)),
                quantity: quantity
            }

            const { data } = await axios.post(`/api/markets/${marketId}/bet`, sendData, config);

        } catch (error) {
            console.log(error);
            throw new Error('Error in placing bet')
        }
    }

    const handleResult = async (result: 'YES' | 'NO') => {
        try {

            const config: AxiosRequestConfig = {
                withCredentials: true
            }

            const sendData = {
                marketId: Number(marketId),
                result
            }

            const { data } = await axios.post(`/api/admin/finalize-marketoutcome`, sendData, config);

            console.log('data is ', data)
        } catch (error) {
            console.log(error);
            throw new Error('Error in Finalizing the result')
        }
    }
    return <div className="max-w-7xl mx-auto mt-10 flex justify-between items-center">
        <div className="w-2/3 h-60 bg-slate-400">
            {latestSnap.yesPrice}
            {latestSnap.noCount}
            {latestSnap.yesCount}
            {JSON.stringify(latestSnap.createdAt)}
        </div>
        <div>
            <BetPlacing onClick={handleBet} />
            {session?.data?.user?.isAdmin && <div className="flex flex-col gap-1 mt-4 p-4 border border-gray-200 bg-white shadow-lg rounded-lg">
                <h1 className="text-center text-sm font-semibold">Declare the Final Result--&gt;Only Admin!! </h1>
                <button onClick={async () => {
                    await handleResult('YES');
                }} className={`mt-2 text-white bg-blue-500 font-semibold p-1 text-sm rounded-lg w-full`}>YES</button>
                <button onClick={async () => {
                    await handleResult('NO');
                }} className={`mt-2 text-white bg-red-500 font-semibold p-1 text-sm rounded-lg w-full`}>No</button>
            </div>}
        </div>
    </div>
}
