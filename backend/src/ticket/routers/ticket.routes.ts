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

const router = Router()

router.post('/create-ticket', authenticateToken, permissionControl, createTicket)
router.post('/delete-ticket', authenticateToken, permissionControl, companyMiddleware, deleteTicket)
router.get('/get-tickets', getTickets)

router.get('/is-seller', authenticateToken, permissionControl, isSeller)
router.get('/seller/sellerTickets', authenticateToken, permissionControl, sellerTickets)
router.post('/edit-ticket', authenticateToken, permissionControl, companyMiddleware, editTicket)    //TODO:

router.get('/admin/statusPanel', authenticateToken, permissionControl, statusPanel)
router.post('/admin/statusPanel/update-status', authenticateToken, permissionControl, updateTicketStatus)

export default router;