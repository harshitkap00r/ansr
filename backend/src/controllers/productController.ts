import { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  getAllCategories,
  getProductsByCategory,
  searchProducts,
  getFeaturedProducts,
} from "../services/productService";

export const fetchAllProducts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search;

    const products = typeof search === "string" && search.trim()
      ? await searchProducts(search.trim())
      : await getAllProducts();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const fetchProductById = async (req: Request, res: Response) => {
  try {
    const product = await getProductById(Number(req.params.id));
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const fetchCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

export const fetchProductsByCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const category = Array.isArray(req.params.category)
      ? req.params.category[0]
      : req.params.category;

    const products = await getProductsByCategory(category);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category products" });
  }
};

export const fetchFeaturedProducts = async (
  _req: Request,
  res: Response
) => {
  try {
    const products = await getFeaturedProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch featured products" });
  }
};