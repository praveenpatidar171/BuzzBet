// For deployment
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL must be set in environment variables");
}

const redis = global.redisClient || new Redis(process.env.REDIS_URL);
redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (err: any) => {
    console.error("Redis error:", err.message);
});

export default redis;

// // For local development
// import Redis from "ioredis";

// const redisHost = process.env.REDIS_HOST || "localhost";
// const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

// const redis = new Redis({
//     host: redisHost,
//     port: redisPort,
// });
// redis.on("connect", () => {
//     console.log("Redis connected");
// });

// redis.on("error", (err: any) => {
//     console.error("Redis error:", err.message);
// });

// export default redis;
