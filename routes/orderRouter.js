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

router.route("/create-order").post(createOrder);
router.route("/:id/confirm").get(confirmOrder);
router.route("/:id/process").get(processOrder);
router.route("/:id/ship").get(shipOrder);
router.route("/:id/deliver").get(deliverOrder);
router.route("/:id/cancel").get(cancelOrder);
router.route("/customer/:id").get(getOrders);

export default router;
