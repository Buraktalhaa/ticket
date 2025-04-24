import { Request, Response, Router } from "express";
import { authenticateToken } from '../controller/tokenController'
import { getProfile } from "../controller/getProfile";
import { updateProfile } from "../controller/updateProfile";

const router = Router()

router.get('/myProfile', authenticateToken, getProfile)

router.get('/myProfile/update', authenticateToken , updateProfile)

export default router;