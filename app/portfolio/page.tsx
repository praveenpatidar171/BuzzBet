'use client'
import ActiveBets from "@/components/ActiveBets"
import { ClosedBets } from "@/components/ClosedBets"

import { useState } from "react"
import { Ibets, useGetAllBets } from "../hooks/useGetAllBets";

export default function () {

    const [selected, setSelected] = useState<'active' | 'inactive'>('active');

    const { active, inactive } = useGetAllBets();

    console.log('active bets are :', active)
    console.log('Inactive bets are :', inactive)


    return <div className="max-w-7xl mx-auto mt-5">
        <div className="flex justify-center mb-8">
            <div onClick={() => setSelected('active')} className={`mr-8 cursor-pointer p-2 ${selected === 'active' ? 'text-black font-semibold border-b-2 border-b-black' : 'text-slate-500'}`}>Active trades</div>
            <div onClick={() => setSelected('inactive')} className={`cursor-pointer p-2 ${selected === 'inactive' ? 'text-black font-semibold border-b-2 border-b-black' : 'text-slate-500'}`}>Closed trades</div>
        </div>

        {selected === 'active' ?
            <ActiveBets active={active} /> :
            <div className="">
                <ClosedBets inactive={inactive} />
            </div>
        }

    </div>
}