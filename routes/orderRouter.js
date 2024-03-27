import express from "express";
const router = express.Router();

import { getOrders, checkout } from "../controllers/orderController.js";

router.route("/checkout").post(checkout);
router.route("/").get(getOrders);

export default router;
