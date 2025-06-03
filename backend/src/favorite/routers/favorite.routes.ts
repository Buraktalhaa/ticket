import { Router } from "express";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../common/middleware/permission-middleware";
import { addFavorite } from "../controller/add-favorite";
import { getFavorites } from "../controller/get-favorites";
import { deleteFavorite } from "../controller/delete-favorite";

const router = Router()

router.get('/get-favorites', authenticateToken, permissionControl, getFavorites)
router.post('/add-favorite', authenticateToken, permissionControl, addFavorite)
router.post('/delete-favorite', authenticateToken, permissionControl, deleteFavorite)

export default router;