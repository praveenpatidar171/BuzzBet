'use client'
import { useState } from "react"
import { ClosedBetCard } from "./ClosedBetCard"
import { AllBetsHeaders } from "./AllBetsHeaders"
import CloseBetsHeaders from "./CloseBetsHeaders"
import { Ibets } from "@/app/hooks/useGetAllBets"
import { TabsClosedBetCard } from "./TabsClosedBetCard"
import { NotradesCard } from "./NotradesCard"

export const ClosedBets = ({ inactive }: { inactive?: Ibets[] }) => {

    const [selected, setSelected] = useState<'all' | 'cancelled' | 'refunded'>('all')
    return (
        <div className="max-w-7xl mx-auto mt-5">
            <div className="flex justify-center mb-8">
                <div onClick={() => setSelected('all')} className={`mr-8 cursor-pointer p-2 ${selected === 'all' ? 'text-black font-semibold border-b-2 border-b-black' : 'text-slate-500'}`}>All</div>
                <div onClick={() => setSelected('cancelled')} className={`mr-8 cursor-pointer p-2 ${selected === 'cancelled' ? 'text-black font-semibold border-b-2 border-b-black' : 'text-slate-500'}`}>Cancelled</div>
                <div onClick={() => setSelected('refunded')} className={`cursor-pointer p-2 ${selected === 'refunded' ? 'text-black font-semibold border-b-2 border-b-black' : 'text-slate-500'}`}>Refunded</div>
            </div>

            {selected === 'all' &&
                <div className="">
                    {
                        inactive?.length === 0 ?
                            <NotradesCard content="Your closed trades will appear here" /> :
                            <div>
                                <AllBetsHeaders />
                                {
                                    inactive?.map((inactive) => <ClosedBetCard key={inactive.id} bet={inactive} />)
                                }
                            </div>
                    }
                </div>

            }
            {selected === 'cancelled' &&
                <div className="">
                    {
                        inactive?.filter((bet) => bet.status === 'CANCELLED').length === 0 ?
                            <NotradesCard content="Your cancelled trades will appear here" /> :
                            <div>
                                <CloseBetsHeaders />
                                {
                                    inactive?.filter((bet) => bet.status === 'CANCELLED').map((inactive) => <TabsClosedBetCard key={inactive.id} bet={inactive} />)
                                }
                            </div>
                    }
                </div>
            }
            {selected === 'refunded' &&
                <div className="">
                    {
                        inactive?.filter((bet) => bet.status === 'REFUNDED').length === 0 ?
                            <NotradesCard content="Your refunded trades will appear here" /> :
                            <div>
                                <CloseBetsHeaders />
                                {
                                    inactive?.filter((bet) => bet.status === 'REFUNDED').map((inactive) => <TabsClosedBetCard key={inactive.id} bet={inactive} />)
                                }
                            </div>
                    }
                </div>
            }
        </div>
    )
}
