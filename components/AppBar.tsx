"use client"
import { signOut, useSession } from "next-auth/react"
import logo from '@/app/lib/utils/default.png'
import Image from "next/image"
import { useRouter } from "next/navigation"

export const AppBar = () => {
    const session = useSession()
    const router = useRouter();

    console.log('data is: ', session?.data?.user)
    return <div className="flex justify-between px-28 p-8 bg-[#f5f5f5] mb-6">
        <Image
            src={logo}
            alt="logo"
            width={300}
            height={300}
            className="absolute -top-24 left-16 object-cover"
        />

        <h1 className="text-4xl"></h1>

        <div className="flex">
            {session?.data?.user && <div onClick={() => router.push('/portfolio')} className="flex cursor-pointer items-center justify-between font-bold border-2 rounded-md p-2 min-w-20 text-black mr-4"><BriefCaseIcon /> <h1 className="ml-3">Portfolio</h1></div>}
            {session?.data?.user && <div className="flex items-center justify-between font-bold border-2 rounded-md p-2 min-w-20 text-black mr-4"><CreditCardIcon /> <h1 className="ml-3">&#8377;{(session?.data?.user?.balance) / 100}</h1></div>}
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

const BriefCaseIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>

}