import express from "express";
const router = express.Router();

import {
  getOrders,
  createOrder,
  confirmOrder,
  processOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
} from "../controllers/orderController.js";

import { authorizePermissions } from "../middleware/authMiddleware.js";

router.route("/create-order").post(createOrder);
router.route("/:id/confirm").get(confirmOrder);
router.route("/:id/process").get(authorizePermissions("admin"), processOrder);
router.route("/:id/ship").get(authorizePermissions("admin"), shipOrder);
router.route("/:id/deliver").get(authorizePermissions("admin"), deliverOrder);
router
  .route("/:id/cancel")
  .get(authorizePermissions("admin", "user"), cancelOrder);
router
  .route("/customer/:id")
  .get(authorizePermissions("admin", "user"), getOrders);

export default router;
