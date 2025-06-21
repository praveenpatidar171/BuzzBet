import { Ibets } from "@/app/hooks/useGetAllBets"
import { ActiveBetViewCard } from "./ActiveBetViewCard"
import { useEffect, useRef, useState } from "react"

export const ActiveBetCard = ({ bet }: { bet: Ibets }) => {

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

    const handleCancel = () => {

    }
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
                <h1>&#8377; {(bet.amount - bet.remainingAmount) / 100}</h1>
                <h1>&#8377; {(bet.remainingAmount / 100)}</h1>
                <div className='flex justify-between items-center w-28'>
                    <button onClick={handleCancel} disabled={bet.status !== 'PENDING' || bet.remainingAmount <= 0} className="px-2 py-1 text-white bg-red-500 rounded-md text-[10px]">Cancel</button>
                    <button onClick={() => setView(!view)}  className="px-2 py-1 rounded-md text-[10px] border">View &#8595; </button>
                </div>
            </div>
        </div>
        {/* toggle card  */}
        {view && <div ref={dropdownRef} className={` bg-yellow-200 p-3 flex flex-col items-center justify-between mb-2 rounded-lg absolute w-full top-full left-0 mt-2 z-10`}>
            <div className="flex items-center justify-between w-[650px] font-semibold text-[12px] mb-4">
                <h1>Matched At</h1>
                <h1>Matched Amount</h1>
                <h1>Entry Price</h1>
                <h1>Status</h1>
                <h1>Potential Return</h1>
            </div>
            {
                bet.partialBets.map((bet) => <ActiveBetViewCard key={bet.id} bet={bet} />)
            }
        </div>}
    </div>
}