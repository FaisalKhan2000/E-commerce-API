import express from "express";

const router = express.Router();

import {
  getCart,
  addTOCart,
  deleteProductFromCart,
  deleteCart,
} from "../controllers/cartController.js";

router.route("/").get(getCart).post(addTOCart).delete(deleteCart);
router.route("/:productId").delete(deleteProductFromCart);

export default router;
