import { products as defaultProducts } from "../data/products";

export function getAllProducts() {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  const savedAdminProducts = localStorage.getItem("admin_products");
  const adminProducts = savedAdminProducts
    ? JSON.parse(savedAdminProducts)
    : [];

  return [...defaultProducts, ...adminProducts];
}