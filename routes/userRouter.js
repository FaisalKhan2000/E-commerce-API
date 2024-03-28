import express from "express";
const router = express.Router();

import {
  getCurrentUser,
  getApplicationStats,
  updateUser,
} from "../controllers/userController.js";

import upload from "../middleware/multerMiddleware.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

router.route("/current-user").get(getCurrentUser);
router
  .route("/application-stats")
  .get(authorizePermissions("admin"), getApplicationStats);
router.route("/update-user").patch(upload.single("image"), updateUser);

export default router;
