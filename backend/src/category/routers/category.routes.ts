import { Router } from "express";
import { authenticateToken } from "../../common/middleware/tokenMiddleware";
import { permissionControl } from "../../profile/middleware/permissionMiddleware";
import { createCategory } from "../controller/createCategory";
import { deleteCategory } from "../controller/deleteCategory";
import { editCategory } from "../controller/editCategory";

const router = Router()

router.post('/create-category', authenticateToken, permissionControl, createCategory)
router.post('/delete-category', authenticateToken, permissionControl, deleteCategory)
router.post('/edit-category', authenticateToken, permissionControl, editCategory)



export default router;