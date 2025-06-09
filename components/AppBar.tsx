"use client"
import { signOut, useSession } from "next-auth/react"

export const AppBar = () => {
    const session = useSession()

    console.log('data is: ', session?.data?.user)
    return <div className="flex justify-between px-28 p-4 bg-[#f5f5f5]">
        <h1 className="text-4xl">BuzzBet</h1>

        <div className="flex">
            {session?.data?.user && <div className="flex items-center justify-between font-bold border-2 rounded-md p-2 min-w-20 text-black mr-4"><CreditCardIcon /> <h1 className="ml-3">&#8377;{(session?.data?.user?.balance)/100}</h1></div>}
            {session?.data?.user && <div> <button onClick={async () => {
                await signOut({ callbackUrl: '/api/auth/signin' });
            }} className="border-2 rounded-md bg-black p-2 w-40 text-white" >{session?.data?.user && 'LogOut'}</button>
            </div>}
        </div>

    </div>
}


const CreditCardIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </svg>

}