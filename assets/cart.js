/* assets/cart.js
   Shared cart storage + tiny UI helpers (works across all pages)
*/
(function () {
  const KEY = "gilded_cart_v1";

  const DEFAULT_BADGE_ID = "cartCount";
  const DEFAULT_ICON_ID = "cartIcon";
  const ICON_EMPTY = "assets/images/shopping-bag-empty.png";
  const ICON_FULL  = "assets/images/shopping-bag-full.png";

  function read() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function write(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function normQty(qty) {
    const n = Number(qty);
    if (!Number.isFinite(n)) return 0;
    return Math.floor(n);
  }

  // Variants -> unique line item key
  function makeKey(sku, meta) {
    const size = meta?.size ? String(meta.size) : "";
    const color = meta?.color ? String(meta.color) : "";
    return `${sku}__size:${size}__color:${color}`;
  }

  // Backwards compatible:
  // add(sku, qty)
  // add(sku, qty, {size,color})
  function add(sku, qty = 1, meta = {}) {
    if (!sku) return;

    const addQty = normQty(qty);
    if (addQty <= 0) return;

    const items = read();

    const safeMeta = {
      size: meta?.size ? String(meta.size) : "",
      color: meta?.color ? String(meta.color) : ""
    };

    const key = makeKey(sku, safeMeta);

    // If old items exist without key/meta, upgrade happens naturally on next write
    const found = items.find(i => (i.key && i.key === key) || (!i.key && i.sku === sku && !safeMeta.size && !safeMeta.color));

    if (found) {
      found.qty = normQty(found.qty) + addQty;
      found.sku = sku;
      found.key = found.key || key;
      found.meta = found.meta || safeMeta;
    } else {
      items.push({ key, sku, qty: addQty, meta: safeMeta });
    }

    write(items);
    notify();
  }

  // remove by key OR sku
  function remove(id) {
    write(read().filter(i => i.key !== id && i.sku !== id));
    notify();
  }

  // setQty by key OR sku
  function setQty(id, qty) {
    const items = read();
    const item = items.find(i => i.key === id || i.sku === id);
    if (!item) return;

    const n = normQty(qty);
    if (n <= 0) {
      write(items.filter(i => i !== item));
    } else {
      item.qty = n;
      write(items);
    }
    notify();
  }

  function clear() {
    write([]);
    notify();
  }

  function count() {
    return read().reduce((sum, i) => sum + (normQty(i.qty) || 0), 0);
  }

  // --- UI helpers (safe if elements don't exist)

  function syncBadge(id = DEFAULT_BADGE_ID) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(count());
  }

  function syncIcon(id = DEFAULT_ICON_ID) {
    const img = document.getElementById(id);
    if (!img) return;

    const c = count();
    img.src = c > 0 ? ICON_FULL : ICON_EMPTY;
    img.alt = c > 0 ? "Cart (items)" : "Cart";
  }

  function notify() {
    try {
      syncBadge();
      syncIcon();
      window.dispatchEvent(new CustomEvent("gilded:cart-changed", { detail: { count: count() } }));
    } catch {
      // no-op
    }
  }

  window.addEventListener("storage", (e) => {
    if (e.key === KEY) notify();
  });

  window.Cart = {
    read,
    add,
    remove,
    setQty,
    clear,
    count,
    syncBadge,
    syncIcon,
    notify
  };

  notify();
})();
