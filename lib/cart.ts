import { CartItem } from "../types/cart";

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: CartItem) {
  const cart = getCart();
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
}

export function removeFromCart(id: number) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

export function increaseQuantity(id: number) {
  const cart = getCart();
  const product = cart.find((item) => item.id === id);

  if (product) {
    product.quantity += 1;
  }

  saveCart(cart);
}

export function decreaseQuantity(id: number) {
  const cart = getCart();
  const product = cart.find((item) => item.id === id);

  if (!product) return;

  if (product.quantity > 1) {
    product.quantity -= 1;
  } else {
    const filteredCart = cart.filter((item) => item.id !== id);
    saveCart(filteredCart);
    return;
  }

  saveCart(cart);
}