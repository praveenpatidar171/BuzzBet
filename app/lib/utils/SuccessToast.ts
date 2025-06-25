import { Bounce, toast } from 'react-toastify'

export const SuccessToast = (message: string) => {
    return toast.success(message,
        {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        }
    )
}
