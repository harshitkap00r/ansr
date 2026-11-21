import axios from "axios";
import { FAKE_STORE_API_URL } from "../config/env";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${FAKE_STORE_API_URL}/products`);
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await axios.get(`${FAKE_STORE_API_URL}/products/${id}`);
  return response.data;
};

export const getAllCategories = async (): Promise<string[]> => {
  const response = await axios.get(`${FAKE_STORE_API_URL}/products/categories`);
  return response.data;
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const response = await axios.get(
    `${FAKE_STORE_API_URL}/products/category/${encodeURIComponent(category)}`
  );

  return response.data;
};

export const searchProducts = async (
  searchTerm: string
): Promise<Product[]> => {
  const products = await getAllProducts();
  const term = searchTerm.trim().toLowerCase();

  return products.filter((product) =>
    product.title.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  );
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await getAllProducts();

  return [...products]
    .sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 5);
};