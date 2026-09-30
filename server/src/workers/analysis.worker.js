import { Worker } from "bullmq";
import redis from "../config/redis.js";

const worker = new Worker(
    "analysis",
    async (job) => {
        console.log("Processing job:", job.id);
        console.log("Job data:", job.data);

        return {
            success: true,
            message: "Analysis job processed"
        };
    },
    {
        connection: redis
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`Job ${job?.id} failed:`, error);
});