// assets/products.js
// Shared catalog so all pages can render cart with names/prices.

window.PRODUCTS = [
  {
    sku: "red_sea_surf_classic",
    name: "Red Sea Surf Classic",
    price: 35,
    priceId: "price_1SwDoyJwlrm4SccW27tvLMGy", // <-- STRIPE PRICE ID
    image: "assets/images/products/red_sea001.jpg",
    tag: "",
    desc: "DTF tee print • bold + clean",
    sizes: ["S","M","L","XL"],
    colors: ["Natural","White","Soft Pink"]
  },
  {
    sku: "no27_riders_reserve",
    name: "No. 27 - Rider's Reserve",
    price: 35,
    priceId: "price_1SwbFUJwlrm4SccWG8kHBrzh", // <-- STRIPE PRICE ID
    image: "assets/images/products/no27_001.jpg",
    tag: "Cowboy's Favorite Tee",
    desc: "Smoke'em if you gott'em",
    sizes: ["S","M","L","XL"],
    colors: ["Toast","White","Natural","Forest"]
  }
];
