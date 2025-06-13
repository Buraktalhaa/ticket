import { Router } from "express";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../common/middleware/permission-middleware";
import { isSeller } from "../controller/is-seller";
import { sellerTickets } from "../controller/seller-tickets";
import { companyMiddleware } from "../../common/middleware/companyMiddleware";
import { createTicket } from "../controller/create-ticket";
import { editTicket } from "../controller/edit-ticket";
import { deleteTicket } from "../controller/delete-ticket";

const router = Router()

router.get('/is-seller', authenticateToken, permissionControl, isSeller)
router.get('/tickets', authenticateToken, permissionControl, sellerTickets)

router.post('/create-ticket', authenticateToken, permissionControl, companyMiddleware, createTicket)
router.post('/edit-ticket', authenticateToken, permissionControl, companyMiddleware, editTicket) 
router.post('/delete-ticket', authenticateToken, permissionControl, companyMiddleware, deleteTicket)


export default router;