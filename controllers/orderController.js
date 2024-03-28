import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";
import User from "../models/AuthModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";

// create order
const createOrder = async (req, res) => {
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
    status: "order created",
    order,
  });
};

// confirm order
const confirmOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    throw new NotFoundError(
      `Cannot find the order with order ID: ${req.params.id}`
    );

  // Create a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.bill,
    currency: "usd",
  });

  if (paymentIntent.status === "succeeded") {
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();
  }

  // since we are not using front end we will directly confirm the order
  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  await order.save();

  // Send response with client secret for the payment intent
  res.status(StatusCodes.CREATED).json({
    clientSecret: paymentIntent.client_secret,
    message: "Order confirmed successfully",
  });
};

const processOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    throw new NotFoundError(
      `Cannot find the order with order ID: ${req.params.id}`
    );

  if (order.paymentStatus === "paid" && order.orderStatus === "confirmed") {
    order.orderStatus = "processing";
    await order.save();
  }
  res.status(StatusCodes.OK).json({ msg: "order is processed" });
};

const shipOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    throw new NotFoundError(
      `Cannot find the order with order ID: ${req.params.id}`
    );

  if (order.paymentStatus === "paid" && order.orderStatus === "processing") {
    order.orderStatus = "shipping";
    await order.save();
  }
  res.status(StatusCodes.OK).json({ msg: "order is shipped" });
};

const deliverOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    throw new NotFoundError(
      `Cannot find the order with order ID: ${req.params.id}`
    );

  if (order.paymentStatus === "paid" && order.orderStatus === "shipping") {
    order.orderStatus = "delivered";
    await order.save();
  }
  res.status(StatusCodes.OK).json({ msg: "order is delivered" });
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order)
    throw new NotFoundError(
      `Cannot find the order with order ID: ${req.params.id}`
    );

  order.orderStatus = "cancelled";
  order.paymentStatus = "refunded";
  await order.save();

  res.status(StatusCodes.OK).json({ msg: "order is cancelled" });
};

const getOrders = async (req, res) => {
  const order = await Order.find({ owner: req.user.userId });

  if (order) {
    res.status(StatusCodes.OK).json({ order });
  } else {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "no orders found" });
  }
};

export {
  getOrders,
  createOrder,
  confirmOrder,
  processOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
};
