import { Request, Response } from 'express';
import { DecodedUser } from '../../common/type/request.type';
import { handleError } from '../../common/error-handling/handleError';
import { ResponseStatus } from '../../common/enums/status.enum';
import { orderQueue } from '../queue/orderQueue';
import '../queue/orderWorker';
import redis from '../../common/utils/redis';
import { wait } from '../../common/utils/wait';

export async function createOrder(req: Request, res: Response) {
    const { userId } = req.user as DecodedUser;
    const { ticketId, quantity, usePoints } = req.body;

    if (!ticketId || !quantity) {
        handleError(res, 'ticketId and quantity are required', 400);
        return;
    }

    // Added orders in job queue
    const job = await orderQueue.add('create-order', {
        userId,
        ticketId,
        quantity,
        usePoints
    }, {
        attempts: 3,      // try 3 times
        backoff: {
            type: 'fixed',
            delay: 3000   //  3 seconds
        }
    });

    await wait(3000)

    let paymentLink: string | null = null;
    const redisKey = `payment-link:${userId}:${job.id}`;
    for (let i = 0; i < 60; i++) {
        paymentLink = await redis.get(redisKey);
        if (paymentLink) {
            break;
        }
        await wait(1000);
    }

    if (paymentLink) {
        res.status(200).json({
            status: ResponseStatus.SUCCESS,
            message: 'Order processed successfully',
            jobId: job.id,
            paymentLink,
        });
        return
    } else {
        handleError(res, "Payment link can't created", 404)
        return
    }
}
