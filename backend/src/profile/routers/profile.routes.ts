import { Router } from "express";
import { authenticateToken } from '../middleware/tokenController'
import { getProfile } from "../controller/getProfile";
import { updateProfile } from "../controller/updateProfile";
import { updatePassword } from "../controller/updatePassword";

const router = Router()

router.get('/myProfile', authenticateToken, getProfile)

router.put('/myProfile/update', authenticateToken , updateProfile)

router.put('/myProfile/updatePassword', authenticateToken, updatePassword)

export default router;