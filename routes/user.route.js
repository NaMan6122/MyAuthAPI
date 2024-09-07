import Router from "express";
import { forgotPasswordHandler, getCurrentUser, loginHandler, logoutHandler, refreshAccessToken, registerHandler, resetPasswordHandler } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerHandler);
router.route("/login").post(loginHandler);
router.route("/forgot-password").post(forgotPasswordHandler);

//secured routes:
router.route("/logout").post(verifyJWT, logoutHandler);
router.route("/reset-password").post(verifyJWT, resetPasswordHandler);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/refresh-access-token").post(verifyJWT, refreshAccessToken);

//mail verification routes:
router.route("/verify-email").get(verifyJWT, verifyEmailHandler);
router.route("/forgot-password").get(forgotPasswordHandler, changePasswordHandler);
router.route("/reset-password").get(verifyJWT, resetPasswordHandler);

export default router;