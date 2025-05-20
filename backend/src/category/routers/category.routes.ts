import { Router } from "express";
import { authenticateToken } from "../../common/middleware/token-middleware";
import { permissionControl } from "../../profile/middleware/permission-middleware";
import { createCategory } from "../controller/create-category";
import { deleteCategory } from "../controller/delete-category";
import { editCategory } from "../controller/edit-category";

const router = Router()

router.post('/create-category', authenticateToken, permissionControl, createCategory)
router.post('/delete-category', authenticateToken, permissionControl, deleteCategory)
router.post('/edit-category', authenticateToken, permissionControl, editCategory)



export default router;