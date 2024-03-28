import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
});

const OrderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: Number,
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    address: addressSchema,
    orderStatus: {
      type: String,
      required: true,
      default: "not-confirmed",
    },
    paymentStatus: {
      type: String,
      required: true,
      default: "unpaid",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", OrderSchema);
