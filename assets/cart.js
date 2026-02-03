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
  }

  function remove(sku) {
    write(read().filter(i => i.sku !== sku));
  }

  function setQty(sku, qty) {
    const items = read();
    const item = items.find(i => i.sku === sku);
    if (!item) return;

    const n = normQty(qty);
    if (n <= 0) remove(sku);
    else {
      item.qty = n;
      write(items);
    }
  }

  function clear() {
    write([]);
  }

  function count() {
    return read().reduce((sum, i) => sum + (normQty(i.qty) || 0), 0);
  }

  function syncBadge(id = "cartCount") {
    const el = document.getElementById(id);
    if (el) el.textContent = String(count());
  }

  window.Cart = { read, add, remove, setQty, clear, count, syncBadge };
})();
