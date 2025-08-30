const Cart = require('../models/cartModel');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Cart exists, check if product is already in cart
      const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

      if (itemIndex > -1) {
        // Product exists in cart, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Product not in cart, add new item
        cart.items.push({ product: productId, quantity });
      }
      cart = await cart.save();
    } else {
      // No cart for user, create new cart
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.status(201).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.product');
        return res.json(populatedCart);
      }
    }
    res.status(404).json({ message: 'Item not in cart' });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter(p => p.product.toString() !== productId);
      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      return res.json(populatedCart);
    }
    res.status(404).json({ message: 'Cart not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  deleteCartItem,
};