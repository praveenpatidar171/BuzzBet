'use client'
import { useAtom, useAtomValue } from "jotai";
import { IsnapShot } from "./useMarketSocket";
import { snapshotAtom } from "@/store/atoms/snapShot";
import { graphDataAtom } from "@/store/atoms/graphData";
import { useEffect } from "react";

export const useLiveGraphUpdater = (marketId: number) => {

    const latestSnap: IsnapShot = useAtomValue(snapshotAtom);
    const [, setGraphData] = useAtom(graphDataAtom);

    useEffect(() => {

        if (!latestSnap) return;


        const formatted = {
            time: new Date(latestSnap.createdAt).toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }),
            yesPrice: latestSnap.yesPrice,
            noPrice: Number((10 - latestSnap.yesPrice).toFixed(1)),
            yesCount: latestSnap.yesCount,
            noCount: latestSnap.noCount
        }

        setGraphData((prev) => {
            const last = prev[prev.length - 1];
            if (last?.time === formatted.time) return prev;

            const updated = [...prev, formatted];

            return updated.length > 100 ? updated.slice(-100) : updated
        })

    }, [latestSnap?.createdAt])

}
