import { Router } from "express";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../profile/middleware/permission-middleware";
import { createTicket } from "../controller/create-ticket";
import { deleteTicket } from "../controller/delete-ticket";
import { editTicket } from "../controller/edit-ticket";
import { getTickets } from "../controller/get-tickets"
import { updateTicketStatus } from "../controller/change-ticket-status";
import { companyMiddleware } from "../middleware/companyMiddleware";
import { isSeller } from "../controller/is-seller";
import { sellerTickets } from "../controller/seller-tickets";
import { statusPanel } from "../controller/status-panel";
import { getTicketsByCategory } from "../controller/get-tickets-by-category";
import { getTicketById } from "../controller/get-ticket-by-id";

const router = Router()

router.post('/edit-ticket', authenticateToken, permissionControl, companyMiddleware, editTicket) 
router.post('/create-ticket', authenticateToken, permissionControl, createTicket)
router.post('/delete-ticket', authenticateToken, permissionControl, companyMiddleware, deleteTicket)
router.get('/get-tickets', getTickets)
router.get('/get-tickets/by-id/:id', getTicketById)
router.get('/get-tickets/by-category/:category', getTicketsByCategory)

router.get('/is-seller', authenticateToken, permissionControl, isSeller)
router.get('/seller/seller-tickets', authenticateToken, permissionControl, sellerTickets)

router.get('/admin/status-panel', authenticateToken, permissionControl, statusPanel)
router.post('/admin/status-panel/update-status', authenticateToken, permissionControl, updateTicketStatus)

export default router;