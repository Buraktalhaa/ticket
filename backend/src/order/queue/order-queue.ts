import { Queue } from 'bullmq';
import redis from '../../common/utils/redis'

export const orderQueue = new Queue('order-queue', {
    connection: redis
});

export const cleanupQueue = new Queue('order-cleanup', {
    connection: redis
});