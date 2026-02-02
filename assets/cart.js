const CART_KEY = "gg_cart_v1";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(sku, title, priceText, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.sku === sku);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ sku, title, priceText, qty });
  }
  setCart(cart);
  return cart;
}

export function updateQty(sku, qty) {
  const cart = getCart();
  const item = cart.find(i => i.sku === sku);
  if (!item) return cart;
  item.qty = Math.max(1, Math.min(99, parseInt(qty || 1, 10)));
  setCart(cart);
  return cart;
}

export function removeItem(sku) {
  const cart = getCart().filter(i => i.sku !== sku);
  setCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function cartCount() {
  return getCart().reduce((sum, i) => sum + (i.qty || 0), 0);
}
