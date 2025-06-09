import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import prisma from "./prisma"
import bcrypt from "bcryptjs"
export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                phoneNumber: { label: "Phone Number", type: "text", placeholder: "1234567890" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"phoneNumber" | "password", string> | undefined) {

                try {
                    const hashedPassword = await bcrypt.hash(credentials?.password || "", 10);

                    const user = await prisma.user.findFirst({
                        where: {
                            phoneNumber: credentials?.phoneNumber
                        }
                    })
                    if (user) {
                        const passwordMatch = await bcrypt.compare(credentials?.password as string, user.password);
                        if (passwordMatch) {
                            return {
                                id: user.id.toString(),
                                name: user.name,
                                phoneNumber: user.phoneNumber,
                                email: user.email
                            }
                        }
                        return null
                    } else {
                        const newUser = await prisma.user.create({
                            data: {
                                phoneNumber: credentials?.phoneNumber,
                                password: hashedPassword
                            }
                        });

                        await prisma.wallet.create({
                            data: {
                                userId: newUser.id,
                            }
                        })

                        return {
                            id: newUser.id.toString(),
                            name: newUser.name,
                            email: newUser.email,
                            phoneNumber: newUser.phoneNumber
                        }
                    }
                } catch (error) {
                    console.error(error);
                    return null
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })

    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub;
            const wallet = await prisma.wallet.findUnique({
                where: {
                    userId: Number(token.sub)
                }
            })

            const user = await prisma.user.findUnique({
                where: {
                    id: Number(token.sub)
                }
            })

            session.user.balance = wallet?.balance || 0
            session.user.isAdmin = user?.isAdmin
            return session
        }
    },
    pages: {
        signIn: '/auth/signin'
    }

}