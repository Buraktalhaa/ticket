import { Router } from "express";
import { authenticateToken } from '../../common/middleware/tokenMiddleware'
import { getProfile } from "../controller/getProfile";
import { updateProfile } from "../controller/updateProfile";
import { editPassword } from "../controller/editPassword";
import { permissionControl } from "../middleware/permissionMiddleware";
import fileUploadMiddleware from "../../common/middleware/file-upload";

const router = Router()

router.get('/myProfile', authenticateToken, permissionControl , getProfile)

router.put('/myProfile/update', authenticateToken ,permissionControl, fileUploadMiddleware('photoName'), updateProfile)

router.put('/myProfile/updatePassword', authenticateToken, permissionControl, editPassword)


export default router;