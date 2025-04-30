import { Router } from "express";
import { authenticateToken } from '../middleware/tokenController'
import { getProfile } from "../controller/getProfile";
import { updateProfile } from "../controller/updateProfile";
import { editPassword } from "../controller/editPassword";
import { permissionControl } from "../middleware/permissionControl";

const router = Router()

router.get('/myProfile', authenticateToken, permissionControl , getProfile)

router.put('/myProfile/update', authenticateToken ,permissionControl, updateProfile)

router.put('/myProfile/updatePassword', authenticateToken, permissionControl, editPassword)


export default router;