import { readFile } from "fs/promises";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Product from "./models/ProductModel.js";
import User from "./models/AuthModel.js";
try {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ email: "faisal@gmail.com" });
  // const user = await User.findOne({ email: "test@test.com" });

  const jsonProducts = JSON.parse(
    await readFile(new URL("./products.json", import.meta.url))
  );
  const products = jsonProducts.map((product) => {
    return { ...product, createdBy: user._id };
  });
  await Product.deleteMany({ createdBy: user._id });
  await Product.create(products);
  console.log("Success!!!");
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
