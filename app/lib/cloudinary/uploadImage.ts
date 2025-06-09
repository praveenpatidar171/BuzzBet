export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        return data.secure_url
    } catch (error) {
        console.error("Cloudinary upload failed", error)
        return null
    }
}