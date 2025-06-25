import React from 'react'
import { ImSpinner9 } from "react-icons/im";
export const Loader = () => {
    return (
        <div className='flex max-w-6xl mx-auto justify-center items-center'>
            <div className='flex items-center' >
                < ImSpinner9 className='animate-spin mr-2' />
                <h1 className='text-gray-700 font-sans '>Please wait..</h1>
            </div>
        </div>
    )
}
 