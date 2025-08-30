document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3001/api/products';

  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');
  const formTitle = document.getElementById('form-title');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const productIdInput = document.getElementById('product-id');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  // Fetch and display all products
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch products');
      const products = await response.json();

      productList.innerHTML = ''; // Clear existing list
      products.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.id = product._id;
        row.innerHTML = `
          <td>${product.name}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.category || 'N/A'}</td>
          <td class="product-actions">
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn delete-btn">Delete</button>
          </td>
        `;
        productList.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      productList.innerHTML = '<tr><td colspan="4">Error loading products.</td></tr>';
    }
  };

  // Clear form and reset to "Add" mode
  const clearForm = () => {
    productForm.reset();
    productIdInput.value = '';
    formTitle.textContent = 'Add New Product';
    formSubmitBtn.textContent = 'Add Product';
    cancelEditBtn.classList.add('hidden');
  };

  // Handle form submission (for both creating and updating)
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoryValue = document.getElementById('category').value;

    // Add a clear frontend validation check
    if (!categoryValue) {
      alert('Please select a category for the product.');
      return;
    }

    const id = productIdInput.value;
    const productData = {
      name: document.getElementById('name').value,
      price: parseFloat(document.getElementById('price').value),
      description: document.getElementById('description').value,
      imageUrl: document.getElementById('imageUrl').value,
      category: categoryValue.toLowerCase(),
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.msg || JSON.stringify(errorData);
        } catch (jsonError) {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      clearForm();
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error: ${error.message}`);
    }
  });

  // Handle clicks on "Edit" and "Delete" buttons
  productList.addEventListener('click', async (e) => {
    const target = e.target;
    const row = target.closest('tr');
    if (!row) return;

    const id = row.dataset.id;

    // Handle Delete
    if (target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Failed to delete product');
          fetchProducts(); // Refresh list
        } catch (error) {
          console.error('Error deleting product:', error);
          alert('Failed to delete product.');
        }
      }
    }

    // Handle Edit
    if (target.classList.contains('edit-btn')) {
      try {
        const response = await fetch(API_URL);
        const products = await response.json();
        const productToEdit = products.find(p => p._id === id);

        if (productToEdit) {
          // Populate the form
          productIdInput.value = productToEdit._id;
          document.getElementById('name').value = productToEdit.name;
          document.getElementById('price').value = productToEdit.price;
          document.getElementById('description').value = productToEdit.description || '';
          document.getElementById('imageUrl').value = productToEdit.imageUrl;
          document.getElementById('category').value = productToEdit.category.toLowerCase();

          // Switch form to "Edit" mode
          formTitle.textContent = 'Edit Product';
          formSubmitBtn.textContent = 'Update Product';
          cancelEditBtn.classList.remove('hidden');
          window.scrollTo(0, 0); // Scroll to top to see the form
        }
      } catch (error) {
        console.error('Error preparing edit:', error);
      }
    }
  });

  // Handle cancel edit button
  cancelEditBtn.addEventListener('click', clearForm);

  // Initial load
  fetchProducts();
});