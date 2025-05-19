import { Router } from "express";
import { authenticateToken } from "../../common/middleware/tokenMiddleware";
import { permissionControl } from "../../profile/middleware/permissionMiddleware";
import { createTicket } from "../controller/createTicket";
import { deleteTicket } from "../controller/deleteTicket";
import { editTicket } from "../controller/editTicket";
import { getTickets } from "../controller/getTickets"
import { updateTicketStatus } from "../controller/changeTicketStatus";
import { companyMiddleware } from "../middleware/companyMiddleware";
import { isSeller } from "../controller/isSeller";
import { sellerTickets } from "../controller/sellerTickets";
import { statusPanel } from "../controller/statusPanel";

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