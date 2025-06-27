import { Ibets } from "@/app/hooks/useGetAllBets"
import { useEffect, useRef, useState } from "react"
import { InactiveBetViewCard } from "./InactiveBetViewCard";

export const ClosedBetCard = ({ bet }: { bet: Ibets }) => {

    const [view, setView] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                cardRef.current &&
                !cardRef.current.contains(target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(target)
            ) {
                setView(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return <div className="relative">
        {/* my main card  */}
        <div ref={cardRef} className="bg-white p-3 flex items-center justify-between mb-2 rounded-lg">
            <div className="flex items-center">
                <div className="h-12 w-12">
                    <img src={bet.market.imageUrl} />
                </div>
                <h1 className="ml-3 text-sm">{bet.market.question}</h1>
            </div>
            <div className="flex items-center justify-between w-[650px] font-semibold">
                <div className="text-[10px]">
                    <h1>{new Date(bet.createdAt).toLocaleDateString('en-IN')}</h1>
                    <h1>{new Date(bet.createdAt).toLocaleTimeString('en-IN')}</h1>
                </div>
                <h1>{bet.choice}</h1>
                <h1>&#8377; {(bet.amount) / 100}</h1>
                <h1>&#8377; {(bet.amount - bet.refundedAmount) / 100}</h1>
                <h1>{(getOutcome(bet) === 'Refunded' || getOutcome(bet) === 'Cancelled') && <span >&#8377; {(bet.refundedAmount / 100).toString() + ' '}</span>}{getOutcome(bet)}</h1>
                <button onClick={() => setView(!view)} className="px-2 py-1 rounded-md text-[10px] border cursor-pointer">View &#8595; </button>
            </div>
        </div>
        {/* toggle card  */}
        {view && <div ref={dropdownRef} className={` bg-yellow-200 p-3 flex flex-col items-center justify-between mb-2 rounded-lg absolute w-full top-full left-0 mt-2 z-10`}>
            <div className="flex items-center justify-between w-[650px] font-semibold text-[12px] mb-4 pl-4">
                <h1>Matched At</h1>
                <h1>Matched Amount</h1>
                <h1>Entry Price</h1>
                <h1>Status</h1>
                <h1>Market Result</h1>
                <h1>Return</h1>
            </div>
            {
                bet.partialBets.map((prediction) => <InactiveBetViewCard key={prediction.id} bet={prediction} outcome={bet.market.finalResult} />)
            }
        </div>}
    </div>
}

export function getOutcome(prediction: Ibets) {
    const { status, choice, market } = prediction;

    if (status === 'CANCELLED') return 'Cancelled';
    if (status === 'REFUNDED') return 'Refunded';
    if (status === 'MATCHED' && market.status === 'RESOLVED') {
        if (prediction.choice === market.finalResult) {
            return 'Win'
        } else {
            return 'Loss'
        }
    }
    if (status === 'MATCHED' && market.status !== 'RESOLVED') {
        return 'Ongoing'
    }

    if (market.status === 'RESOLVED') {
        if (status === 'RESOLVED' && choice === market.finalResult) return 'Win';
        if (status === 'RESOLVED' && choice !== market.finalResult) return 'Loss';
    }

    return 'ONGOING';
}
