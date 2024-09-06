import Router from "express";
import { forgotPasswordHandler, getCurrentUser, loginHandler, logoutHandler, refreshAccessToken, registerHandler, resetPasswordHandler } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerHandler);
router.route("/login").post(loginHandler);
router.route("/logout").post(logoutHandler);
router.route("/forgot-password").post(forgotPasswordHandler);

//secured routes:
router.route("/reset-password").post(resetPasswordHandler);
router.route("/get-current-user").get(getCurrentUser);
router.route("/refresh-access-token").post(refreshAccessToken);

export default router;