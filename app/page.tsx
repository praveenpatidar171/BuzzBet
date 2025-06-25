'use client'
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {

  const session = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 mt-10">
      <section className="px-6 py-24 text-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
          Predict and Trade with Confidence
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-8">
          A Probo-style prediction market with real-time odds, portfolio tracking, and smart matching.
        </p>
        <button
          onClick={() => {
            if (session?.data?.user) {
              router.push("/events");
            } else {
              router.push("/api/auth/signin");
            }
          }}
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:shadow-lg transition"
        >
          Try the App
        </button>
      </section>
      <section className="py-20 px-6 max-w-5xl mx-auto grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Real-Time Odds</h2>
          <p className="text-gray-700">Socket-powered snapshot updates and live graphs on every market page.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Portfolio Dashboard</h2>
          <p className="text-gray-700">Track active trades, cancel unmatched bets, and view your full trade history.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Smart Bet Matching</h2>
          <p className="text-gray-700">Manual price input and partial auto-matching with a Redis-powered background job.</p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
          <p className="text-gray-700">Resolve outcomes, refund unmatched bets, and trigger final payouts seamlessly.</p>
        </div>
      </section>

      <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Built with Modern Tools</h2>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {[
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Prisma",
            "PostgreSQL",
            "Socket.IO",
            "Redis",
            "NextAuth"
          ].map((tool, idx) => (
            <span
              key={idx}
              className="bg-gray-100 px-4 py-2 rounded-full animate-float hover:animate-none hover:bg-yellow-100 transition duration-400 ease-in-out"
            >
              {tool}
            </span>
          ))}
        </div>
      </section>

      <footer className="py-10 px-6 text-center text-sm text-gray-500 bg-white border-t">
        <div className="max-w-4xl mx-auto">
          <p className="mb-2">Made by <span className="font-medium text-gray-700">Praveen Patidar</span></p>
          <p>
            {'View on '}
            <a
              href="https://github.com/praveenpatidar171/BuzzBet"
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
