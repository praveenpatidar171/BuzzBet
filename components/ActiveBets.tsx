import React from 'react'
import { ActiveBetCard } from './ActiveBetCard'
import { Ibets } from '@/app/hooks/useGetAllBets'
import { NotradesCard } from './NotradesCard'
import { Loader } from './Loader'

const ActiveBets = ({ active }: { active?: Ibets[] }) => {
    return (
        <div>
            {
                !active ? <Loader /> :
                    active?.length === 0 ?
                        <NotradesCard content='Your active trades will appear here' /> :
                        <div>
                            <div className="flex justify-between items-center p-5 font-semibold">
                                <h1>Events</h1>
                                <div className="w-[650px] flex justify-between items-center">
                                    <h1>Created At </h1>
                                    <h1>Choice</h1>
                                    <h1>Invested</h1>
                                    <h1>Matched</h1>
                                    <h1>Unmatched</h1>
                                    <div className='flex justify-between items-center w-28'>
                                        <h1>Action</h1>
                                        <h1>View</h1>
                                    </div>
                                </div>

                            </div>
                            {
                                active?.map((active) => <ActiveBetCard bet={active} key={active?.id} />)
                            }
                        </div>
            }
        </div>
    )
}

export default ActiveBets