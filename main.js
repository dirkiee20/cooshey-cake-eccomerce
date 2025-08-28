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
// Wait for the document to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
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
  const popularGrid = document.querySelector(".popular__grid");
  const discoverContainer = document.querySelector(".discover__container");

  if (popularGrid) {
    popularGrid.addEventListener("click", handleBuyNowClick);
  }
  if (discoverContainer) {
    discoverContainer.addEventListener("click", handleBuyNowClick);
  }
});
