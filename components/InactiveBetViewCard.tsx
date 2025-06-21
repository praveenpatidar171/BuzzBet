import { IpartialBets } from "@/app/hooks/useGetAllBets"

export const InactiveBetViewCard = ({ bet, outcome }: { bet: IpartialBets, outcome: 'LIVE' | 'YES' | 'NO' }) => {

    return (
        <div className="bg-white p-3 mb-2 rounded-lg">
            <div className="flex items-center justify-between w-[650px] font-semibold text-[10px]">
                <div className="text-[10px]">
                    <h1>{new Date(bet.createdAt).toLocaleString('en-IN')}</h1>
                    {/* <h1>{new Date(bet.createdAt).toLocaleTimeString('en-IN')}</h1> */}
                </div>
                <h1>&#8377; {(bet.amount) / 100}</h1>
                <h1>&#8377; {bet.entryPrice}</h1>
                <h1>{bet.status}</h1>
                <h1>&#8377; {outcome === bet.choice ? bet.matchedQuantity as number * 10 : 0}</h1>
            </div>
        </div>
    )
}
