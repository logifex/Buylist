import { Router } from "express";
import { AuthController } from "../controllers";
import { authenticate } from "../middlewares";

const router = Router();

router.delete("/", authenticate, AuthController.deleteUser);

export default router;
