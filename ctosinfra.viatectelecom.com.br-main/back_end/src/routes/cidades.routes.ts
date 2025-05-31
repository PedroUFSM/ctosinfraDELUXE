import { Router } from "express";
import {getCidades, postCidade } from "../controllers/cidades.controller";

const router = Router();

router.get("/", getCidades);
router.post("/", postCidade);

export default router;