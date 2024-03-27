import { body, param, validationResult } from "express-validator";
import {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customError.js";

import mongoose from "mongoose";
import Product from "../models/ProductModel.js";
import User from "../models/AuthModel.js";

import { CATEGORY } from "../utils/constants.js";

const withValidationErrors = (validationValues) => {
  return [
    validationValues,
    (req, res, next) => {
      const errors = validationResult(req);
      console.log(errors);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no job")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith("not authorized")) {
          throw new UnauthorizedError(errorMessages);
        }

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

// validate product input
export const validateProductInput = withValidationErrors([
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").notEmpty().withMessage("Price is required"),
  body("discountPercentage")
    .notEmpty()
    .withMessage("Discount Percentage is required"),
  body("rating").notEmpty().withMessage("Rating is required"),
  body("stock").notEmpty().withMessage("Stock is required"),
  body("brand").notEmpty().withMessage("Brand is required"),
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(Object.values(CATEGORY))
    .withMessage("Invalid category value"),
]);

// validate Id
export const validateIDParam = withValidationErrors([
  // value is id
  param("id").custom(async (id, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new BadRequestError("invalid Mongodb Id");
    }

    const product = await Product.findById(id);

    if (!product) throw new NotFoundError(`no job with id ${id}`);
  }),
]);

// validate register
export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName").notEmpty().withMessage("lastName is required"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),

  body("password").notEmpty().withMessage("password is required"),
]);
