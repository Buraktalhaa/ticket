import { Router } from "express";
import { authenticateToken } from '../middleware/tokenController'
import { getProfile } from "../controller/getProfile";
import { updateProfile } from "../controller/updateProfile";

const router = Router()

router.get('/myProfile', authenticateToken, getProfile)

router.put('/myProfile/update', authenticateToken , updateProfile)

export default router;