import express from 'express';
import { handleStripeWebhook } from '../controller/stripeWebhook';

const router = express.Router();

// Stripe webhook işleyicisi için raw body gerekir
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;