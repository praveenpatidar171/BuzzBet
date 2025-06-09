import next from "next";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { parse } from "url";
import redis from "./app/lib/utils/globalRedis";

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

    redis.subscribe('snapshot:update', (err) => {
        if (err) {
            console.error(" Failed to subscribe to snapshot:update:", err);
        } else {
            console.log("Subscribed to snapshot:update");
        }
    })

    redis.on('message', (channel, message) => {
        if (channel === 'snapshot:update') {
            try {
                const { marketId, newsnap } = JSON.parse(message);
                console.log('parsed redis data is :', JSON.parse(message));
                console.log('parsed redis data marketid is:', marketId);
                console.log('parsed redis data snapshot is :', newsnap);

                io.to(`market-${marketId}`).emit('snapshot:update', {
                    marketId: marketId,
                    snapshot: newsnap
                })
                console.log(`Emitted new snapshot to room: market-${marketId}`);
            } catch (e) {
                console.error("Error parsing message or emitting snapshot:", e);
            }
        }
    })

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("joinMarket", (marketId: string) => {
            socket.join(`market-${marketId}`);
            console.log(`User joined room market-${marketId}`);
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