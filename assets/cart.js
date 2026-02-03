(function () {
  const KEY = "gilded_cart_v1";

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

  function add(sku, qty = 1) {
    if (!sku) return;

    const items = read();
    const found = items.find(i => i.sku === sku);

    if (found) {
      found.qty += qty;
    } else {
      items.push({ sku, qty });
    }

    write(items);
  }

  function remove(sku) {
    write(read().filter(i => i.sku !== sku));
  }

  function setQty(sku, qty) {
    const items = read();
    const item = items.find(i => i.sku === sku);
    if (!item) return;

    if (qty <= 0) remove(sku);
    else item.qty = qty;

    write(items);
  }

  function clear() {
    write([]);
  }

  function count() {
    return read().reduce((sum, i) => sum + i.qty, 0);
  }

  function syncBadge(id = "cartCount") {
    const el = document.getElementById(id);
    if (el) el.textContent = count();
  }

  // ✅ Expose globally
  window.Cart = {
    read,
    add,
    remove,
    setQty,
    clear,
    count,
    syncBadge
  };
})();
