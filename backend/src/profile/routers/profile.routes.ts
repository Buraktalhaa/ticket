import { Router } from "express";
import { authenticateToken } from '../middleware/tokenController'
import { getProfile } from "../controller/getProfile";
import { updateProfile } from "../controller/updateProfile";
import { editPassword } from "../controller/editPassword";

const router = Router()

router.get('/myProfile', authenticateToken, getProfile)

router.put('/myProfile/update', authenticateToken , updateProfile)

router.put('/myProfile/updatePassword', authenticateToken, editPassword)


export default router;