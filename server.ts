
//Error handlers 
process.on("uncaughtException", (err) => {
    console.error("[Fatal] Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("[Fatal] Unhandled Rejection:", reason);
});


import next from "next";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { parse } from "url";

import { getUpdatedPortfolio } from "./app/lib/predictionsUpdate";
import { redisSub } from "./app/lib/utils/globalRedis";

console.log('server.ts is started')

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT || "3000", 10);

console.log('it crossed PORT,: ', PORT);
app.prepare().then(() => {
    console.log('inside prepareing ')
    const server = http.createServer((req, res) => {
        const parsedUrl = parse(req.url || "", true);
        handle(req, res, parsedUrl);
    });

    const io = new SocketIOServer(server, {
        cors: {
            origin: "*", // allow from anywhere in dev
        },
    });

    redisSub.subscribe('snapshot:update', (err) => {
        if (err) {
            console.error(" Failed to subscribe to snapshot:update:", err);
        } else {
            console.log("Subscribed to snapshot:update");
        }
    })

    redisSub.subscribe('prediction:update', (err) => {
        if (err) {
            console.error("Failed to subscribe to prediction:update:", err);
        } else {
            console.log("Subscribed to prediction:update");
        }
    });

    redisSub.on('message', async (channel, message) => {
        if (channel === 'snapshot:update') {
            try {
                const { marketId, newsnap } = JSON.parse(message);
                console.log('parsed redis data is :', JSON.parse(message));
                console.log('parsed redis data marketid is:', marketId);
                console.log('parsed redis data snapshot is :', newsnap);

                io.to(`market-${marketId}`).emit('snapshot:update', {
                    marketId: marketId,
                    snapshot: {
                        yesCount: newsnap.yesCount,
                        yesPrice: newsnap.yesPrice,
                        noCount: newsnap.noCount,
                        createdAt: newsnap.createdAt
                    }
                })
                console.log(`Emitted new snapshot to room: market-${marketId}`);

                io.to("markets").emit('snapshot:update', {
                    marketId,
                    snapshot: newsnap
                })

                console.log(`Also emitted to room: markets`);
            } catch (e) {
                console.error("Error parsing message or emitting snapshot:", e);
            }
        }

        if (channel === 'prediction:update') {
            try {
                const { userId } = JSON.parse(message);
                if (!userId) return;
                const { active, inactive } = await getUpdatedPortfolio(Number(userId));

                io.to(`user-${userId}`).emit("portfolio:update:full", {
                    active,
                    inactive,
                });

                console.log(`Emitted updated portfolio to user-${userId}`);

            } catch (error) {
                console.error("Error in prediction:update handler:", error);
            }
        }
    })

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("joinMarket", (marketId: string) => {
            socket.join(`market-${marketId}`);
            console.log(`User joined room market-${marketId}`);
        });

        socket.on('join-room', (RoomName: string) => {
            socket.join(RoomName);
            console.log(`User joined room ${RoomName}`);
        })

        socket.on("leave-room", (roomName: string) => {
            socket.leave(roomName);
            console.log(`User left room ${roomName}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error(" app.prepare() failed:", err);
});