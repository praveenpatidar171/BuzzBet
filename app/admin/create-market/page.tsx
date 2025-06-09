"use client"
import { createMarket } from "@/app/lib/actions/createMarket"
import { uploadToCloudinary } from "@/app/lib/cloudinary/uploadImage"
import { redirect } from "next/navigation"
import React, { useState } from "react"

export default function () {
    const [title, setTitle] = useState<string>("")
    const [question, setQuestion] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [image, setImage] = useState<File | null>()
    const [imageUrl, setImageUrl] = useState<string | null>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageUrl;
        if (image) {
            imageUrl = await uploadToCloudinary(image);
            setImageUrl(imageUrl)

            console.log(imageUrl)
        }

        await createMarket({ title, question, description, imageUrl });
        redirect('/events')
    }
    return <form onSubmit={handleSubmit} className="max-w-7xl mx-auto py-9 bg-white rounded-lg shadow-2xl mt-20">
        <h1 className="text-center font-semibold text-3xl font-serif">Create a Market</h1>
        <div className="border-b-2 mx-9 mt-3 border-red-500">
        </div>
        <div className="md:grid grid-cols-2">
            <div className="flex flex-col gap-1 mt-3 px-10">
                <label className="text-sm font-semibold" htmlFor="Title">Title</label>
                <input className="border-gray-500 border-2 rounded-md outline-none focus:border-blue-800 p-1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} type="text" placeholder="Enter title for market" />
            </div>
            <div className="flex flex-col gap-1 mt-3 px-10">
                <label className="text-sm font-semibold" htmlFor="Question">Question</label>
                <input className="border-gray-500 border-2 rounded-md outline-none focus:border-blue-800 p-1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)} type="text" placeholder="Enter the Question" />
            </div>
            <div className="flex flex-col gap-1 mt-3 px-10">
                <label className="text-sm font-semibold" htmlFor="Description">Description</label>
                <input className="border-gray-500 border-2 rounded-md outline-none focus:border-blue-800 p-1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} type="text" placeholder="Enter the Description" />
            </div>
            <div className="flex flex-col gap-1 mt-3 px-10">
                <label className="text-sm font-semibold" htmlFor="Image">Image</label>
                <input className="border-gray-500 border-2 rounded-md outline-none focus:border-blue-800 p-1" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0] || null)} type="file" accept="image/*" />
            </div>
        </div>
        <div className="flex justify-center mt-9">
            <button className="rounded-md font-bold bg-green-700 p-2 w-48 text-white" type="submit" >Create</button>
        </div>
    </form>
}