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
  const header = document.querySelector(".site-header"); // Add this line

  if (
    hamburgerToggle &&
    mobileMenu &&
    !hamburgerToggle.dataset.listenerAttached
  ) {
    hamburgerToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("is-active");
      header.classList.toggle("mobile-menu-open"); // Add this line
      const isExpanded = mobileMenu.classList.contains("is-active");
      hamburgerToggle.setAttribute("aria-expanded", isExpanded);
    });
    hamburgerToggle.dataset.listenerAttached = "true";
  }
}

// ... (after initializeMobileMenu)
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const header = document.querySelector(".site-header"); // Add this line
  const hamburgerToggle = document.getElementById("hamburger-menu-toggle");
  if (mobileMenu && mobileMenu.classList.contains("is-active")) {
    mobileMenu.classList.remove("is-active");
    header.classList.remove("mobile-menu-open"); // Add this line
    if (hamburgerToggle) {
      hamburgerToggle.setAttribute("aria-expanded", "false");
    }
  }
}

// ... (after closeMobileMenu)
function updateActiveNavLinks(path) {
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
  mobileNavLinks.forEach((link) => {
    link.classList.remove("active");
    // Check if the link's href matches the current path
    if (link.getAttribute("href") === `#${path}`) {
      link.classList.add("active");
    }
  });
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
    wishlist: JSON.parse(localStorage.getItem("electroHubWishlist")) || [],
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
    "/wires": "wires.html",
    "/switches": "switches.html",
    "/tools": "tools.html",
    "/accessories": "accessories.html",
    "/gadgets": "gadgets.html",
    "/devices": "devices.html",
    "/wishlist": "wishlist.html",
    "/services": "services.html",
    "/service-project-management": "service-project-management.html",
    "/service-consultants": "service-consultants.html",
    "/service-general-works": "service-general-works.html",
    "/service-cctv-installation": "service-cctv-installation.html",
    "/service-solar-panel-installation":
      "service-solar-panel-installation.html",
    "/service-solar-system-design": "service-solar-system-design.html",
  };

  // CORRECTED: Simulated product database with image placeholders restored
  const products = {
    lighting: [
      {
        id: "lt001",
        name: "Modern LED Chandelier",
        price: 199.99,
        subcategory: "Chandeliers",
        brand: "Lumina",
        type: "LED",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Chandelier",
      },
      {
        id: "lt002",
        name: "Vintage Edison Bulb",
        price: 12.99,
        subcategory: "Bulbs",
        brand: "Volt-Tech",
        type: "Incandescent",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Edison+Bulb",
      },
      {
        id: "lt003",
        name: "Recessed Downlight",
        price: 29.5,
        subcategory: "Indoor Lighting",
        brand: "ElectroGlow",
        type: "LED",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Downlight",
      },
      {
        id: "lt004",
        name: "Outdoor Wall Sconce",
        price: 79.0,
        subcategory: "Outdoor Lighting",
        brand: "Lumina",
        type: "LED",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Sconce",
      },
      {
        id: "lt005",
        name: "Smart RGB Bulb",
        price: 24.99,
        subcategory: "Bulbs",
        brand: "ElectroGlow",
        type: "Smart",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Smart+Bulb",
      },
      {
        id: "lt006",
        name: "Classic Pendant Light",
        price: 129.0,
        subcategory: "Chandeliers",
        brand: "Volt-Tech",
        type: "Incandescent",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Pendant",
      },
    ],

    wires: [
      {
        id: "wr001",
        name: "14-Gauge THHN Wire",
        price: 75.99,
        subcategory: "Building Wire",
        brand: "CableCo",
        type: "Copper",
        image: "https://placehold.co/400x400/1F2937/34D399?text=THHN+Wire",
      },
      {
        id: "wr002",
        name: "Coaxial Cable RG6",
        price: 45.5,
        subcategory: "Data Cable",
        brand: "ConnectX",
        type: "Coaxial",
        image: "https://placehold.co/400x400/1F2937/34D399?text=RG6+Cable",
      },
      {
        id: "wr001",
        name: "14-Gauge THHN Wire",
        price: 75.99,
        subcategory: "Building Wire",
        brand: "CableCo",
        type: "Copper",
        image: "https://placehold.co/400x400/1F2937/34D399?text=THHN+Wire",
      },
      {
        id: "wr002",
        name: "Coaxial Cable RG6",
        price: 45.5,
        subcategory: "Data Cable",
        brand: "ConnectX",
        type: "Coaxial",
        image: "https://placehold.co/400x400/1F2937/34D399?text=RG6+Cable",
      },
      {
        id: "wr003",
        name: "12-Gauge Romex Wire",
        price: 120.0,
        subcategory: "Building Wire",
        brand: "CableCo",
        type: "Copper",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Romex",
      },
      {
        id: "wr004",
        name: "Cat 6 Ethernet Cable",
        price: 55.0,
        subcategory: "Data Cable",
        brand: "ConnectX",
        type: "Ethernet",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Cat+6",
      },
    ],

    switches: [
      {
        id: "sw001",
        name: "Smart Wi-Fi Light Switch",
        price: 34.99,
        subcategory: "Smart Switches",
        brand: "ConnectX",
        type: "Smart",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Smart+Switch",
      },
      {
        id: "sw002",
        name: "GFCI Outlet Socket",
        price: 19.99,
        subcategory: "Standard Sockets",
        brand: "Volt-Tech",
        type: "GFCI",
        image: "https://placehold.co/400x400/1F2937/34D399?text=GFCI+Socket",
      },
      {
        id: "sw003",
        name: "Rotary Dimmer Switch",
        price: 22.5,
        subcategory: "Dimmers",
        brand: "Lumina",
        type: "Dimmer",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Dimmer",
      },
      {
        id: "sw004",
        name: "Decora Wall Plate",
        price: 8.99,
        subcategory: "Standard Sockets",
        brand: "Volt-Tech",
        type: "Accessory",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Wall+Plate",
      },
      {
        id: "sw005",
        name: "Voice-Activated Dimmer",
        price: 49.99,
        subcategory: "Dimmers",
        brand: "ConnectX",
        type: "Smart",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Smart+Dimmer",
      },
    ],

    tools: [
      {
        id: "tl001",
        name: "Digital Multimeter",
        price: 59.99,
        subcategory: "Testers",
        brand: "Volt-Tech",
        type: "Diagnostic",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Multimeter",
      },
      {
        id: "tl002",
        name: "Insulated Screwdriver Set",
        price: 45.0,
        subcategory: "Hand Tools",
        brand: "DuraGrip",
        type: "Insulated",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Screwdrivers",
      },
      {
        id: "tl003",
        name: "Cordless Impact Drill",
        price: 189.99,
        subcategory: "Power Tools",
        brand: "MegaVolt",
        type: "Cordless",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Drill",
      },
      {
        id: "tl004",
        name: "Wire Stripper & Cutter",
        price: 24.5,
        subcategory: "Hand Tools",
        brand: "DuraGrip",
        type: "Manual",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Stripper",
      },
      {
        id: "tl005",
        name: "Circuit Breaker Finder",
        price: 39.99,
        subcategory: "Testers",
        brand: "Volt-Tech",
        type: "Diagnostic",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Breaker+Finder",
      },
    ],

    accessories: [
      {
        id: "ac001",
        name: "Junction Box",
        price: 9.99,
        subcategory: "Enclosures",
        brand: "Volt-Tech",
        type: "PVC",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Junction+Box",
      },
      {
        id: "ac002",
        name: "Wago Connectors (100-pack)",
        price: 29.99,
        subcategory: "Connectors",
        brand: "ConnectX",
        type: "Lever-nut",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Connectors",
      },
    ],

    gadgets: [
      {
        id: "gd001",
        name: "USB Wall Outlet Charger",
        price: 18.5,
        subcategory: "Chargers",
        brand: "MegaVolt",
        type: "USB-C",
        image: "https://placehold.co/400x400/1F2937/34D399?text=USB+Charger",
      },
      {
        id: "gd002",
        name: "Smart Power Monitoring Plug",
        price: 25.0,
        subcategory: "Smart Plugs",
        brand: "ConnectX",
        type: "Wi-Fi",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Smart+Plug",
      },
      {
        id: "gd003",
        name: "Wireless Charging Pad",
        price: 14.99,
        subcategory: "Chargers",
        brand: "MegaVolt",
        type: "Wireless",
        image:
          "https://placehold.co/400x400/1F2937/34D399?text=Wireless+Charger",
      },
    ],

    devices: [
      {
        id: "dv001",
        name: "Video Doorbell",
        price: 179.0,
        subcategory: "Security",
        brand: "ConnectX",
        type: "Smart",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Doorbell",
      },
      {
        id: "dv002",
        name: "Smart Thermostat",
        price: 249.0,
        subcategory: "Home Automation",
        brand: "ElectroGlow",
        type: "Smart",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Thermostat",
      },
      {
        id: "dv003",
        name: "Smart Smoke Detector",
        price: 59.99,
        subcategory: "Safety",
        brand: "Volt-Tech",
        type: "Smart",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Smoke+Detector",
      },
      {
        id: "dv004",
        name: "Smart Home Hub",
        price: 99.99,
        subcategory: "Home Automation",
        brand: "ConnectX",
        type: "Hub",
        image: "https://placehold.co/400x400/1F2937/34D399?text=Home+Hub",
      },
    ],
    // ... add similar, complete data for switches, tools, etc.
  };

  const mainContentContainer = document.getElementById("main-content");
  const cartIcon = document.querySelector('a[href="#/cart"].header-icon');
  const wishlistIcon = document.querySelector(
    'a[href="#/wishlist"].header-icon'
  );
  const quickViewModalOverlay = document.getElementById('quick-view-modal-overlay');
  const quickViewModalContent = document.getElementById('quick-view-modal-content');
  const addToCartModalOverlay = document.getElementById('add-to-cart-modal-overlay');
  const addToCartModalContent = document.getElementById('add-to-cart-modal-content');
  const newsletterModalOverlay = document.getElementById('newsletter-modal-overlay');
  const quoteModalOverlay = document.getElementById('quote-modal-overlay');
  const consultationModalOverlay = document.getElementById('consultation-modal-overlay');
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

  function addToCart(product) {
    const existingItem = state.cart.find((item) => item.id === product.id);

    // FIX: Clean the price string and convert it to a number
    const numericPrice = parseFloat(product.price.replace("$", ""));

    const productToAdd = {
      ...product,
      price: numericPrice, // Store the price as a number
      quantity: 1,
    };

    if (existingItem) {
      existingItem.quantity++;
    } else {
      state.cart.push(productToAdd);
    }
    saveCartToLocalStorage();
    updateCartIcon();
    showAddToCartConfirmation(product);
  }

  // Wishlist functions
  function saveWishlistToLocalStorage() {
    localStorage.setItem("electroHubWishlist", JSON.stringify(state.wishlist));
  }

  function updateWishlistIcon() {
    if (!wishlistIcon) return;
    const wishlistItemCount = state.wishlist.length;
    let bubble = wishlistIcon.querySelector(".wishlist-count-bubble");

    if (wishlistItemCount > 0) {
      if (!bubble) {
        bubble = document.createElement("span");
        // Use the same class as the cart bubble but add a modifier
        bubble.className = "cart-count-bubble wishlist-count-bubble";
        wishlistIcon.appendChild(bubble);
      }
      bubble.textContent = wishlistItemCount;
    } else if (bubble) {
      bubble.remove();
    }
  }

  function addToWishlist(product) {
    // Prevent duplicates
    if (!state.wishlist.some((item) => item.id === product.id)) {
      state.wishlist.push(product);
      saveWishlistToLocalStorage();
      updateWishlistIcon();
    }
  }

  // --- MODAL LOGIC ---
  /**
   * Opens a specific modal.
   * @param {HTMLElement} modal The modal overlay element to open.
   */
  function openModal(modal) {
    if (modal) {
      modal.style.display = "flex";
      setTimeout(() => {
        modal.classList.add("is-visible");
      }, 10);
    }
  }

  /**
   * Closes a specific modal.
   * @param {HTMLElement} modal The modal overlay element to close.
   */
  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("is-visible");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
    }
  }

  /**
   * Shows the add to cart confirmation modal with product details.
   * @param {object} product The product object with details.
   */
  function showAddToCartConfirmation(product) {
    if (addToCartModalContent) {
      addToCartModalContent.innerHTML = `
          <div class="confirmation-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <span>Successfully added to cart!</span>
          </div>
          <div class="confirmation-product">
              <img src="${product.image}" alt="${product.name}" class="confirmation-product-image">
              <div class="confirmation-product-details">
                  <span class="confirmation-product-name">${product.name}</span>
                  <span class="confirmation-product-price">${product.price}</span>
              </div>
          </div>
          <div class="confirmation-actions">
              <a href="#/cart" class="btn btn-primary">View Cart</a>
              <button class="btn btn-secondary continue-shopping-btn">Continue Shopping</button>
          </div>
        `;
      openModal(addToCartModalOverlay);
    }
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
          const nameForImage = item.name ? item.name.split(" ")[0] : "Item";
          itemEl.innerHTML = `
                    <img src="https://placehold.co/100x100/1F2937/34D399?text=${nameForImage}" alt="${
            item.name || "Unknown Item"
          }" class="cart-item-image">
                    <div class="cart-item-details">
                        <h2 class="cart-item-title">${
                          item.name || "Unknown Item"
                        }</h2>
                        <p class="cart-item-model">Model: ${item.id}</p>
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
          // FIX: Use parseFloat to ensure item.price is a number before calculation
          subtotal += parseFloat(item.price) * item.quantity;
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

  // ADD this new function:
  function renderWishlistPage() {
    const gridContainer = document.getElementById("wishlist-grid-container");
    const emptyContainer = document.getElementById("empty-wishlist-container");
    if (!gridContainer || !emptyContainer) return;

    if (state.wishlist.length === 0) {
      gridContainer.style.display = "none";
      emptyContainer.style.display = "block";
    } else {
      gridContainer.style.display = "grid";
      emptyContainer.style.display = "none";
      gridContainer.innerHTML = state.wishlist
        .map(
          (product) => `
            <div class="d-product-card">
                <div class="d-product-image-wrapper"><img src="${
                  product.image
                }" alt="${product.name}"></div>
                <div class="d-product-content">
                    <h3 class="d-product-title"><a href="#/product?id=${
                      product.id
                    }">${product.name}</a></h3>
                    <p class="d-product-description">${product.subcategory}</p>
                    <p class="d-product-price">$${product.price.toFixed(2)}</p>
                </div>
                <div class="d-product-actions">
                     <button class="btn btn-secondary add-wishlist-to-cart-btn" data-product-id="${
                       product.id
                     }">Move to Cart</button>
                     <button class="btn btn-primary remove-from-wishlist-btn" data-product-id="${
                       product.id
                     }">Remove</button>
                </div>
            </div>
        `
        )
        .join("");
    }
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

  // FINAL, CORRECTED version of the department page renderer
  function renderDepartmentPage(departmentKey) {
    const fullProductList = products[departmentKey] || [];
    let activeFilters = {
      subcategory: "All",
      brand: "All",
      type: "All",
    };

    // Correctly get the new container for the DYNAMIC parts of the form
    const filterGroupsContainer = document.getElementById(
      "dynamic-filter-groups-container"
    );
    const subcategoryNavContainer = document.getElementById(
      "subcategory-nav-container"
    );
    const productGridContainer = document.getElementById(
      "product-grid-container"
    );

    if (
      !filterGroupsContainer ||
      !subcategoryNavContainer ||
      !productGridContainer
    )
      return;

    // The main rendering function
    function render() {
      // 1. Filter products based on the current state
      let filteredProducts = fullProductList;
      if (activeFilters.subcategory !== "All") {
        filteredProducts = filteredProducts.filter(
          (p) => p.subcategory === activeFilters.subcategory
        );
      }
      if (activeFilters.brand !== "All") {
        filteredProducts = filteredProducts.filter(
          (p) => p.brand === activeFilters.brand
        );
      }
      if (activeFilters.type !== "All") {
        filteredProducts = filteredProducts.filter(
          (p) => p.type === activeFilters.type
        );
      }

      // 2. Re-render the UI components
      renderSubcategoryNav(fullProductList); // Render nav based on full list
      renderSidebar(filteredProducts); // Render sidebar based on FILTERED list
      renderProductGrid(filteredProducts); // Render grid based on FILTERED list
    }

    // Function to render the subcategory nav
    function renderSubcategoryNav(productsForNav) {
      const subcategories = [
        "All",
        ...new Set(productsForNav.map((p) => p.subcategory)),
      ];
      subcategoryNavContainer.innerHTML = subcategories
        .map(
          (sub) =>
            // FIX: The 'active' class is now correctly applied based on the activeFilters state
            `<a href="#" class="subcategory-link ${
              activeFilters.subcategory === sub ? "active" : ""
            }" data-subcategory="${sub}">${sub}</a>`
        )
        .join("");
    }

    // Function to render just the dynamic parts of the sidebar
    function renderSidebar(currentlyVisibleProducts) {
      const availableBrands = [
        "All",
        ...new Set(currentlyVisibleProducts.map((p) => p.brand)),
      ];
      const availableTypes = [
        "All",
        ...new Set(currentlyVisibleProducts.map((p) => p.type)),
      ];

      filterGroupsContainer.innerHTML = `
            <div class="filter-group">
                <label for="filter-brand" class="filter-label">Brand</label>
                <div class="select-wrapper">
                    <select id="filter-brand" class="filter-select" data-filter="brand">
                        ${availableBrands
                          .map(
                            (brand) =>
                              `<option value="${brand}" ${
                                activeFilters.brand === brand ? "selected" : ""
                              }>${brand}</option>`
                          )
                          .join("")}
                    </select>
                </div>
            </div>
            <div class="filter-group">
                <label for="filter-type" class="filter-label">Category</label>
                <div class="select-wrapper">
                    <select id="filter-type" class="filter-select" data-filter="type">
                        ${availableTypes
                          .map(
                            (type) =>
                              `<option value="${type}" ${
                                activeFilters.type === type ? "selected" : ""
                              }>${type}</option>`
                          )
                          .join("")}
                    </select>
                </div>
            </div>
        `;
    }

    // This is a "helper" function that just renders the product cards
    function renderProductGrid(productsToRender) {
      if (!productGridContainer) return;
      if (productsToRender.length === 0) {
        productGridContainer.innerHTML =
          "<p>No products found in this category.</p>";
        return;
      }
      productGridContainer.innerHTML = productsToRender
        .map(
          (product) => `
            <div class="d-product-card">
            <button class="wishlist-btn" data-product-id="${
              product.id
            }" aria-label="Add to Wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
                <div class="d-product-image-wrapper"><img src="${
                  product.image
                }" alt="${product.name}"></div>
                <div class="d-product-content">
                    <h3 class="d-product-title"><a href="#/product?id=${
                      product.id
                    }">${product.name}</a></h3>
                    <p class="d-product-description">${product.subcategory}</p>
                    <p class="d-product-price">$${product.price.toFixed(2)}</p>
                </div>
                <div class="d-product-actions">
                     <button class="btn btn-secondary quick-view-btn" data-product-id="${
                       product.id
                     }">Quick View</button>
                     <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `
        )
        .join("");
    }

    // Initial Setup
    const subcategories = [
      "All",
      ...new Set(fullProductList.map((p) => p.subcategory)),
    ];
    subcategoryNavContainer.innerHTML = subcategories
      .map(
        (sub) =>
          `<a href="#" class="subcategory-link active" data-subcategory="${sub}">${sub}</a>`
      )
      .join("");

    // Initial render of everything
    render();

    // Event Listeners (now attached to the containers)
    subcategoryNavContainer.addEventListener("click", (e) => {
      if (e.target.matches(".subcategory-link")) {
        e.preventDefault();
        activeFilters.subcategory = e.target.dataset.subcategory;
        // Reset dependent filters
        activeFilters.brand = "All";
        activeFilters.type = "All";
        render();
      }
    });

    // Attach listener to the FORM, not the container, for better event handling
    const filterForm = document.getElementById("filter-form");
    if (filterForm) {
      filterForm.addEventListener("change", (e) => {
        if (e.target.matches(".filter-select")) {
          const filterKey = e.target.dataset.filter;
          activeFilters[filterKey] = e.target.value;
          render();
        }
      });
      // Prevent form from actually submitting
      filterForm.addEventListener("submit", (e) => e.preventDefault());
    }
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
      } else if (path === "/wishlist") {
        renderWishlistPage();
      }
      const departmentKey = path.replace("/", ""); // Turns '/lighting' into 'lighting'
      if (products.hasOwnProperty(departmentKey)) {
        renderDepartmentPage(departmentKey);
      }
    });
  }

  // --- 2.5. ROUTER LOGIC ---
  async function handleRouteChange() {
    closeModal(quickViewModalOverlay);
    closeModal(addToCartModalOverlay);
    closeModal(newsletterModalOverlay);
    closeModal(quoteModalOverlay);
    closeModal(consultationModalOverlay);

    // NEW: Close the mobile menu on any navigation
    closeMobileMenu();

    const path = location.hash.slice(1) || "/";
    updateActiveNavLinks(path);

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

      setTimeout(() => {
        initializePageScripts(path);
      }, 0);

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

    // =============================================================
  // --- 2.7. GLOBAL EVENT LISTENERS (FINAL, COMPLETE VERSION) ---
  // =============================================================

  // This listener delegates actions for anything CLICKED INSIDE the DYNAMIC <main> content area
  mainContentContainer.addEventListener("click", (event) => {
    const target = event.target;

    // --- LOGIC for Quick View Buttons ---
    const quickViewBtn = target.closest('.quick-view-btn');
    if (quickViewBtn) {
        event.preventDefault();
        const productId = quickViewBtn.dataset.productId;
        
        // Find the full product data from our global 'products' object
        let productData = null;
        for (const category in products) {
            const found = products[category].find(p => p.id === productId);
            if (found) {
                productData = found;
                break;
            }
        }

        // If we found the product, populate the modal and open it
        if (productData) {
            quickViewModalContent.innerHTML = `
                <div class="pdp-layout" style="gap: 2rem;">
                    <div class="pdp-gallery"><div class="gallery-featured-image"><img src="${productData.image}" alt="${productData.name}"></div></div>
                    <div class="pdp-info">
                        <h1 class="pdp-title">${productData.name}</h1>
                        <p class="pdp-description">This is a brief overview. For full details, please view the complete product page.</p>
                        <div class="pdp-purchase-area" style="margin-top: 1rem;">
                            <p class="pdp-price">$${productData.price.toFixed(2)}</p>
                            <a href="#/product?id=${productData.id}" class="btn btn-secondary">View Full Details</a>
                        </div>
                    </div>
                </div>`;
            openModal(quickViewModalOverlay);
        }
    }

    // --- LOGIC for Wishlist Buttons ---
    const wishlistBtn = target.closest('.wishlist-btn');
    if (wishlistBtn) {
      event.preventDefault();
      const productId = wishlistBtn.dataset.productId;
      const departmentKey = location.hash.slice(1).split("?")[0].replace("/", "");
      const product = products[departmentKey]?.find((p) => p.id === productId);
      if (product) {
        addToWishlist(product);
        wishlistBtn.classList.add("active");
      }
    }

    const removeFromWishlistBtn = target.closest(".remove-from-wishlist-btn");
    if (removeFromWishlistBtn) {
      event.preventDefault();
      const productId = removeFromWishlistBtn.dataset.productId;
      state.wishlist = state.wishlist.filter((item) => item.id !== productId);
      saveWishlistToLocalStorage();
      updateWishlistIcon();
      renderWishlistPage();
    }

    // --- LOGIC for Add to Cart Buttons ---
    const addToCartBtn = target.closest(".add-to-cart-btn, .add-to-cart-pdp-btn");
    if (addToCartBtn) {
      event.preventDefault();
      const card = target.closest(".d-product-card, .pdp-info");
      if (card) {
        const productData = {
          id: card.querySelector(".d-product-title a")?.href || window.location.hash,
          name: card.querySelector(".d-product-title, .pdp-title")?.textContent.trim(),
          price: card.querySelector(".d-product-price, .pdp-price")?.textContent.trim(),
          image: card.closest(".d-product-card")?.querySelector("img")?.src || document.getElementById("main-product-image")?.src,
        };
        addToCart(productData);
      }
    }

    // --- LOGIC for Cart Quantity Buttons ---
    if (target.matches(".quantity-btn")) {
      const productId = target.dataset.id;
      const action = target.dataset.action;
      const itemInCart = state.cart.find((item) => item.id == productId);

      if (itemInCart) {
        if (action === "increase") {
          itemInCart.quantity++;
        } else if (action === "decrease") {
          itemInCart.quantity--;
          if (itemInCart.quantity <= 0) {
            state.cart = state.cart.filter((item) => item.id != productId);
          }
        }
        saveCartToLocalStorage();
        updateCartIcon();
        renderCartPage();
      }
    }
  });

  // =============================================================
  // This listener handles form submissions INSIDE the DYNAMIC <main> content area
  // =============================================================
  mainContentContainer.addEventListener("submit", (event) => {
    event.preventDefault();

    // Login Form Submission
    if (event.target.matches('.auth-form[action="#/login"]')) {
      if (validateForm(event.target)) {
        const email = event.target.querySelector("#login-email").value;
        state.currentUser = { name: "Test User", email: email };
        saveUserToLocalStorage();
        updateUserHeader();
        location.hash = "#/account";
      }
    }

    // Registration Form Submission
    if (event.target.matches('.auth-form[action="#/register"]')) {
      if (validateForm(event.target)) {
        const name = event.target.querySelector("#register-name").value;
        const email = event.target.querySelector("#register-email").value;
        state.currentUser = { name: name, email: email };
        saveUserToLocalStorage();
        updateUserHeader();
        location.hash = "#/account";
      }
    }
  });

  // =============================================================
  // This is the universal click listener for STATIC elements OUTSIDE of <main>
  // (Header buttons, modal backgrounds, modal close buttons, footer, etc.)
  // =============================================================
  document.body.addEventListener("click", (event) => {
    const target = event.target;

    // --- LOGIC FOR OPENING MODALS FROM STATIC BUTTONS ---
    if (target.matches("#open-newsletter-btn")) {
      openModal(newsletterModalOverlay);
    }
    if (target.matches("#open-quote-modal-btn")) {
      event.preventDefault();
      openModal(quoteModalOverlay);
    }
    if (target.matches("#open-consultation-modal-btn")) {
      event.preventDefault();
      openModal(consultationModalOverlay);
    }

    // --- LOGIC FOR CLOSING ANY MODAL ---
    const closeButton = target.closest(".modal-close-btn");
    const isOverlay = target.classList.contains("modal-overlay");
    if (closeButton || isOverlay) {
      const modalToClose = target.closest(".modal-overlay");
      if (modalToClose) {
        closeModal(modalToClose);
      }
    }

    // Special case for "Continue Shopping" button
    if (target.matches(".continue-shopping-btn")) {
      closeModal(addToCartModalOverlay);
    }
  });

  // --- 2.8. INITIAL APPLICATION STARTUP ---
  window.addEventListener("hashchange", handleRouteChange);
  initializeMobileMenu();
  updateCartIcon();
  updateWishlistIcon();
  updateUserHeader();
  handleRouteChange();
});
