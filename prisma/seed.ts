import prisma from "@/app/lib/prisma";

async function main() {
    const marketId = 2;
    const totalSnapshots = 100;

    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    let yesCount = 0;
    let noCount = 0;
    let yesPrice = 5.0;

    const snapshots = [];

    for (let i = 0; i < totalSnapshots; i++) {
        // Random offset within hour
        const hourSegment = Math.floor(i / (totalSnapshots / 3));
        const baseTime = new Date(threeHoursAgo.getTime() + hourSegment * 60 * 60 * 1000);
        const offsetMinutes = Math.floor(Math.random() * 60);
        const offsetSeconds = Math.floor(Math.random() * 60);
        const createdAt = new Date(baseTime.getTime() + offsetMinutes * 60 * 1000 + offsetSeconds * 1000);


        // Incremental count
        const increment = Math.floor(Math.random() * 5) + 1;
        yesCount += increment;
        noCount = yesCount;

        // Random price movement
        const priceChange = (Math.random() * 0.4) - 0.2;
        yesPrice = Math.max(1.0, Math.min(9.9, yesPrice + priceChange));
        yesPrice = Number(yesPrice.toFixed(1));

        snapshots.push({
            marketId,
            yesCount,
            noCount,
            yesPrice,
            createdAt,
        });
    }

    // 🧠 Sort all snapshots by timestamp ascending
    snapshots.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    for (const [index, snapshot] of snapshots.entries()) {
        await prisma.marketSnapshot.create({ data: snapshot });
        console.log(
            `#${index + 1} | ${snapshot.createdAt.toISOString()} | price=${snapshot.yesPrice} | count=${snapshot.yesCount}`
        );
    }

    console.log("✅ Seed completed with sorted snapshots.");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(() => prisma.$disconnect());
