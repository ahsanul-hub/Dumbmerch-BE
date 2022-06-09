const express = require("express");

const router = express.Router();

const {
  register,
  login,
  checkAuth,
  getUsers,
} = require("../controllers/auth.js");
const {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");
const {
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const {
  addTransaction,
  addTransactionCart,
  getTransactions,
  deleteTransaction,
  notification,
} = require("../controllers/transaction");
const { getProfile, updateProfile } = require("../controllers/profile");
const {
  getCart,
  addCart,
  deleteCart,
  updateCart,
} = require("../controllers/cart");

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);
router.get("/check-auth", getUsers);

router.post("/product", auth, uploadFile("image"), addProduct);
router.get("/products", getAllProducts);
router.get("/product/:id", auth, getProduct);
router.patch("/product/:id", auth, uploadFile("image"), updateProduct);
router.delete("/product/:id", auth, deleteProduct);

router.post("/category", auth, addCategory);
router.get("/categories", getAllCategories);
router.get("/category/:id", auth, getCategory);
router.patch("/category/:id", updateCategory);
router.delete("/category/:id", auth, deleteCategory);

router.post("/transaction/:id", auth, addTransaction);
router.post("/transaction", auth, addTransactionCart);
router.get("/transactions", auth, getTransactions);
router.delete("/transaction/:id", auth, deleteTransaction);

router.post("/notification", notification);

router.get("/profile", auth, getProfile);
router.patch("/profile/:id", auth, uploadFile("image"), updateProfile);

router.post("/cart", auth, addCart);
router.get("/cart", auth, getCart);
router.patch("/cart/:id", auth, updateCart);
router.delete("/cart/:id", auth, deleteCart);

module.exports = router;
