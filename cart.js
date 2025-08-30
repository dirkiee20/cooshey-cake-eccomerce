document.addEventListener('DOMContentLoaded', () => {
    const cartGrid = document.querySelector('.cart__grid');
    const subtotalEl = document.getElementById('subtotal');
    const taxesEl = document.getElementById('taxes');
    const totalEl = document.getElementById('total');

    const API_URL = 'http://localhost:3001/api/cart';

    // Function to get the auth token from wherever it's stored
    const getToken = () => {
        // This is an example; you might store the token in localStorage or a cookie
        return localStorage.getItem('userToken'); 
    };

    // 1. Fetch cart items from the backend
    const fetchCart = async () => {
        const token = getToken();
        if (!token) {
            cartGrid.innerHTML = '<p>Please log in to see your cart.</p>';
            return;
        }

        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }

            const cart = await response.json();
            renderCart(cart.items);
            calculateSummary(cart.items);

        } catch (error) {
            console.error('Error fetching cart:', error);
            cartGrid.innerHTML = '<p>Error loading your cart. Please try again later.</p>';
        }
    };

    // 2. Render cart items in the DOM
    const renderCart = (items) => {
        cartGrid.innerHTML = ''; // Clear existing items

        if (!items || items.length === 0) {
            cartGrid.innerHTML = '<p>Your cart is currently empty.</p>';
            return;
        }

        items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart__item';
            cartItem.dataset.productId = item.product._id;

            cartItem.innerHTML = `
                <img src="${item.product.imageUrl}" alt="${item.product.name}" />
                <div class="cart__item__details">
                    <h4>${item.product.name}</h4>
                    <p class="cart__item__price">$${item.product.price.toFixed(2)}</p>
                    <div class="cart__item__quantity">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" value="${item.quantity}" min="1" />
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                </div>
                <button class="btn btn--remove"><i class="ri-delete-bin-6-line"></i></button>
            `;
            cartGrid.appendChild(cartItem);
        });
    };

    // 3. Calculate and display the summary
    const calculateSummary = (items) => {
        if (!items || items.length === 0) {
            subtotalEl.textContent = '$0.00';
            taxesEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const taxes = subtotal * 0.10; // 10% tax
        const total = subtotal + taxes;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxesEl.textContent = `$${taxes.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    };

    // 4. Handle quantity changes and item deletions
    cartGrid.addEventListener('click', async (e) => {
        const target = e.target;
        const cartItem = target.closest('.cart__item');
        if (!cartItem) return;

        const productId = cartItem.dataset.productId;

        // Delete item
        if (target.closest('.btn--remove')) {
            await updateCart(productId, 0); // Sending quantity 0 to signify deletion
        }

        // Update quantity
        const quantityInput = cartItem.querySelector('input[type="number"]');
        let quantity = parseInt(quantityInput.value);

        if (target.classList.contains('minus-btn')) {
            quantity = Math.max(1, quantity - 1);
            await updateCart(productId, quantity);
        } else if (target.classList.contains('plus-btn')) {
            quantity += 1;
            await updateCart(productId, quantity);
        }
    });

    // Function to send updates to the backend
    const updateCart = async (productId, quantity) => {
        const token = getToken();
        const method = quantity === 0 ? 'DELETE' : 'PUT';
        const url = `${API_URL}/${productId}`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update cart');
            }

            const updatedCart = await response.json();
            renderCart(updatedCart.items);
            calculateSummary(updatedCart.items);

        } catch (error) {
            console.error('Error updating cart:', error);
            alert('Could not update the cart. Please try again.');
            // If the update fails, refresh the cart from the server to revert the changes
            fetchCart();
        }
    };

    // Initial fetch of the cart
    fetchCart();

    const checkoutBtn = document.querySelector('.btn--checkout');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});
