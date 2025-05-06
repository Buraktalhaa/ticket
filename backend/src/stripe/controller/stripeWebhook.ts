import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../../common/utils/prisma';
import { Email } from '../../common/utils/email';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-04-30.basil',
});

export async function handleStripeWebhook(req: Request, res: Response) {
    console.log("Webhookta")
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        );
    } catch (err: any) {
        console.log("hata burada")
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }
    
    // Ödeme tamamlandı olayını dinle
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
    }
    
    res.status(200).json({ received: true });
    return
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    // Metadata'dan sipariş bilgilerini al
    const metadata = session.metadata;
    if (!metadata || !metadata.orderId) {
        console.error('Missing order information in metadata');
        return;
    }
    
    const orderId = metadata.orderId;
    const userId = metadata.userId;
    const ticketId = metadata.ticketId;
    const quantity = parseInt(metadata.quantity);
    const usedPoints = parseInt(metadata.usedPoints || '0');
    const usePoints = metadata.usePoints === 'true';
    
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                ticket: true,
            }
        });
        
        if (!order) {
            console.error(`Order not found: ${orderId}`);
            return;
        }
        
        // Ticket bilgisini al
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId }
        });
        
        if (!ticket) {
            console.error(`Ticket not found: ${ticketId}`);
            return;
        }
        
        // 1. Eğer puan kullanılıyorsa, puanları kullanılmış olarak işaretle
        // Burayi tamamla TODO:
        if (usedPoints > 0 && usePoints) {
            await prisma.point.updateMany({
                where: {
                    userId,
                    categoryId: ticket.categoryId,
                    expiresAt: { gt: new Date() },
                    status: 'unused',
                },
                data: {
                    status: 'used'
                }
            });
        }
        
        const ticketUpdate = await prisma.ticket.update({
            where: {
                id: ticket.id,
            },
            data: {
                stock: ticket.stock - quantity
            }
        });
        
        if (ticketUpdate.stock === 0) {
            await prisma.ticket.update({
                where: {
                    id: ticket.id
                },
                data: {
                    sold: true
                }
            });
        }
        
        const updatedOrder = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status: 'completed',
                paymentId: session.payment_intent as string,
            },
            include: {
                user: true,
                ticket: true,
            }
        });
        
        // 5. E-posta gönder
        const emailService = new Email({ 
            email: updatedOrder.user.email, 
            firstName: updatedOrder.user.firstName 
        }, 'http://localhost:3000/create-order');
        
        await emailService.sendPnr(updatedOrder.ticket.pnr);
        
        const pointsToGive = (ticket.price * (100 - ticket.discount) / 100) * ticket.pointRate;
        
        await prisma.point.create({
            data: {
                userId,
                categoryId: ticket.categoryId,
                point: pointsToGive * quantity,
                orderId: order.id,
                expiresAt: ticket.pointExpiresAt,
            }
        });
        
        console.log(`Order ${orderId} processed successfully`);
    } catch (error) {
        console.error('Error processing successful payment:', error);
    }
}