import { Request, Response } from 'express';
import { handleStripeWebhook } from '../controller/stripeWebhook';

export default (req: Request, res: Response) => {
    handleStripeWebhook(req, res);
};
