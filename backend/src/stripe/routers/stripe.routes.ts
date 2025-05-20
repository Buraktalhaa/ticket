import { Request, Response } from 'express';
import { handleStripeWebhook } from '../controller/stripe-webhook';

export default (req: Request, res: Response) => {
    handleStripeWebhook(req, res);
};
