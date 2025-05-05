import { Router } from "express";
import { authenticateToken } from "../../common/middleware/tokenMiddleware";
import { permissionControl } from "../../profile/middleware/permissionMiddleware";
import { createOrder } from "../controller/createOrder";
import { cancelOrder } from "../controller/cancelOrder";
import { getOrders } from "../controller/getOrders";
import { getUserPoints } from "../controller/getPoints"

const router = Router()

router.post('/create-order', authenticateToken, permissionControl, createOrder)
router.post('/cancel-order', authenticateToken, permissionControl, cancelOrder)
router.get('/get-orders', authenticateToken, permissionControl, getOrders)
router.get('/get-points', authenticateToken, permissionControl, getUserPoints)


export default router;