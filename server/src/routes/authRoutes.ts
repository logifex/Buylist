import { Router } from "express";
import { AuthController } from "../controllers/index.js";
import { authenticate } from "../middlewares/index.js";

const router = Router();

router.delete("/", authenticate, AuthController.deleteUser);

export default router;
