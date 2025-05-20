import { Router } from "express";
import { createCompany } from "../controller/create-company";

const router = Router()

router.post('/create-company', createCompany)

export default router;