import { analysisQueue } from "../queues/analysis.queue.js";

const job = await analysisQueue.add("verify-content", {
    analysisId: 4,
    contentId: 3
});

console.log("Job added:", job.id);

await analysisQueue.close();