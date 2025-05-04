import { Router } from "express";
import { authenticateToken } from "../../common/middleware/tokenMiddleware";
import { permissionControl } from "../../profile/middleware/permissionMiddleware";
import { createTicket } from "../controller/createTicket";
import { deleteTicket } from "../controller/deleteTicket";
import { editTicket } from "../controller/editTicket";
import { getTickets } from "../controller/getTickets"

const router = Router()


router.post('/create-ticket', authenticateToken, permissionControl, createTicket)
router.post('/delete-ticket', authenticateToken, permissionControl, deleteTicket)
router.post('/edit-ticket', authenticateToken, permissionControl, editTicket)
router.get('/get-tickets', getTickets)

export default router;