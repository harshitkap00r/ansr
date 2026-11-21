import { Router } from "express";
import {
  fetchAllProducts,
  fetchProductById,
  fetchCategories,
  fetchProductsByCategory,
  fetchFeaturedProducts,
} from "../controllers/productController";

const router = Router();

router.get("/", fetchAllProducts);
router.get("/categories", fetchCategories);
router.get("/featured", fetchFeaturedProducts);
router.get("/category/:category", fetchProductsByCategory);
router.get("/:id", fetchProductById);

export default router;