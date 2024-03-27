import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";
import User from "../models/AuthModel.js";
import { StatusCodes } from "http-status-codes";

const checkout = async (req, res) => {
  const owner = req.user.userId;

  // Validate and extract address from request body
  const { address } = req.body;
  if (!address) {
    return res.status(StatusCodes.BAD_REQUEST).send("Address is required");
  }

  // Retrieve user and cart
  const user = await User.findById(owner);
  const cart = await Cart.findOne({ owner });

  // Validate user and cart
  if (!user || !cart) {
    return res.status(StatusCodes.BAD_REQUEST).send("Invalid user or cart");
  }

  // Create order based on cart contents
  const order = await Order.create({
    owner,
    products: cart.products,
    bill: cart.bill,
    address,
  });

  // Delete cart
  await Cart.findByIdAndDelete(cart._id);

  // Send success response with order details
  res.status(StatusCodes.CREATED).json({
    status: "Payment successful",
    order,
  });
};

const getOrders = async (req, res) => {
  const order = await Order.find({ owner: req.user.userId });

  if (order) {
    res.status(StatusCodes.OK).json({ order });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "no orders found" });
  }
};

export { checkout, getOrders };
