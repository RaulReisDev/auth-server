import express from "express";
import AuthValidation from "../validations/AuthValidation.js";

const router = express.Router();

// Import CRUD Controller
import AuthController from "../controllers/AuthController.js";

router.post("/login", AuthValidation.loginValidation(), AuthController.login);
router.post("/register", AuthValidation.registerValidation(), AuthController.register);
router.post("/password/recovery", AuthValidation.passwordRecoveryValidation(), AuthController.sendRecoveryCode);
router.post("/password/reset", AuthValidation.resetPasswordValidation(), AuthController.resetPassword);

export default router;