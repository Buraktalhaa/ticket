import { Worker } from 'bullmq';
import prisma from '../../common/utils/prisma';
import redis from '../../common/utils/redis';

export const cleanupWorker = new Worker('order-cleanup', async (job) => {
    try {
        const { orderId, ticketId, quantity } = job.data;

        // Validate input data
        if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
            console.error(`❌ Invalid orderId:`, orderId);
            return;
        }

        if (!ticketId || typeof ticketId !== 'string' || ticketId.trim() === '') {
            console.error(`❌ Invalid ticketId:`, ticketId);
            return;
        }

        if (typeof quantity !== 'number' || isNaN(quantity) || quantity <= 0) {
            console.error(`❌ Invalid quantity:`, quantity);
            return;
        }

        // Fetch order
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            console.warn(`⚠️ Order with ID ${orderId} not found. Skipping cleanup.`);
            return;
        }

        // If order is still pending, delete it and restore ticket stock
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

            console.log(`🧹 Order ${orderId} deleted and ${quantity} ticket(s) restored to stock.`);
        } else {
            console.log(`✅ Order ${orderId} has status "${order.status}", no cleanup needed.`);
        }

    } catch (error) {
        console.error(`❌ Error occurred while processing cleanup job ${job.id}:`, error);
    }

}, { connection: redis });