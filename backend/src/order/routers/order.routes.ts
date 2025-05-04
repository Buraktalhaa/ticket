import { Router } from "express";
import { authenticateToken } from "../../common/middleware/tokenMiddleware";
import { permissionControl } from "../../profile/middleware/permissionMiddleware";
import { createOrder } from "../controller/createOrder";
import { deleteOrder } from "../controller/deleteOrder";
import { getOrders } from "../controller/getOrders";
import { getUserPoints } from "../controller/getPoints"

const router = Router()

router.post('/create-order', authenticateToken, permissionControl, createOrder)
router.post('/delete-order', authenticateToken, permissionControl, deleteOrder)
router.get('/orders', authenticateToken, permissionControl, getOrders)
router.get('/get-points', authenticateToken, permissionControl, getUserPoints)


export default router;