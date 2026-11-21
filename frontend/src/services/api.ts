import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
});

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export interface Enquiry {
  productId: number;
  productName: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/products");
  return data;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/products/featured");
  return data;
};

export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/products/categories");
  return data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data } = await api.get<Product[]>(`/products/category/${encodeURIComponent(category)}`);
  return data;
};

export const searchProducts = async (search: string): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/products", { params: { search } });
  return data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};

export const submitEnquiry = async (enquiry: Enquiry) => {
  const { data } = await api.post("/enquiries", enquiry);
  return data;
};