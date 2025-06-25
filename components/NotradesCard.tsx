import Image from "next/image"
import empty from "@/app/lib/utils/empty.png"
export const NotradesCard = ({ content }: { content: string }) => {
    return (
        <div className="flex justify-center items-center mt-12">
            <div className="flex gap-7 items-center">
                <Image src={empty} alt="Empty Image Logo" height={280} width={280} />
                <div className="flex flex-col gap-6">
                    <div className="font-bold text-4xl">Nothing to see here... yet</div>
                    <h1 className="text-xl text-gray-600">{content}</h1>
                </div>
            </div>
        </div>
    )
}
