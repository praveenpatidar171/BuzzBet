import { Ibets } from "@/app/hooks/useGetAllBets"
import { getOutcome } from "./ClosedBetCard";

export const TabsClosedBetCard = ({ bet }: { bet: Ibets }) => {

    return <div className="relative">
        <div className="bg-white p-3 flex items-center justify-between mb-2 rounded-lg">
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
                <h1>{getOutcome(bet) === 'Win' && <span>&#8377;</span>} {getOutcome(bet) === 'Win' ? bet.matchedQuantity as number * 10 : getOutcome(bet)}</h1>
            </div>
        </div>
    </div>
}
