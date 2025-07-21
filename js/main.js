// =================================================================
// --- 1. UTILITY FUNCTIONS (Defined outside the main listener) ---
// =================================================================
// These functions are self-contained and do not need access to the global 'state' object.

/**
 * Initializes the mobile hamburger menu toggle functionality.
 */
function initializeMobileMenu() {
  const hamburgerToggle = document.getElementById("hamburger-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (
    hamburgerToggle &&
    mobileMenu &&
    !hamburgerToggle.dataset.listenerAttached
  ) {
    hamburgerToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("is-active");
    });
    hamburgerToggle.dataset.listenerAttached = "true";
  }
}

/**
 * Initializes the product detail page (PDP) image gallery.
 */
function initializePDPGallery() {
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(
    ".gallery-thumbnails .thumbnail"
  );

  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach((thumb) => {
      if (!thumb.dataset.listenerAttached) {
        thumb.addEventListener("click", function () {
          mainImage.src = this.src;
          thumbnails.forEach((t) => t.classList.remove("active"));
          this.classList.add("active");
        });
        thumb.dataset.listenerAttached = "true";
      }
    });
  }
}

// =================================================================
// --- 2. MAIN APPLICATION LOGIC ---
// =================================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("ElectroHub Main JavaScript Initialized (Final SPA Mode).");

  // --- 2.1. GLOBAL STATE & ROUTE DEFINITIONS ---
  const state = {
    cart: JSON.parse(localStorage.getItem("electroHubCart")) || [],
    currentUser: JSON.parse(localStorage.getItem("electroHubUser")) || null,
    shippingCost: 15.0,
    taxRate: 0.075,
  };

  const routes = {
    "/": "home.html",
    "/departments": "departments.html",
    "/lighting": "lighting.html",
    "/product": "product-detail.html",
    "/cart": "cart.html",
    "/checkout": "checkout.html",
    "/login": "login.html",
    "/register": "register.html",
    "/account": "account.html",
    "/contact": "contact.html",
    "/about": "about.html",
  };

  const mainContentContainer = document.getElementById("main-content");
  const cartIcon = document.querySelector('a[href="#/cart"].header-icon');

  // --- 2.2. STATE MANAGEMENT & UI UPDATES ---
  function saveUserToLocalStorage() {
    if (state.currentUser) {
      localStorage.setItem("electroHubUser", JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem("electroHubUser");
    }
  }

  function updateUserHeader() {
    const accountLink = document.querySelector('a[href="#/login"].header-icon');
    const headerActions = document.querySelector(".header-actions");

    const existingLogoutBtn = document.getElementById("header-logout-btn");
    if (existingLogoutBtn) existingLogoutBtn.remove();

    if (state.currentUser) {
      if (accountLink) accountLink.href = "#/account";

      const logoutButton = document.createElement("a");
      logoutButton.id = "header-logout-btn";
      logoutButton.className = "btn btn-secondary";
      logoutButton.textContent = "Logout";
      logoutButton.href = "#/logout";
      headerActions.appendChild(logoutButton);
    } else {
      if (accountLink) accountLink.href = "#/login";
    }
  }

  function saveCartToLocalStorage() {
    localStorage.setItem("electroHubCart", JSON.stringify(state.cart));
  }

  function updateCartIcon() {
    const cartItemCount = state.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    const cartCountBubble = cartIcon.querySelector(".cart-count-bubble");

    if (cartItemCount > 0) {
      if (cartCountBubble) {
        cartCountBubble.textContent = cartItemCount;
      } else {
        const bubble = document.createElement("span");
        bubble.classList.add("cart-count-bubble");
        bubble.textContent = cartItemCount;
        cartIcon.appendChild(bubble);
      }
    } else {
      if (cartCountBubble) {
        cartIcon.removeChild(cartCountBubble);
      }
    }
  }

  function addToCart(productId, productName, price) {
    const existingItem = state.cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cart.push({
        id: productId,
        name: productName,
        price: price,
        quantity: 1,
      });
    }

    console.log("Cart Updated:", state.cart);
    saveCartToLocalStorage();
    updateCartIcon();
  }

  // --- 2.3. PAGE-SPECIFIC RENDERING FUNCTIONS ---
  function renderCartPage() {
    requestAnimationFrame(() => {
      const itemsContainer = document.getElementById("cart-items-container");
      const cartLayout = document.querySelector(".cart-layout");
      const emptyCartContainer = document.getElementById(
        "empty-cart-container"
      );

      if (!itemsContainer || !cartLayout || !emptyCartContainer) return;

      itemsContainer.innerHTML = "";

      if (state.cart.length === 0) {
        cartLayout.style.display = "none";
        emptyCartContainer.style.display = "block";
      } else {
        cartLayout.style.display = "grid";
        emptyCartContainer.style.display = "none";

        let subtotal = 0;
        state.cart.forEach((item) => {
          const itemEl = document.createElement("div");
          itemEl.classList.add("cart-item");
          itemEl.innerHTML = `
                        <img src="https://placehold.co/100x100/1F2937/34D399?text=${
                          item.name.split(" ")[0]
                        }" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h2 class="cart-item-title">${item.name}</h2>
                            <p class="cart-item-model">Model: ${item.id.toFixed(
                              4
                            )}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-id="${
                              item.id
                            }" data-action="decrease" aria-label="Decrease quantity">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" data-id="${
                              item.id
                            }" data-action="increase" aria-label="Increase quantity">+</button>
                        </div>
                        <p class="cart-item-price">$${(
                          item.price * item.quantity
                        ).toFixed(2)}</p>
                    `;
          itemsContainer.appendChild(itemEl);
          subtotal += item.price * item.quantity;
        });

        const shipping = subtotal > 0 ? state.shippingCost : 0;
        const tax = (subtotal + shipping) * state.taxRate;
        const total = subtotal + shipping + tax;

        document.getElementById(
          "summary-subtotal"
        ).textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById(
          "summary-shipping"
        ).textContent = `$${shipping.toFixed(2)}`;
        document.getElementById("summary-tax").textContent = `$${tax.toFixed(
          2
        )}`;
        document.getElementById(
          "summary-total"
        ).textContent = `$${total.toFixed(2)}`;
      }
    });
  }

  function renderCheckoutPage() {
    requestAnimationFrame(() => {
      const itemsContainer = document.getElementById("review-items-container");
      if (!itemsContainer) return;

      itemsContainer.innerHTML = "";
      let subtotal = 0;

      if (state.cart.length > 0) {
        state.cart.forEach((item) => {
          const itemEl = document.createElement("div");
          itemEl.classList.add("review-item");
          itemEl.innerHTML = `
                        <img src="https://placehold.co/64x64/1F2937/34D399?text=${
                          item.name.split(" ")[0]
                        }" alt="${item.name}" class="review-item-image">
                        <div class="review-item-details">
                            <span class="review-item-name">${item.name} (x${
            item.quantity
          })</span>
                        </div>
                        <span class="review-item-price">$${(
                          item.price * item.quantity
                        ).toFixed(2)}</span>
                    `;
          itemsContainer.appendChild(itemEl);
          subtotal += item.price * item.quantity;
        });

        const shipping = subtotal > 0 ? state.shippingCost : 0;
        const tax = (subtotal + shipping) * state.taxRate;
        const total = subtotal + shipping + tax;

        document.getElementById(
          "review-subtotal"
        ).textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById(
          "review-shipping"
        ).textContent = `$${shipping.toFixed(2)}`;
        document.getElementById("review-tax").textContent = `$${tax.toFixed(
          2
        )}`;
        document.getElementById("review-total").textContent = `$${total.toFixed(
          2
        )}`;
      } else {
        itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      }
    });
  }

  function renderAccountPage() {
    requestAnimationFrame(() => {
      if (state.currentUser) {
        const nameEl = document.querySelector('.info-value[data-key="name"]');
        const emailEl = document.querySelector('.info-value[data-key="email"]');
        if (nameEl) nameEl.textContent = state.currentUser.name;
        if (emailEl) emailEl.textContent = state.currentUser.email;
      }
    });
  }

  // --- 2.4. PAGE INITIALIZATION FUNCTIONS (Called after new content is loaded) ---
  function initializePageScripts(path) {
    requestAnimationFrame(() => {
      if (path === "/product") {
        initializePDPGallery();
      } else if (path === "/cart") {
        renderCartPage();
      } else if (path === "/checkout") {
        renderCheckoutPage();
      } else if (path === "/account") {
        renderAccountPage();
      }
    });
  }

  // --- 2.5. ROUTER LOGIC ---
  async function handleRouteChange() {
    const path = location.hash.slice(1) || "/";

    if (path.startsWith("/account") && !state.currentUser) {
      location.hash = "/login";
      return;
    }

    if (path === "/logout") {
      state.currentUser = null;
      saveUserToLocalStorage();
      updateUserHeader();
      location.hash = "/";
      return;
    }

    const contentFile = routes[path];

    mainContentContainer.innerHTML =
      '<p style="text-align: center; padding: 4rem;">Loading...</p>';

    if (!contentFile) {
      mainContentContainer.innerHTML =
        '<div class="container"><h1 class="page-main-title">404 - Not Found</h1></div>';
      return;
    }

    try {
      const response = await fetch(contentFile);
      if (!response.ok) throw new Error("Page not found");

      const html = await response.text();
      mainContentContainer.innerHTML = html;

      initializePageScripts(path);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error loading page:", error);
      mainContentContainer.innerHTML =
        '<div class="container"><h1 class="page-main-title">Error loading page.</h1></div>';
    }
  }

  // --- 2.6. FORM VALIDATION ---
  function validateForm(form) {
    let isValid = true;
    const errors = [];
    form
      .querySelectorAll(".form-input-error")
      .forEach((el) => el.classList.remove("form-input-error"));
    const errorMessageContainer = form.querySelector(".form-error-message");
    if (errorMessageContainer) {
      errorMessageContainer.style.display = "none";
      errorMessageContainer.textContent = "";
    }

    const requiredFields = form.querySelectorAll("[required]");
    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add("form-input-error");
        errors.push(`${field.previousElementSibling.textContent} is required.`);
      }
    });

    const password = form.querySelector("#register-password");
    const confirmPassword = form.querySelector("#register-confirm-password");
    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      isValid = false;
      confirmPassword.classList.add("form-input-error");
      errors.push("Passwords do not match.");
    }

    if (!isValid && errorMessageContainer) {
      errorMessageContainer.textContent = errors[0];
      errorMessageContainer.style.display = "block";
    }
    return isValid;
  }

  // --- 2.7. GLOBAL EVENT LISTENERS ---
  window.addEventListener("hashchange", handleRouteChange);

  // This listener delegates actions for the main content area
  mainContentContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Add to cart buttons
    if (target.closest(".add-to-cart-btn, .add-to-cart-pdp-btn")) {
      event.preventDefault();
      addToCart(Math.random(), "Sample Product", 10.99);
      target.closest("button").textContent = "Added!";
      setTimeout(() => {
        target.closest("button").innerHTML = "Add to Cart";
      }, 1500);
    }

    // Cart quantity buttons
    if (target.matches(".quantity-btn")) {
      const productId = parseFloat(target.dataset.id);
      const action = target.dataset.action;
      const itemInCart = state.cart.find((item) => item.id === productId);

      if (itemInCart) {
        if (action === "increase") {
          itemInCart.quantity++;
        } else if (action === "decrease") {
          itemInCart.quantity--;
          if (itemInCart.quantity <= 0) {
            state.cart = state.cart.filter((item) => item.id !== productId);
          }
        }
        saveCartToLocalStorage();
        updateCartIcon();
        renderCartPage();
      }
    }
  });

  // This listener handles form submissions for login and registration
  mainContentContainer.addEventListener("submit", (event) => {
    event.preventDefault();

    // Login Form
    if (event.target.matches('.auth-form[action="#/login"]')) {
      if (validateForm(event.target)) {
        const email = event.target.querySelector("#login-email").value;
        state.currentUser = {
          name: "Test User",
          email: email,
        };
        saveUserToLocalStorage();
        updateUserHeader();
        location.hash = "#/account";
      }
    }

    // Registration Form
    if (event.target.matches('.auth-form[action="#/register"]')) {
      if (validateForm(event.target)) {
        const name = event.target.querySelector("#register-name").value;
        const email = event.target.querySelector("#register-email").value;
        state.currentUser = {
          name: name,
          email: email,
        };
        saveUserToLocalStorage();
        updateUserHeader();
        location.hash = "#/account";
      }
    }
  });

  // --- 2.8. INITIAL APPLICATION STARTUP ---
  initializeMobileMenu();
  updateCartIcon();
  updateUserHeader();
  handleRouteChange();
});
