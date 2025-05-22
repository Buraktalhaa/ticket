import { Worker } from 'bullmq';
import prisma from '../../common/utils/prisma';
import redis from '../../common/utils/redis';

export const cleanupWorker = new Worker('order-cleanup', async (job) => {
    const { orderId, ticketId, quantity } = job.data;

    const order = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!order) {
        console.warn(`Order ${orderId} not found, skipping cleanup`);
        return;
    }

    if (order.status === 'pending') {
        await prisma.order.delete({
            where: { id: orderId }
        });

        await prisma.ticket.update({
            where: { id: ticketId },
            data: {
                stock: {
                    increment: quantity
                }
            }
        });

        console.log(`🧹 Order ${orderId} silindi ve ${quantity} ticket geri yüklendi`);
    } else {
        console.log(`✅ Order ${orderId} zaten ${order.status}, silinmedi`);
    }
}, { connection: redis });
