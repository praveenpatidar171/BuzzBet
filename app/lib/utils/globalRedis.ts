// For deployment

import dotenv from "dotenv";
dotenv.config();

import Redis from "ioredis";

declare global {
    var redisClient: Redis | undefined;
}

console.log(process.env.REDIS_URL);
if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL must be set in environment variables");
}

const redis = global.redisClient || new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
    console.log("Redis connected from global");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

if (process.env.NODE_ENV !== "production") {
    global.redisClient = redis;
}

export default redis;


//// for local development

// import Redis from "ioredis";

// declare global {
//     var redisClient: Redis | undefined;
// }

// const redisHost = process.env.REDIS_HOST || "localhost";
// const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

// const redis = global.redisClient || new Redis({
//     host: redisHost,
//     port: redisPort,
// });
// redis.on("connect", () => {
//     console.log("Redis connected");
// });

// redis.on("error", (err: any) => {
//     console.error("Redis error:", err.message);
// });

// if (process.env.NODE_ENV !== "production") {
//     global.redisClient = redis;
// }

// export default redis;
