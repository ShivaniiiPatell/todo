import { Router } from "express";
import userRouter from "./userRoutes"; 
import todoRouter from "./todoRoutes";
const router = Router();

router.use("/", userRouter);
router.use("/", todoRouter);

export default router;
