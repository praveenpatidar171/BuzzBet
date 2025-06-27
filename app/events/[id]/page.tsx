"use client"
import { useGetlatestSnap } from "@/app/hooks/useGetlatestSnap";
import { useGetMarketsnaps } from "@/app/hooks/useGetMarketsnaps";
import { useLiveGraphUpdater } from "@/app/hooks/useLiveGraphUpdater";
import { useMarketSocket } from "@/app/hooks/useMarketSocket";
import { ErrorToast } from "@/app/lib/utils/ErrorToast";
import { SuccessToast } from "@/app/lib/utils/SuccessToast";
import { BetPlacing } from "@/components/BetPlacing";
import { Loader } from "@/components/Loader";
import { SnapshotGraph } from "@/components/snapshotGraph";
import { graphDataAtom, IgraphData } from "@/store/atoms/graphData";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ({ params }: { params: Promise<{ id: string }> }) {

    const [marketId, setMarketId] = useState<string | null>(null)

    useEffect(() => {
        params.then(({ id }) => setMarketId(id));
    }, [params]);

    const session = useSession();
    const [loading, setLoading] = useState(false)
    const [resultLoading, setResultLoading] = useState(false);
    const graphData: IgraphData[] = useAtomValue(graphDataAtom);
    useGetlatestSnap(Number(marketId));
    useGetMarketsnaps(Number(marketId));
    useMarketSocket(marketId as string);
    useLiveGraphUpdater(Number(marketId));

    const handleBet = async ({ choice, price, quantity }: { choice: 'YES' | 'NO', price: number, quantity: number }) => {
        setLoading(true);
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
            if (data.success) {
                SuccessToast(data.message)
            }

        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                ErrorToast(error.response?.data?.message);
            }
            else {
                ErrorToast('Error in Placing bet')
                throw new Error('Error in placing bet')
            }
        }
        finally {
            setLoading(false);
        }
    }

    const handleResult = async (result: 'YES' | 'NO') => {
        setResultLoading(true);
        try {

            const config: AxiosRequestConfig = {
                withCredentials: true
            }

            const sendData = {
                marketId: Number(marketId),
                result
            }

            const { data } = await axios.post(`/api/admin/finalize-marketoutcome`, sendData, config);

            if (data.success) {
                SuccessToast(data.message)
            }
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) {
                ErrorToast(error.response?.data?.message);
            }
            else {
                ErrorToast('Error in Finalizing the result')
                throw new Error('Error in Finalizing the result')
            }
        } finally {
            setResultLoading(false);
        }
    }
    if (!marketId) return <Loader />
    return <div>{

        !session?.data?.user ? <Loader /> :
            <div className="max-w-7xl mx-auto mt-10 flex justify-between items-center">
                <div className="w-2/3 pl-0 py-10 pr-10 bg-white rounded-2xl shadow-lg">
                    <SnapshotGraph data={graphData} />
                </div>
                <div>
                    <BetPlacing loading={loading} onClick={handleBet} />
                    {session?.data?.user?.isAdmin && <div className="flex flex-col gap-1 mt-4 p-4 border border-gray-200 bg-white shadow-lg rounded-lg">
                        <h1 className="text-center text-sm font-semibold">Declare the Final Result--&gt;Only Admin!! </h1>
                        <button onClick={async () => {
                            await handleResult('YES');
                        }} className={`mt-2 text-white bg-blue-500 font-semibold p-1 text-sm rounded-lg w-full`}>{resultLoading ? <Loader /> : 'YES'}</button>
                        <button onClick={async () => {
                            await handleResult('NO');
                        }} className={`mt-2 text-white bg-red-500 font-semibold p-1 text-sm rounded-lg w-full`}>{resultLoading ? <Loader /> : 'NO'}</button>
                    </div>}
                </div>
            </div>}
    </div>
}
