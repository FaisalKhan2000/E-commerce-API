import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";

import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";

// GET CART
const getCart = async (req, res) => {
  const owner = req.user.userId;

  const cart = await Cart.findOne({ owner });

  if (cart && cart.products.length > 0) {
    res.status(StatusCodes.OK).json({ cart });
  } else {
    res.send(null);
  }
};

// ADD TO CART
const addTOCart = async (req, res) => {
  const owner = req.user.userId;
  const { productId, quantity } = req.body;

  // Find the cart for the user
  let cart = await Cart.findOne({ owner });

  // Retrieve the product information
  const product = await Product.findById(productId);
  if (!product) throw new NotFoundError(`No product with ID: ${productId}`);

  const price = product.price;
  const name = product.title;

  if (!cart) {
    // If cart doesn't exist for the user, create a new cart
    cart = await Cart.create({
      owner,
      products: [{ productId, name, quantity, price }],
      bill: quantity * price,
    });
  } else {
    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // If product already exists, update its quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add it to the cart
      cart.products.push({ productId, name, quantity, price });
    }

    // Update the total bill
    cart.bill = cart.products.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );

    // Save the updated cart
    await cart.save();
  }

  // Return the updated cart
  res.status(StatusCodes.OK).json({ cart });
};

// DELETE CART
const deleteCart = async (req, res) => {
  const owner = req.user.userId;

  // Find the cart for the user
  const cart = await Cart.findOneAndDelete({ owner });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  res.status(StatusCodes.OK).json({ message: "Cart deleted successfully" });
};

// DELETE PRODUCT FROM CART
const deleteProductFromCart = async (req, res) => {
  const owner = req.user.userId;
  const { productId } = req.params;

  // Find the cart for the user
  const cart = await Cart.findOne({ owner });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  // Check if the product exists in the cart
  const existingProductIndex = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (existingProductIndex === -1) {
    throw new NotFoundError(
      `Product with ID ${productId} not found in the cart`
    );
  }

  // Remove the product from the cart
  cart.products.splice(existingProductIndex, 1);

  // Update the total bill
  cart.bill = cart.products.reduce(
    (total, product) => total + product.quantity * product.price,
    0
  );

  // Save the updated cart
  await cart.save();

  res
    .status(StatusCodes.OK)
    .json({ message: "Product deleted from cart successfully", cart });
};

export { addTOCart, deleteProductFromCart, getCart, deleteCart };
