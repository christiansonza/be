import { Router } from "express";
import { createSession, getSessionById, getSessions } from "../controllers/gameController";

const router = Router();

router.get("/", getSessions);
router.get("/:id", getSessionById);
router.post("/", createSession);

export default router;
