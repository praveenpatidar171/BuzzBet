'use client'
import { snapshotAtom } from "@/store/atoms/snapShot"
import axios, { AxiosRequestConfig } from "axios"
import { useAtom } from "jotai"
import { useEffect } from "react"

export const useGetlatestSnap = (marketId: number) => {

    const [, setSnapshot] = useAtom(snapshotAtom);

    const fetchLatestSnap = async () => {
        try {
            const config: AxiosRequestConfig = {
                withCredentials: true
            }
            const { data } = await axios.get(`/api/markets/${marketId}/latestsnap`, config);
            console.log('latestSnap from api call:', data.snapshot)
            setSnapshot(data.snapshot);
        } catch (error: any) {
            console.error('Error fetching latest snapshot:', error?.response?.data || error.message);
        }
    }

    useEffect(() => {
        fetchLatestSnap();
    }, [marketId])
}