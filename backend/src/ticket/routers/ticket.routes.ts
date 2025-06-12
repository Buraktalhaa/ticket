import { Router } from "express";
import { getTickets } from "../controller/get-tickets"
import { getTicketsByCategory } from "../controller/get-tickets-by-category";
import { getTicketById } from "../controller/get-ticket-by-id";
import { authenticateOptionalJWT } from "../../common/middleware/optional-jwt-middleware.ts";

const router = Router()

router.get('/get-tickets', authenticateOptionalJWT, getTickets)
router.get('/get-tickets/by-id/:id', authenticateOptionalJWT, getTicketById)
router.get('/get-tickets/by-category/:category', authenticateOptionalJWT, getTicketsByCategory)

export default router;