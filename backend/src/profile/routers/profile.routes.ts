import { Router } from "express";
import { authenticateToken } from '../../common/middleware/token-middleware'
import { getProfile } from "../controller/get-profile";
import { updateProfile } from "../controller/update-profile";
import { editPassword } from "../controller/edit-password";
import { permissionControl } from "../middleware/permission-middleware";
import fileUploadMiddleware from "../../common/middleware/file-upload";

const router = Router()

router.get('/my-profile', authenticateToken, permissionControl , getProfile)

router.put('/my-profile/update', authenticateToken ,permissionControl, fileUploadMiddleware('photoName'), updateProfile)

router.post('/my-rofile/edit-password', authenticateToken, permissionControl, editPassword)


export default router;