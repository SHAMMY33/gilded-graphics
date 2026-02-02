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

(() => {
  const KEY = "gilded_cart_v1";

  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function add(sku, qty = 1) {
    if (!sku) return;

    const items = read();
    const found = items.find((i) => i.sku === sku);

    if (found) {
      found.qty = (found.qty || 0) + qty;
    } else {
      items.push({ sku, qty });
    }

    // Prevent weird negative/zero qty states
    const clean = items
      .map((i) => ({ sku: i.sku, qty: Math.max(1, Number(i.qty) || 1) }))
      .filter((i) => i.sku);

    write(clean);
  }

  function remove(sku) {
    const items = read().filter((i) => i.sku !== sku);
    write(items);
  }

  function setQty(sku, qty) {
    const items = read();
    const q = Math.max(0, Number(qty) || 0);
    const idx = items.findIndex((i) => i.sku === sku);

    if (idx === -1) return;

    if (q === 0) items.splice(idx, 1);
    else items[idx].qty = q;

    write(items);
  }

  function clear() {
    write([]);
  }

  function count() {
    return read().reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  }

  function syncBadge(badgeId = "cartCount") {
    const el = document.getElementById(badgeId);
    if (!el) return;
    el.textContent = String(count());
  }

  // Expose a tiny API for pages to use
  window.Cart = { read, add, remove, setQty, clear, count, syncBadge };
})();
