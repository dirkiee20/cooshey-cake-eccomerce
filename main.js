const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  duration: 1000,
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content .section__description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__btn", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".header__content .socials", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".popular__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".discover__card img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".discover__card:nth-child(2) img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".discover__card__content h4", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".discover__card__content .section__description", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".discover__card__content h3", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".discover__card__btn", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".banner__content .section__header", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".banner__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  delay: 1000,
  interval: 500,
});

ScrollReveal().reveal(".subscribe__content .section__header", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".subscribe__content .section__description", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".subscribe__content form", {
  ...scrollRevealOption,
  delay: 1000,
});

document.addEventListener("DOMContentLoaded", function () {
  // --- Login/Register Modal Logic ---
  const loginRegisterModal = document.getElementById('login-register-modal');
  const loginPopupBtn = document.getElementById('login-popup-btn');
  const closeLoginRegisterModalBtn = loginRegisterModal.querySelector('.close-btn');
  const loginFormContainer = document.getElementById('login-form-container');
  const registerFormContainer = document.getElementById('register-form-container');
  const showRegisterFormLink = document.getElementById('show-register-form');
  const showLoginFormLink = document.getElementById('show-login-form');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  const openLoginRegisterModal = () => {
    if (loginRegisterModal) loginRegisterModal.style.display = 'flex';
  };

  const closeLoginRegisterModal = () => {
    if (loginRegisterModal) loginRegisterModal.style.display = 'none';
  };

  if (loginPopupBtn) {
    loginPopupBtn.onclick = openLoginRegisterModal;
  }

  if (closeLoginRegisterModalBtn) {
    closeLoginRegisterModalBtn.onclick = closeLoginRegisterModal;
  }

  showRegisterFormLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginFormContainer.style.display = 'none';
      registerFormContainer.style.display = 'block';
  });

  showLoginFormLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginFormContainer.style.display = 'block';
      registerFormContainer.style.display = 'none';
  });

  const API_URL = 'http://localhost:3001/api/users';

  loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
          const response = await fetch(`${API_URL}/login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || 'Failed to login');
          }

          localStorage.setItem('userToken', data.token);
          alert('Login successful!');
          closeLoginRegisterModal();

      } catch (error) {
          console.error('Login error:', error);
          alert(`Login failed: ${error.message}`);
      }
  });

  registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      try {
          const response = await fetch(`${API_URL}/`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, email, password })
          });

          const data = await response.json();

          if (!response.ok) {
              throw new Error(data.message || 'Failed to register');
          }

          localStorage.setItem('userToken', data.token);
          alert('Registration successful!');
          closeLoginRegisterModal();

      } catch (error) {
          console.error('Registration error:', error);
          alert(`Registration failed: ${error.message}`);
      }
  });


  // --- Floating Notification Modal Logic ---

  // Get the modal element
  const modal = document.getElementById("notification-modal");

  // Get the button that opens the modal
  const openBtn = document.getElementById("notification-btn");

  // Get the <span> element that closes the modal
  const closeBtn = document.querySelector(".close-btn");

  // Function to open the modal
  const openModal = () => {
    if (modal) modal.classList.add("show-modal");
  };

  // Function to close the modal
  const closeModal = () => {
    if (modal) modal.classList.remove("show-modal");
  };

  // When the user clicks the notification button, open the modal
  if (openBtn) {
    openBtn.onclick = openModal;
  }

  // When the user clicks on <span> (x), close the modal
  if (closeBtn) {
    closeBtn.onclick = closeModal;
  }

  // When the user clicks anywhere outside of the modal content, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      closeModal();
    }
    if (event.target == buyNowModal) {
      closeBuyNowModal();
    }
    if (event.target == loginRegisterModal) {
        closeLoginRegisterModal();
    }
  };

  // Also close the modal if the user presses the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (modal.classList.contains("show-modal")) {
        closeModal();
      }
      if (buyNowModal && buyNowModal.classList.contains("show-modal")) {
        closeBuyNowModal();
      }
      if (loginRegisterModal && loginRegisterModal.style.display === 'flex') {
        closeLoginRegisterModal();
      }
    }
  });

  // --- Buy Now Modal Logic ---
  const buyNowModal = document.getElementById("buy-now-modal");
  const buyNowCloseBtn = buyNowModal.querySelector(".close-btn");
  const buyNowProductName = document.getElementById("buy-now-product-name");
  const buyNowProductPrice = document.getElementById("buy-now-product-price");
  const buyNowForm = document.getElementById("buy-now-form");
  // Quantity Stepper Elements
  const quantityInput = document.getElementById("quantity");
  const quantityMinusBtn = document.getElementById("quantity-minus");
  const quantityPlusBtn = document.getElementById("quantity-plus");

  const openBuyNowModal = () => {
    if (buyNowModal) buyNowModal.classList.add("show-modal");
  };

  const closeBuyNowModal = () => {
    if (buyNowModal) buyNowModal.classList.remove("show-modal");
  };

  // When the user clicks on buy now modal's <span> (x), close it
  if (buyNowCloseBtn) {
    buyNowCloseBtn.onclick = closeBuyNowModal;
  }

  // When the buy now form is submitted
  if (buyNowForm) {
    buyNowForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const productName = this.dataset.productName;
      const productPrice = this.dataset.productPrice;
      const quantity = quantityInput.value;

      const item = {
        name: productName,
        price: parseFloat(productPrice),
        quantity: parseInt(quantity, 10),
      };

      // Store the single item for the "Buy Now" flow
      localStorage.setItem("buyNowItem", JSON.stringify(item));

      // Redirect to the cart/checkout page
      window.location.href = "cart.html";

      closeBuyNowModal();
    });
  }

  // --- Quantity Stepper Logic ---
  const updateQuantity = (amount) => {
    let currentValue = parseInt(quantityInput.value, 10);
    // Ensure the value is a number, default to 1 if not
    if (isNaN(currentValue)) {
      currentValue = 1;
    }
    currentValue += amount;

    if (currentValue < 1) {
      currentValue = 1;
    }

    quantityInput.value = currentValue;
    // Disable the minus button if quantity is 1, enable otherwise
    quantityMinusBtn.disabled = currentValue === 1;
  };

  if (quantityMinusBtn) {
    quantityMinusBtn.addEventListener("click", () => updateQuantity(-1));
  }
  if (quantityPlusBtn) {
    quantityPlusBtn.addEventListener("click", () => updateQuantity(1));
  }

  // A single, reusable function to handle "Buy Now" clicks
  const handleBuyNowClick = (event) => {
    const buyNowBtn = event.target.closest(".btn-buy-now");

    if (buyNowBtn) {
      event.preventDefault();

      const productName = buyNowBtn.dataset.productName;
      const productPrice = buyNowBtn.dataset.productPrice;

      if (productName && productPrice) {
        // Populate the modal with product info
        buyNowProductName.textContent = productName;
        buyNowProductPrice.textContent = parseFloat(productPrice).toFixed(2);
        buyNowForm.dataset.productName = productName;
        buyNowForm.dataset.productPrice = productPrice;
        quantityInput.value = 1; // Reset quantity on open
        quantityMinusBtn.disabled = true; // Disable minus button on open
        openBuyNowModal();
      }
    }
  };

  // Add event listeners to all sections containing "Buy Now" buttons
  
  const popularGrid = document.querySelector("#popular-cakes .popular__grid");
  const discoverContainer = document.querySelector("#most-selling .discover__grid");

  if (popularGrid) {
    popularGrid.addEventListener("click", handleBuyNowClick);
  }
  if (discoverContainer) {
    discoverContainer.addEventListener("click", handleBuyNowClick);
  }

  // --- Fetch and Display Products from API ---
  const fetchAndDisplayPopularProducts = async () => {
    const popularGrid = document.querySelector("#popular-cakes .popular__grid");
    if (!popularGrid) return;

    try {
      // Fetch products from your backend API
      const response = await fetch(
        "http://localhost:3001/api/products?category=popular"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();

      // Clear any placeholder content
      popularGrid.innerHTML = '';
      
      // Create and append a card for each product
      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = 'popular__card';
        card.innerHTML = `
          <div class="popular__card__image">
            <img src="${product.imageUrl}" alt="${product.name}" />
            <div class="popular__card__ribbon">POPULAR</div>
          </div>
          <div class="popular__card__content">
            <div class="popular__card__ratings">
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-half-fill"></i>
              <i class="ri-star-line"></i>
            </div>
            <h4>${product.name}</h4>
            <p>${product.description || 'A delicious treat.'}</p>
          </div>
          <div class="popular__card__footer">
            <h4>$${product.price.toFixed(2)}</h4>
            <div class="action-btns">
              <button class="btn"><i class="ri-shopping-cart-line"></i></button>
              <button class="btn btn-buy-now" data-product-name="${
                product.name
              }" data-product-price="${product.price.toFixed(2)}">Buy Now</button>
            </div>
          </div>
        `;
        popularGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Failed to fetch popular products:", error);
      popularGrid.innerHTML =
        '<p style="color: var(--text-dark);">Sorry, we couldn\'t load our flavours. Please try again later.</p>';
    }
  };

  const fetchAndDisplayBestSellers = async () => {
    const bestSellerGrid = document.querySelector("#most-selling .discover__grid");
    if (!bestSellerGrid) return;

    try {
      const response = await fetch(
        "http://localhost:3001/api/products?category=best-seller"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();

      bestSellerGrid.innerHTML = "";

      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "discover__card";
        card.innerHTML = `
          <div class="discover__card__image">
            <img src="${product.imageUrl}" alt="${product.name}" />
          </div>
          <div class="discover__card__content">
            <h4>${product.name}</h4>
            <p class="section__description">${product.description || "A delicious treat."}</p>
            <h3>$${product.price.toFixed(2)}</h3>
            <div class="discover__card__btn">
              <button class="btn btn-buy-now" data-product-name="${product.name}" data-product-price="${product.price.toFixed(2)}">
                Buy Now
              </button>
            </div>
          </div>
        `;
        bestSellerGrid.appendChild(card);
      });
    } catch (error) {
      console.error("Failed to fetch best sellers:", error);
      bestSellerGrid.innerHTML =
        '<p style="color: var(--text-dark);">Sorry, we couldn\'t load our best sellers. Please try again later.</p>';
    }
  };

  // Call the function to load products when the page loads
  fetchAndDisplayPopularProducts();
  fetchAndDisplayBestSellers();
});