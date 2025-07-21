console.log("ElectroHub Main JavaScript Initialized (Final SPA Mode).");

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. GLOBAL STATE & ROUTE DEFINITIONS ---
  const state = {
    cart: JSON.parse(localStorage.getItem("electroHubCart")) || [],
     currentUser: JSON.parse(localStorage.getItem('electroHubUser')) || null, // NEW: User state

    shippingCost: 15.0,
    taxRate: 0.075,
  };

  // --- 1. ROUTE DEFINITIONS ---
  // Maps the URL hash to the content file. ALL pages are now modular.
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

  // --- 2. STATE MANAGEMENT & UI UPDATES ---

   function saveUserToLocalStorage() {
        if (state.currentUser) {
            localStorage.setItem('electroHubUser', JSON.stringify(state.currentUser));
        } else {
            localStorage.removeItem('electroHubUser');
        }
    }
    
    // NEW: Function to handle the visual changes of logging in/out
    function updateUserHeader() {
        const accountLink = document.querySelector('a[href="#/login"].header-icon');
        const headerActions = document.querySelector('.header-actions');
        
        // Clear any existing logout button to prevent duplicates
        const existingLogoutBtn = document.getElementById('header-logout-btn');
        if (existingLogoutBtn) existingLogoutBtn.remove();

        if (state.currentUser) {
            // User is logged in
            if(accountLink) accountLink.href = '#/account'; // Link icon to account page

            // Create a logout button
            const logoutButton = document.createElement('a');
            logoutButton.id = 'header-logout-btn';
            logoutButton.className = 'btn btn-secondary';
            logoutButton.textContent = 'Logout';
            logoutButton.href = '#/logout';
            headerActions.appendChild(logoutButton);

        } else {
            // User is logged out
            if(accountLink) accountLink.href = '#/login'; // Link icon back to login
        }
    }

  // Function to save the cart to localStorage
  function saveCartToLocalStorage() {
    localStorage.setItem("electroHubCart", JSON.stringify(state.cart));
  }

  // Function to update the cart icon count
  function updateCartIcon() {
    const cartItemCount = state.cart.reduce(
      (total, item) => total + item.quantity,
      0
    ); // Sum quantities
    const cartCountBubble = cartIcon.querySelector(".cart-count-bubble");

    if (cartItemCount > 0) {
      if (cartCountBubble) {
        cartCountBubble.textContent = cartItemCount;
      } else {
        // Create the bubble if it doesn't exist
        const bubble = document.createElement("span");
        bubble.classList.add("cart-count-bubble");
        bubble.textContent = cartItemCount;
        cartIcon.appendChild(bubble);
      }
    } else {
      // Remove the bubble if the cart is empty
      if (cartCountBubble) {
        cartIcon.removeChild(cartCountBubble);
      }
    }
  }

  function addToCart(productId, productName, price) {
    // Check if item already exists in cart
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
    saveCartToLocalStorage(); // Save after every change
    updateCartIcon();
  }

  // ==========================================================
  // 3. THIS IS THE COMPLETE AND CORRECTED FUNCTION
  // ==========================================================
  function renderCartPage() {
    requestAnimationFrame(() => {
      // Define all needed elements at the top of the function's scope
      const itemsContainer = document.getElementById("cart-items-container");
      const cartLayout = document.querySelector(".cart-layout");
      const emptyCartContainer = document.getElementById(
        "empty-cart-container"
      );

      // Safety check: if these elements don't exist, we can't proceed.
      if (!itemsContainer || !cartLayout || !emptyCartContainer) {
        return;
      }

      // Clear previous items from the list
      itemsContainer.innerHTML = "";

      if (state.cart.length === 0) {
        // If cart is empty, show the message and hide the main layout
        cartLayout.style.display = "none";
        emptyCartContainer.style.display = "block";
      } else {
        // If cart has items, show the main layout and hide the empty message
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

        // Calculate totals
        const shipping = subtotal > 0 ? state.shippingCost : 0;
        const tax = (subtotal + shipping) * state.taxRate;
        const total = subtotal + shipping + tax;

        // Update the summary UI
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

  // NEW: Function to render the checkout page's order review
  function renderCheckoutPage() {
    requestAnimationFrame(() => {
      const itemsContainer = document.getElementById("review-items-container");
      if (!itemsContainer) return; // Exit if not on the checkout page

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
        // If cart is empty, maybe show a message or redirect
        itemsContainer.innerHTML = "<p>Your cart is empty.</p>";
      }
    });
  }

   // NEW: Function to render user data on the account page
    function renderAccountPage() {
        requestAnimationFrame(() => {
            if (state.currentUser) {
                const nameEl = document.querySelector('.info-value[data-key="name"]');
                const emailEl = document.querySelector('.info-value[data-key="email"]');
                if(nameEl) nameEl.textContent = state.currentUser.name;
                if(emailEl) emailEl.textContent = state.currentUser.email;
            }
        });
    }

  // ===========================================================
  // --- 4. PAGE-SPECIFIC INITIALIZATION FUNCTIONS ---
  // ===========================================================

  function initializePDPGallery() {
    const mainImage = document.getElementById("main-product-image");
    const thumbnails = document.querySelectorAll(
      ".gallery-thumbnails .thumbnail"
    );

    // Check if the necessary elements exist on the page
    if (mainImage && thumbnails.length > 0) {
      thumbnails.forEach((thumb) => {
        // Check if a listener has already been attached to prevent duplicates
        if (!thumb.dataset.listenerAttached) {
          thumb.addEventListener("click", function () {
            // Change the main image src to the clicked thumbnail's src
            mainImage.src = this.src;

            // Update the 'active' class on the thumbnails
            thumbnails.forEach((t) => t.classList.remove("active"));
            this.classList.add("active");
          });
          // Mark this thumbnail as having a listener attached
          thumb.dataset.listenerAttached = "true";
        }
      });
    }
  }

  // This function will be called AFTER new content is loaded
  function initializePageScripts(path) {
    // FIX: Now using requestAnimationFrame to delay script execution safely
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

    // Add other page-specific initializers here
  }

  


  // =================================================================
  // --- 5. ROUTER LOGIC ---
  // =================================================================
  async function handleRouteChange() {
    const path = location.hash.slice(1) || "/";

     // NEW: Protected Route Logic
        if (path.startsWith('/account') && !state.currentUser) {
            // If user tries to access account but isn't logged in, redirect to login
            location.hash = '/login';
            return;
        }
        
        // NEW: Handle Logout
        if (path === '/logout') {
            state.currentUser = null;
            saveUserToLocalStorage();
            updateUserHeader();
            location.hash = '/'; // Redirect to homepage
            return;
        }

        // ... rest of router logic is unchanged ...
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
      mainContentContainer.innerHTML = html; // Inject the new content

      // Run scripts for the newly loaded page
      initializePageScripts(path);
      window.scrollTo(0, 0); // Scroll to top on page change
    } catch (error) {
      console.error("Error loading page:", error);
      mainContentContainer.innerHTML =
        '<div class="container"><h1 class="page-main-title">Error loading page.</h1></div>';
    }
  }

  // ============================================================
  // --- 6. GLOBAL EVENT LISTENERS ---
  // ============================================================
  // This runs only once on initial load
  initializeMobileMenu();

  // Listen for URL hash changes to trigger navigation
  window.addEventListener("hashchange", handleRouteChange);

  // UPDATED: Initialize cart icon from localStorage on page load
  updateCartIcon();

  // Handle the initial page load (e.g., if user bookmarks a deep link like #/cart)
  handleRouteChange();

  // Event delegation for cart actions
  mainContentContainer.addEventListener("click", (event) => {
    const target = event.target;

    // Add to cart
    if (target.closest(".add-to-cart-btn, .add-to-cart-pdp-btn")) {
      event.preventDefault();
      addToCart(Math.random(), "Sample Product", 10.99);
      target.closest("button").textContent = "Added!";
      setTimeout(() => {
        target.closest("button").innerHTML = "Add to Cart";
      }, 1500);
    }

    // Quantity buttons (NEW)
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
            // Remove item if quantity is 0 or less
            state.cart = state.cart.filter((item) => item.id !== productId);
          }
        }
        saveCartToLocalStorage();
        updateCartIcon();
        renderCartPage(); // Re-render the cart to show changes
      }
    }
  });


 // NEW: Event listener for form submissions
    mainContentContainer.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission

        // Login Form Submission
        if (event.target.matches('.auth-form[action="#/login"]')) {
            const email = event.target.querySelector('#login-email').value;
            // In a real app, you'd send this to a server for validation.
            // We'll simulate a successful login.
            if (email) {
                state.currentUser = { name: "Test User", email: email };
                saveUserToLocalStorage();
                updateUserHeader();
                location.hash = '#/account'; // Redirect to account page
            }
        }
    });

});


// =================================================================
// --- 7. UTILITY FUNCTIONS (Unchanged) ---
// =================================================================

// The old mobile menu initializer, now moved inside the main listener
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
