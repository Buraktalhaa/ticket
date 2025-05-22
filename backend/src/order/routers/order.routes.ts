import { Router } from "express";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../profile/middleware/permission-middleware";
import { createOrder } from "../controller/create-order";
import { cancelOrder } from "../controller/cancel-order";
import { getOrders } from "../controller/get-orders";
import { getUserPoints } from "../controller/get-points"

const router = Router()

router.post('/create-order', authenticateToken, permissionControl, createOrder)
router.post('/cancel-order', authenticateToken, permissionControl, cancelOrder)
router.get('/get-orders', authenticateToken, permissionControl, getOrders)
router.get('/get-points', authenticateToken, permissionControl, getUserPoints)
router.get('/get-order-detail/:id', authenticateToken, permissionControl, )

export default router;