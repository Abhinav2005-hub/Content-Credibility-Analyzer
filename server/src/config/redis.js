import "dotenv/config";

import IORedis from "ioredis";

const redis = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (error) => {
    console.error("Redis connection error:", error);
});

export default redis;