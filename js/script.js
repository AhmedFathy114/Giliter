// Shared cart logic across pages
(function () {
  const CART_KEY = "cart";

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  let myName = document.getElementById('myName');
  if (myName) {
    let locSto = localStorage.getItem('name') || "";
    myName.innerText = locSto;
  }

  if(localStorage.getItem("isLoggedIn") !== "true"){
        window.location.replace("index.html");
        }
  window.logout = function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("name");
        window.location.replace("index.html");
  }

  let cart = readCart();

  function getItemQuantity(productId) {
    const item = cart.find((x) => x.id === productId);
    return item ? Number(item.quantity) || 0 : 0;
  }

  function getCount() {
    return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  function updateProductBadges() {
    document.querySelectorAll("[data-cart-product-id]").forEach((el) => {
      const raw = el.getAttribute("data-cart-product-id");
      const productId = raw == null ? null : Number(raw);
      if (!Number.isFinite(productId)) return;

      const qty = getItemQuantity(productId);
      el.textContent = String(qty);
      el.style.display = qty > 0 ? "inline-block" : "none";
    });
  }

  function emitCartUpdated() {
    document.dispatchEvent(
      new CustomEvent("cart-updated", { detail: { cart: [...cart] } }),
    );
  }

  function updateCartCount() {
    const count = getCount();

    const countById = document.getElementById("cart-count");
    if (countById) countById.innerText = String(count);

    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = String(count);
    });
  }

  function addToCart(product) {
    if (!product || product.id == null) return;

    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity = (existing.quantity || 0) + 1;
    else
      cart.push({
        id: product.id,
        title: product.title,
        price: Number(product.price) || 0,
        quantity: 1,
      });

    writeCart(cart);
    updateCartCount();
    updateProductBadges();
    renderCart();
    emitCartUpdated();
  }

  function removeFromCart(productId) {
    const item = cart.find((x) => x.id === productId);
    if (!item) return;

    const qty = Number(item.quantity) || 0;
    if (qty > 1) item.quantity = qty - 1;
    else cart = cart.filter((x) => x.id !== productId);

    writeCart(cart);
    updateCartCount();
    updateProductBadges();
    renderCart();
    emitCartUpdated();
  }

  function deleteFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);

  writeCart(cart);
  updateCartCount();
  updateProductBadges();
  renderCart();
  emitCartUpdated();
}

  function renderCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container || !totalEl) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      total += price * qty;

      const div = document.createElement("div");
      div.className = "border-bottom py-2";
      div.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div class="flex-grow-1">
            <strong>${item.title}</strong><br>
            <small>LE ${price} x ${qty}</small>
          </div>
          <div class="text-end">
            <button class="btn btn-sm btn-outline-dark cart-inc mb-1" type="button">+</button>
            <button class="btn btn-sm btn-outline-dark cart-dec mb-1" type="button">-</button>
            <button class="btn btn-sm btn-danger cart-remove" type="button">Remove</button>
          </div>
        </div>
      `;
      div
        .querySelector(".cart-inc")
        .addEventListener("click", () =>
          addToCart({ id: item.id, title: item.title, price: item.price }),
        );
      div
        .querySelector(".cart-dec")
        .addEventListener("click", () => removeFromCart(item.id));
      div
        .querySelector(".cart-remove")
        .addEventListener("click", () => deleteFromCart(item.id));
      container.appendChild(div);
    });

    totalEl.innerText = total.toFixed(2);
  }

  function openCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (!sidebar) return;
    sidebar.classList.add("open");
    renderCart();
  }

  function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (!sidebar) return;
    sidebar.classList.remove("open");
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    updateProductBadges();
    emitCartUpdated();

    const openBtn =
      document.getElementById("cartBtn") || document.getElementById("cart-icon");
    if (openBtn) openBtn.addEventListener("click", openCart);

    const closeBtn = document.getElementById("closeCart");
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
  });

  // Expose for inline page scripts
  window.addToCart = addToCart;
  window.updateCartCount = updateCartCount;
  window.getCartQuantity = getItemQuantity;
  window.updateProductBadges = updateProductBadges;
  function goToProduct(productId) {
  window.location.href = `product.html?id=${productId}`;
  }
  window.goToProduct = goToProduct;

  window.renderProductCard = function (product, index = 0) {
  const col = document.createElement("div");
  col.className = "col-6 col-md-4 col-lg-3";

  const discount = Math.round(product.discountPercentage);
  const originalPrice = (
    product.price / (1 - product.discountPercentage / 100)
  ).toFixed(2);

  col.innerHTML = `
    <div class="card product-card product-click p-2 h-100">
      <span class="badge-discount">-${discount}%</span>
      <img src="${product.thumbnail}" class="card-img-top"/>
      <div class="card-body">
        <h6>${product.title}</h6>
        <p class="text-danger">
          LE ${product.price.toFixed(2)}
          <span class="text-muted text-decoration-line-through ms-2">
            LE ${originalPrice}
          </span>
        </p>
        <button class="btn btn-dark btn-sm add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;


  col.querySelector(".product-click").addEventListener("click", () => {
    window.goToProduct(product.id);
  });


  col.querySelector(".add-to-cart").addEventListener("click", (e) => {
    e.stopPropagation();
    window.addToCart(product);
  });

  return col;
};
})();

