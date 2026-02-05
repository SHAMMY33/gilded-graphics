/* assets/cart.js
   Shared cart storage + tiny UI helpers (works across all pages)
*/
(function () {
  const KEY = "gilded_cart_v1";

  // OPTIONAL: if you want to show a count badge on the bag icon
  const DEFAULT_BADGE_ID = "cartCount";

  // OPTIONAL: if you want the bag to switch empty/full automatically
  // Put an <img id="cartIcon"> in your header and this will swap it.
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

  function add(sku, qty = 1) {
    if (!sku) return;

    const addQty = normQty(qty);
    if (addQty <= 0) return;

    const items = read();
    const found = items.find(i => i.sku === sku);

    if (found) found.qty = normQty(found.qty) + addQty;
    else items.push({ sku, qty: addQty });

    write(items);
    notify();
  }

  function remove(sku) {
    write(read().filter(i => i.sku !== sku));
    notify();
  }

  function setQty(sku, qty) {
    const items = read();
    const item = items.find(i => i.sku === sku);
    if (!item) return;

    const n = normQty(qty);
    if (n <= 0) {
      write(items.filter(i => i.sku !== sku));
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

    // only swap if it's our bag icons (avoid breaking other images)
    const c = count();
    img.src = c > 0 ? ICON_FULL : ICON_EMPTY;
    img.alt = c > 0 ? "Cart (items)" : "Cart";
  }

  // Emit a lightweight event so any page can re-render drawer UI
  function notify() {
    try {
      syncBadge();
      syncIcon();
      window.dispatchEvent(new CustomEvent("gilded:cart-changed", { detail: { count: count() } }));
    } catch {
      // no-op
    }
  }

  // Keep multiple tabs in sync
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) notify();
  });

  // Expose globally
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

  // Initial sync on load
  notify();
})();
