import express from "express";
const router = express.Router();

import {
  getAllProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  validateProductInput,
  validateIDParam,
} from "../middleware/validationMiddleware.js";

router.route("/").get(getAllProducts).post(validateProductInput, addProduct);
router
  .route("/:id")
  .get(validateIDParam, getProduct)
  .patch(validateProductInput, validateIDParam, updateProduct)
  .delete(validateIDParam, deleteProduct);

export default router;
