import Cart from "../models/Cart.js";
import Product from "../models/productModel.js";

// Helper: ensure quantity never exceeds stock
const safeQuantity = (requested, stock) => Math.max(0, Math.min(requested, stock));

// 🔹 Get cart for logged-in user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json([]);

    // Filter out deleted/unavailable products
    const filteredItems = cart.items.filter(item => item.product);
    if (filteredItems.length !== cart.items.length) {
      cart.items = filteredItems;
      await cart.save();
    }

    res.json(filteredItems);
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Add product to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId) return res.status(400).json({ message: "productId is required" });
  let qtyToAdd = quantity || 1;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: "Product not found" });
    if (product.stock <= 0) return res.status(400).json({ message: `${product.name} is out of stock` });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Update existing quantity, limit to stock
      cart.items[itemIndex].quantity = safeQuantity(cart.items[itemIndex].quantity + qtyToAdd, product.stock);
    } else {
      // Add new item, limit to stock
      qtyToAdd = safeQuantity(qtyToAdd, product.stock);
      cart.items.push({ product: productId, quantity: qtyToAdd });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    const filteredItems = populatedCart.items.filter(item => item.product);
    res.json(filteredItems);

  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update cart item quantity
export const updateCartQuantity = async (req, res) => {
  const { cartItemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i._id.toString() === cartItemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    const product = await Product.findById(item.product);
    if (!product || product.stock <= 0 || quantity <= 0) {
      // Remove if unavailable or quantity ≤ 0
      cart.items = cart.items.filter(i => i._id.toString() !== cartItemId);
    } else {
      // Update quantity with stock limit
      item.quantity = safeQuantity(quantity, product.stock);
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    const filteredItems = populatedCart.items.filter(i => i.product);
    res.json(filteredItems);

  } catch (error) {
    console.error("Update Cart Quantity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Remove cart item
export const removeCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i._id.toString() !== id);
    await cart.save();

    const populatedCart = await cart.populate("items.product");
    const filteredItems = populatedCart.items.filter(i => i.product);
    res.json(filteredItems);

  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
