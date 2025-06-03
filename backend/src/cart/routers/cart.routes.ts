import { Router } from "express";
import { deleteCart } from "../controller/delete-cart";
import { getCart } from "../controller/get-cart";
import { updateCart } from "../controller/update-cart";
import { addToCart } from "../controller/add-to-cart";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../common/middleware/permission-middleware";

const router = Router();

router.get('/get-cart', authenticateToken, permissionControl, getCart);
router.post('/add-to-cart', authenticateToken, permissionControl, addToCart)
router.post('/update-cart', authenticateToken, permissionControl, updateCart)
router.delete('/delete-cart', authenticateToken, permissionControl, deleteCart)

export default router;