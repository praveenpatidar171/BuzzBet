import React from 'react'

const CloseBetsHeaders = () => {
    return (
        <div className="flex justify-between items-center p-5 font-semibold">
            <h1>Events</h1>
            <div className="w-[650px] flex justify-between items-center">
                <h1>Created At</h1>
                <h1>Choice</h1>
                <h1>Invested</h1>
                <h1>Matched</h1>
                <h1>Return</h1>
            </div>
        </div>
    )
}

export default CloseBetsHeaders