'use client'
import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAtom } from "jotai";
import { snapshotAtom } from "@/store/atoms/snapShot";

export interface IsnapShot {
    yesPrice: number,
    yesCount: number,
    noCount: number,
    createdAt: Date
}

export function useMarketSocket(marketId: string) {

    const [, setSnapshot] = useAtom(snapshotAtom);

    useEffect(() => {
        if (!marketId) return
        console.log('useMarketSocket called with marketId:', marketId);
        const socket = getSocket();
        console.log('Socket:', socket.connected);

        socket.onAny((event, ...args) => {
            console.log(`📡 Received event: ${event}`, args);
        });


        const onSnapshotUpdate = (data: { marketId: string, snapshot: IsnapShot }) => {

            console.log('inside socket', data);
            if (String(data.marketId) === String(marketId)) {
                console.log("[Socket] Received snapshot update:", data);
                setSnapshot(data.snapshot);
                console.log('inside usemarket recevied snapshot is ', data.snapshot)
            }
        };

        socket.emit('joinMarket', marketId);
        socket.on('snapshot:update', onSnapshotUpdate);

        return () => {
            socket.off('snapshot:update', onSnapshotUpdate);
        }

    }, [marketId])
}