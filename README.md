# ⚡ BetBuzz – Real-Time Prediction Market App

**BetBuzz** is a full-stack, Probo-style prediction market where users can trade on YES/NO outcomes with live odds, manual price input, and smart partial matching. Built for speed, realism, and learning.

> 🚀 Built with Next.js, PostgreSQL, Redis, Prisma, Tailwind, and Socket.IO  
> 🔐 Secure auth via NextAuth with Phone + Google support  
> 📈 Inspired by Probo.ai — but fully open-source!

---

## 🌐 Live Demo

Coming soon... [Deployed via Vercel](#)

---

## ✨ Features

- ✅ **Real-Time Market Prices**
  - Live YES/NO prices powered by Socket.IO and Redis pub/sub
  - Updated every time a bet is placed or matched
- 🧠 **Smart Bet Matching Engine**
  - Manual price input with partial matching logic
  - Background job (cron) matches complementary orders
  - Supports pending → matched → resolved flow
- 📊 **Market Graph & Snapshots**
  - Historical snapshot data stored per market
  - Used to build graphs and track market trends
- 🧾 **Portfolio Dashboard**
  - View active trades, unmatched bets, and full history
  - Cancel unmatched bets with real-time update
- 🔐 **Authentication & Wallets**
  - Users can log in via phone/password or Google
  - Wallets auto-created with starting balance (e.g. 1,000 coins)
- 🛠 **Admin Controls**
  - Resolve market outcomes with one click (YES / NO)
  - Refund unmatched predictions + finalize payouts
- 📦 **Type-safe & Scalable Backend**
  - PostgreSQL + Prisma ORM for structured data modeling
  - Redis (Upstash) used for fast pub/sub matching engine
- 💬 **Toast notifications**
  - Smooth UI feedback on bet actions, errors, and updates

---

## 🛠 Tech Stack

| Layer        | Tech                                 |
|--------------|--------------------------------------|
| Frontend     | **Next.js 14** (App Router) + Tailwind CSS |
| Auth         | **NextAuth** (Credentials + Google)  |
| Backend/API  | **Prisma**, **PostgreSQL**, **Redis** (Upstash for deployment and docker for local development) |
| Real-Time    | **Socket.IO** with room-based updates |
| Background Jobs | **node-cron** + Redis for bet matching |
| Hosting      | Vercel (Next.js) + Neon + Upstash |

---

## 🧪 Local Development

```bash
git clone https://github.com/your-username/betbuzz.git
cd betbuzz

# Install deps
npm install

# Create your .env file based on .env.example
# DATABASE_URL, REDIS_URL, NEXTAUTH_SECRET, etc.

# Run local dev server
npm run dev

# Run the bet matching job
npm run start-bet-job
```

---

## 🚀 Deployment

- Frontend + API → Vercel  
- PostgreSQL → Neon  
- Redis → Upstash (REST mode)  
- NextAuth: Google + Phone credentials

---

## 🧑‍💻 Author

Made with ❤️ by **Praveen Patidar**

- 📧 Email: [praveen_k@bt.iitr.ac.in](mailto:praveen_k@bt.iitr.ac.in)
- 🔗 LinkedIn: [linkedin.com/in/praveen-patidar-0728ba216](https://www.linkedin.com/in/praveen-patidar-0728ba216/)
- 🐦 Twitter/X: [@_praveen57_](https://x.com/_praveen57)
- 💻 GitHub: [@praveenpatidar171](https://github.com/praveenpatidar171)

---

## 📌 License

This project is open source and free to use under the [MIT License](LICENSE).
