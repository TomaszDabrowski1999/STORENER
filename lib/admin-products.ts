const ADMIN_PRODUCTS_KEY = "admin_products";

export function getAdminProducts() {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(ADMIN_PRODUCTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveAdminProducts(products: any[]) {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
}

export function addAdminProduct(product: any) {
  const products = getAdminProducts();
  products.push(product);
  saveAdminProducts(products);
}

export function getAdminProductById(id: number) {
  const products = getAdminProducts();
  return products.find((product: any) => product.id === id);
}

export function updateAdminProduct(updatedProduct: any) {
  const products = getAdminProducts();

  const updatedProducts = products.map((product: any) =>
    product.id === updatedProduct.id ? updatedProduct : product
  );

  saveAdminProducts(updatedProducts);
}

export function deleteAdminProduct(id: number) {
  const products = getAdminProducts();
  const updatedProducts = products.filter((product: any) => product.id !== id);
  saveAdminProducts(updatedProducts);
}