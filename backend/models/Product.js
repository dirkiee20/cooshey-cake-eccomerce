const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: { // For the strikethrough price
    type: Number
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String, // URL to the image
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['popular', 'best-seller', 'main-product']
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;