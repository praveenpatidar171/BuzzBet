"use client"
import { signIn } from "next-auth/react";
import React, { useState } from "react"

export default function () {

    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signIn("credentials", {
            phoneNumber,
            password,
            callbackUrl: "/events"
        })
    }
    const handleClick = async () => {
        await signIn("google", {
            callbackUrl: "/events"
        })
    }
    return <div className="max-h-screen max-w-screen py-20">
        <form className="w-60 mx-auto border-2 border-gray-400 rounded-lg shadow-2xl p-5" onSubmit={handleSubmit}>
            <h1 className="text-2xl text-center font-semibold">SignIn</h1>
            <div className="flex flex-col gap-1 mt-3">
                <label className="text-sm font-semibold" htmlFor="Phone Number">Phone Number</label>
                <input className="border-gray-500 border-2 rounded-md outline-none focus:border-blue-800 p-1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)} type="text" placeholder="1234567890" />
            </div>
            <div className="flex flex-col gap-1 mt-3">
                <label className="text-sm font-semibold" htmlFor="Password">Password</label>
                <input className="border-gray-500 border-2 rounded-md outline-none focus:border-blue-800 p-1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} type="password" placeholder="1234567890" />
            </div>
            <button className="border-2 w-full p-1 rounded-lg bg-blue-900 text-white font-semibold mt-3" type="submit">SignIn</button>
            <h2 className="text-center mt-1 font-semibold">Or</h2>
            <button className="border-2 w-full p-1 rounded-lg bg-blue-900 text-white font-semibold mt-2" onClick={handleClick}>LogIn with Google</button>
        </form>
    </div>
}