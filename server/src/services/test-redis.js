import redis from "../config/redis.js";

const result = await redis.ping();

console.log("Redis ping:", result);

await redis.quit();