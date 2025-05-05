import { Router } from "express";
import { createCompany } from "../controller/createCompany";


const router = Router()

router.post('/create-company', createCompany)



export default router;