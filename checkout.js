document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryItemsEl = document.getElementById('order-summary-items');
    const subtotalEl = document.getElementById('subtotal');
    const taxesEl = document.getElementById('taxes');
    const totalEl = document.getElementById('total');
    const gcashButton = document.getElementById('gcash-button');

    const API_URL = 'http://localhost:3001/api/cart';
    const PAYMENT_API_URL = 'http://localhost:3001/api/payments/gcash';

    let currentTotal = 0;

    const getToken = () => {
        return localStorage.getItem('userToken');
    };

    const fetchCart = async () => {
        const token = getToken();
        if (!token) {
            orderSummaryItemsEl.innerHTML = '<p>Please log in to see your cart.</p>';
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
            renderOrderSummary(cart.items);
            calculateSummary(cart.items);

        } catch (error) {
            console.error('Error fetching cart:', error);
            orderSummaryItemsEl.innerHTML = '<p>Error loading your cart. Please try again later.</p>';
        }
    };

    const renderOrderSummary = (items) => {
        orderSummaryItemsEl.innerHTML = ''; // Clear existing items

        if (!items || items.length === 0) {
            orderSummaryItemsEl.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }

        items.forEach(item => {
            const summaryItem = document.createElement('div');
            summaryItem.className = 'summary-item';
            summaryItem.innerHTML = `
                <span>${item.product.name} (x${item.quantity})</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            `;
            orderSummaryItemsEl.appendChild(summaryItem);
        });
    };

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

        subtotalEl.textContent = `${subtotal.toFixed(2)}`;
        taxesEl.textContent = `${taxes.toFixed(2)}`;
        totalEl.textContent = `${total.toFixed(2)}`;
        currentTotal = total;
    };

    const handleGcashPayment = async () => {
        const token = getToken();
        if (!token) {
            alert('You must be logged in to place an order.');
            return;
        }

        const address = document.getElementById('address').value;
        const contact = document.getElementById('contact').value;

        if (!address || !contact) {
            alert('Please fill out all shipping information.');
            return;
        }

        if (currentTotal <= 0) {
            alert('Your cart is empty.');
            return;
        }

        try {
            const response = await fetch(PAYMENT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: currentTotal })
            });

            if (!response.ok) {
                throw new Error('Failed to create GCash payment source.');
            }

            const { checkout_url } = await response.json();
            window.location.href = checkout_url;

        } catch (error) {
            console.error('Error processing GCash payment:', error);
            alert('There was an issue with the GCash payment. Please try again.');
        }
    };

    gcashButton.addEventListener('click', handleGcashPayment);

    // Initial fetch of the cart summary
    fetchCart();
});
