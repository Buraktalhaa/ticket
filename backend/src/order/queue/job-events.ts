import { Job } from "bullmq";
import { orderQueue } from "./order-queue";

export const handleFailedJob = async (job: Job, error: Error) => {
    if (!job) {
        console.error(`Job with ID ${job} not found.`);
        return;
    }
    console.error(`❌ Job ${job.id} failed: ${error.message}`);
    await orderQueue.add('create-order', job.data);
};