'use client'
import { graphDataAtom } from "@/store/atoms/graphData"
import axios, { AxiosRequestConfig } from "axios"
import { useAtom } from "jotai"
import { useEffect } from "react"

export const useGetMarketsnaps = (marketId: number) => {

    const [, setGraphData] = useAtom(graphDataAtom);

    const fetchAllSnaps = async () => {
        try {
            const config: AxiosRequestConfig = {
                withCredentials: true
            }
            const { data } = await axios.get(`/api/markets/${marketId}/allsnaps`, config);
            console.log('all the snaps from call:', data.allsnapshots);

            const formatted = data.allsnapshots.map((snap: any) => ({
                time: new Date(snap.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                yesPrice: snap.yesPrice,
                noPrice: (10 - snap.yesPrice).toFixed(1),
                yesCount: snap.yesCount,
                noCount: snap.noCount
            }))
            console.log(formatted)
            setGraphData(formatted);
        } catch (error: any) {
            console.error('Error fetching latest snapshot:', error?.response?.data || error.message);
        }
    }

    useEffect(() => {
        fetchAllSnaps();
    }, [marketId])
}