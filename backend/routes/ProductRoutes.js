const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category.toLowerCase(); // match your schema enum
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/products
// @desc    Add a new product
// @access  Public (for now, this will be admin-only later)
router.post('/', async (req, res) => {
  const { name, price, description, imageUrl, category } = req.body;

  // Basic validation
  if (!name || !price || !imageUrl) {
    return res.status(400).json({ msg: 'Please provide name, price, and imageUrl for the product.' });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl,
      category: category.toLowerCase() // Ensure it matches your schema enum,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   PUT /api/products/:id
// @desc    Update (edit) a product
// @access  Public (for now)
router.put('/:id', async (req, res) => {
  // Add validation for the ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // This option returns the modified document
      runValidators: true, // This ensures new data meets schema requirements
    });

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
  // Add validation for the ID
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
