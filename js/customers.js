document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('customerModal');
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const closeButtons = document.querySelectorAll('.close-modal');
    const customerForm = document.getElementById('customerForm');

    // Modal handling
    addCustomerBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Add New Customer';
        customerForm.reset();
        modal.style.display = 'block';
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    // Form submission
    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const customerId = document.getElementById('customerId').value;
        const customerData = {
            name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            address: document.getElementById('customerAddress').value
        };

        // Here you would typically make an API call to save the customer
        console.log('Saving customer:', customerData);
        modal.style.display = 'none';
        // Refresh customer list after saving
    });

    // Theme switcher
    document.getElementById('themeSwitcher').addEventListener('click', () => {
        document.documentElement.setAttribute('data-bs-theme',
            document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light'
        );
    });

    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });
});
