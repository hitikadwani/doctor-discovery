import { Router } from "express";
import { getSpecialities } from "../controllers/specialities";

const router = Router();

router.get('/', getSpecialities);
export default router; 