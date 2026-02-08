// assets/products.js
// Shared catalog so all pages can render cart with names/prices.

window.PRODUCTS = [
  {
    sku: "red_sea_surf_classic",
    name: "Red Sea Surf Classic",
    price: 35,
    priceId: "price_1SwDoyJwlrm4SccW27tvLMGy", // <-- STRIPE PRICE ID
    image: "assets/images/products/red_sea001.jpg",
    hoverImage: "assets/images/products/red_sea004.jpg",
    tag: "",
    desc: "DTF tee print • bold + clean",
    sizes: ["S","M","L","XL"],
    colors: ["Natural","White","Soft Pink"],
    url: "red_sea_surf_classic.html"
  },
  {
    sku: "no27_riders_reserve",
    name: "No. 27 - Rider's Reserve",
    price: 35,
    priceId: "price_1SwbFUJwlrm4SccWG8kHBrzh", // <-- STRIPE PRICE ID
    image: "assets/images/products/no27_001.jpg",
    hoverImage: "assets/images/products/no27_005.jpg",
    tag: "Cowboy's Favorite Tee",
    desc: "Smoke'em if you gott'em",
    sizes: ["S","M","L","XL"],
    colors: ["Toast","White","Natural","Forest"],
    url: "no27.html"
  },
  {
    sku: "f150",
    name: "F**K F150",
    price: 30,
    priceId: "price_1SyR5sJwlrm4SccW4XlAL5j1", // <-- STRIPE PRICE ID
    image: "assets/images/products/f150_002.jpg",
    hoverImage: "assets/images/products/f150_001.jpg",
    tag: "",
    desc: "It's a joke, but yes we sell those.",
    sizes: ["S","M","L","XL"],
    colors: ["White","Black"],
    url: "f150.html"
  }
];
