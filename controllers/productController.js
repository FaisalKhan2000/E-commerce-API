import Product from "../models/ProductModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customError.js";
import cloudinary from "cloudinary";

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  const { search, category, brand, sort } = req.query;

  // query object
  const queryObject = {
    // createdBy: req.user.userId,
  };

  // search
  if (search) {
    queryObject.$or = [
      { title: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  // filter
  if (category) {
    queryObject.category = category;
  }
  if (brand) {
    queryObject.brand = brand;
  }

  // sort
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "title",
    "z-a": "-title",
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalProducts / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalProducts, numOfPages, currentPage: page, products });
};

// GET PRODUCT
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new NotFoundError(`No product with ID: ${req.params.id}`);
  res.status(StatusCodes.OK).json({ product });
};

// // ADD PRODUCT
// const addProduct = async (req, res) => {
//   let images = [];

//   if (typeof req.body.images === "string") {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   const imagesLinks = [];

//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: "products",
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }

//   req.body.images = imagesLinks;
//   req.body.createdBy = req.user.userId;
//   const product = await Product.create(req.body);

//   res.status(StatusCodes.CREATED).json({ product });
// };
const addProduct = async (req, res) => {
  let imagesLinks = [];

  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      // Process each uploaded file and extract necessary information
      const file = req.files[i];
      // Assuming you're using cloudinary for file upload
      const result = await cloudinary.v2.uploader.upload(file.path, {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  req.body.images = imagesLinks;
  req.body.createdBy = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

// UPDATE PRODUCT
const updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(StatusCodes.OK).json({ updatedProduct });
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  const deleteProduct = await Product.findByIdAndDelete(req.params.id);

  res
    .status(StatusCodes.OK)
    .json({ msg: "job deleted", product: deleteProduct });
};

export { getAllProducts, getProduct, addProduct, updateProduct, deleteProduct };
