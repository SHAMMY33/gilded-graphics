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

  function normOptions(options) {
    const o = options && typeof options === "object" ? options : {};
    // Only keep the fields we care about (and keep them as strings)
    return {
      size: (o.size ?? "").toString(),
      color: (o.color ?? "").toString(),
    };
  }

  // This makes "same sku but different size/color" become different cart lines
  function lineKey(sku, options) {
    const o = normOptions(options);
    return `${sku}__size:${o.size}__color:${o.color}`;
  }

  function add(sku, qty = 1, options = {}) {
    if (!sku) return;

    const addQty = normQty(qty);
    if (addQty <= 0) return;

    const items = read();
    const opts = normOptions(options);
    const key = lineKey(sku, opts);

    const found = items.find(i => i.key === key);
    if (found) {
      found.qty = normQty(found.qty) + addQty;
    } else {
      items.push({ key, sku, qty: addQty, options: opts });
    }

    write(items);
  }

  function remove(keyOrSku, options = null) {
    // Back-compat: if options provided, remove that specific line
    if (options) {
      const key = lineKey(keyOrSku, options);
      write(read().filter(i => i.key !== key));
      return;
    }
    // Otherwise treat first argument as key
    write(read().filter(i => i.key !== keyOrSku));
  }

  function setQty(key, qty) {
    const items = read();
    const item = items.find(i => i.key === key);
    if (!item) return;

    const n = normQty(qty);
    if (n <= 0) {
      remove(key);
      return;
    }

    item.qty = n;
    write(items);
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
