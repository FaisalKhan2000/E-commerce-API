import User from "../models/AuthModel.js";
import Product from "../models/ProductModel.js";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId);

  const { name: firstName, lastName, email, role, image } = user;

  const newUser = { firstName, lastName, email, role, image };

  res.status(StatusCodes.OK).json({ user: newUser });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Product.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
  const newUser = { ...req.body };
  delete newUser.password;
  delete newUser.email;

  let imageLink = {};

  if (req.file) {
    // Assuming only one image is uploaded
    const file = req.file;
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: "users",
    });

    imageLink = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    // Set the new image link in the newUser object
    newUser.image = imageLink;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  res.status(StatusCodes.OK).json({ msg: "User updated" });
};
