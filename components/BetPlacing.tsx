"use client"
import { IsnapShot } from "@/app/hooks/useMarketSocket";
import { snapshotAtom } from "@/store/atoms/snapShot";
import { useAtomValue } from "jotai";
import { useState } from "react"
import { Loader } from "./Loader";

export const BetPlacing = ({ onClick, loading }: { onClick: ({ choice, price, quantity }: { choice: 'YES' | 'NO', price: number, quantity: number }) => void, loading: boolean }) => {
    const [selected, setSelected] = useState<'YES' | 'NO'>("YES");
    const [price, setPrice] = useState<number>(5);
    const [quantity, setQuantity] = useState<number>(1);

    const latestSnap: IsnapShot = useAtomValue(snapshotAtom);

    const You_put = price * quantity;
    const You_got = quantity * 10
    return <div className="w-[356px] h-[424.6px] bg-white rounded-2xl shadow-lg p-4">
        <div>
            <div className="flex border border-gray-200 rounded-full">
                <button onClick={() => setSelected('YES')} className={`w-full ${selected === 'YES' ? 'bg-blue-600 text-white' : 'bg-white'} rounded-full p-1 font-semibold`}>Yes &#8377;{latestSnap?.yesPrice.toFixed(1)}</button>
                <button onClick={() => setSelected('NO')} className={`w-full ${selected === 'NO' ? 'bg-[#e7685a] text-white' : 'bg-white'} rounded-full p-1 font-semibold`}>No &#8377;{(10.0 - latestSnap?.yesPrice).toFixed(1)}</button>
            </div>
            <div className="mt-4 w-1/4 rounded-full border border-gray-200 p-1 text-sm text-center font-semibold">Set Price</div>
            <div className="mt-4">
                <div className="p-4 border border-gray-200 rounded-lg flex flex-col gap-8">
                    <div className="flex justify-between items-center">
                        <h1 className="font-semibold">Price</h1>
                        <div className="p-1 border border-gray-200 rounded-lg ">
                            <div className="flex items-center justify-between w-32">
                                <button disabled={Math.round(price * 10) === 1} onClick={() => setPrice(price - 0.1)} className={`p-1 ${Math.round(price * 10) === 1 ? 'text-gray-400' : 'text-blue-500'}  bg-gray-200 rounded-md h-6 w-7 flex justify-center items-center`}><MinusIcon /></button>
                                <h2 className="font-bold"> {price.toFixed(1)}</h2>
                                <button disabled={Math.round(price * 10) === 99} onClick={() => setPrice(price + 0.1)} className={`p-1 ${Math.round(price * 10) === 99 ? 'text-gray-400' : 'text-blue-500'} bg-gray-200 rounded-md h-6 w-7 flex justify-center items-center`}><PlusIcon /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <h1 className="font-semibold">Quantity</h1>
                        <div className="p-1 border border-gray-200 rounded-lg ">
                            <div className="flex items-center justify-between w-32">
                                <button disabled={quantity === 1} onClick={() => setQuantity(quantity - 1)} className={`p-1 ${quantity === 1 ? 'text-gray-400' : 'text-blue-500'}  bg-gray-200 rounded-md h-6 w-7 flex justify-center items-center`}><MinusIcon /></button>
                                <h2 className="font-bold"> {quantity}</h2>
                                <button disabled={quantity === 5} onClick={() => setQuantity(quantity + 1)} className={`p-1 ${quantity === 5 ? 'text-gray-400' : 'text-blue-500'} bg-gray-200 rounded-md h-6 w-7 flex justify-center items-center`}><PlusIcon /></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-around items-center">
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="font-semibold">&#8377;{You_put.toFixed(1)}</h1>
                            <h2 className="text-slate-400 font-semibold">You Put</h2>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <h1 className="font-semibold text-green-600">&#8377;{You_got.toFixed(1)}</h1>
                            <h2 className="text-slate-400 font-semibold">You Get</h2>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={() => onClick({ choice: selected, price, quantity })} className={`mt-6 ${selected === 'YES' ? 'bg-blue-600' : 'bg-[#e7685a]'} text-white font-semibold p-3 text-sm rounded-lg w-full`}>{loading ? <Loader /> : 'Place Order'}</button>
        </div>
    </div>
}



const MinusIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
    </svg>
}

const PlusIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
    </svg>

}