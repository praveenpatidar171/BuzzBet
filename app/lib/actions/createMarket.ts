"use server"
import prisma from "../prisma"

export interface Props {
    title: string,
    question: string,
    imageUrl?: string | null,
    description?: string
}
export async function createMarket({ title, question, imageUrl, description }: Props) {

    if (!title || !question) {
        throw new Error('Title and Questions are required !')
    }

    const market = await prisma.market.create({
        data: {
            title,
            imageUrl,
            question,
            description
        }
    })

    return market

}