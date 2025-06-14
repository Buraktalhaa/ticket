import { Router } from "express";
import { authenticateToken } from '../../common/middleware/token-middleware'
import { getProfile } from "../controller/get-profile";
import { editPassword } from "../controller/edit-password";
import { permissionControl } from "../../common/middleware/permission-middleware";
import fileUploadMiddleware from "../../common/middleware/file-upload";
import { editProfile } from "../controller/edit-profile";

const router = Router()

router.get('/my-profile', authenticateToken, permissionControl , getProfile)
router.put('/my-profile/edit', authenticateToken ,permissionControl, fileUploadMiddleware('profilPhotoUrl'), editProfile)
router.post('/my-profile/edit-password', authenticateToken, permissionControl, editPassword)

export default router;