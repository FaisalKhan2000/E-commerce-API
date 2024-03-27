import User from "../models/AuthModel.js";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customError.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";

const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;

  req.body.role = isFirstAccount ? "admin" : "user";

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  const user = await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

const login = async (req, res) => {
  // find user
  const user = await User.findOne({ email: req.body.email });

  // validate and check password
  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) {
    throw new UnauthenticatedError("invalid credentials");
  }

  // create jwt token
  const token = createJWT({ userId: user._id, role: user.role });

  const oneDay = 24 * 60 * 60 * 1000;

  // setting cookie
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay), // expires in 1day
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "user logged in" });
};
const logout = async (req, res) => {
  // resetting cookie
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.CREATED).json({ msg: "user logged out" });
};

export { register, login, logout };
