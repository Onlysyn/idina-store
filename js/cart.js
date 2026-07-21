/**
 * Idina Mobile Planet - Shopping Cart Management
 * LocalStorage-based cart with stock validation
 */

const CART_STORAGE_KEY = 'idinaMobilePlanetCart';

/**
 * Get cart from localStorage
 * @returns {object} Cart object with items, total, itemCount
 */
function getCart() {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) {
    return { items: [], total: 0, itemCount: 0 };
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing cart:', error);
    return { items: [], total: 0, itemCount: 0 };
  }
}

/**
 * Save cart to localStorage
 * @param {object} cart - Cart object to save
 */
function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Generate unique cart item ID
 * @param {object} product - Product object
 * @returns {string} Unique cart item ID
 */
function generateCartItemId(product) {
  if (product.selectedVariant) {
    return `${product._id}-${product.selectedVariant.color}-${product.selectedVariant.storage}`;
  }
  return product._id;
}

/**
 * Add product to cart
 * @param {object} product - Product object
 * @param {number} quantity - Quantity to add (default 1)
 * @returns {boolean} Success status
 */
function addToCart(product, quantity = 1) {
  const cart = getCart();
  
  // Handle variant products
  const hasVariant = product.selectedVariant;
  const variant = hasVariant ? product.selectedVariant : product;
  const stock = hasVariant ? variant.stock : product.stock;
  const price = hasVariant ? variant.price : product.price;
  const comparePrice = hasVariant ? variant.comparePrice : product.comparePrice;
  
  // Validate stock
  if (stock < quantity) {
    showToast(t('cart.outOfStock') || 'Not enough stock', 'error');
    return false;
  }
  
  // Generate unique cart item ID
  const cartItemId = generateCartItemId(product);
  
  // Check if product/variant already in cart
  const existingItem = cart.items.find(item => item.cartItemId === cartItemId);
  
  if (existingItem) {
    // Update quantity if within stock limit
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > stock) {
      showToast(t('cart.outOfStock') || 'Not enough stock', 'error');
      return false;
    }
    existingItem.quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      cartItemId: cartItemId,
      _id: product._id,
      name: product.nameEn,
      nameHa: product.nameHa,
      slug: product.slug,
      brand: product.brand,
      price: price,
      comparePrice: comparePrice,
      image: product.images?.[0],
      quantity: quantity,
      stock: stock,
      variant: hasVariant ? {
        color: variant.color,
        storage: variant.storage
      } : null
    });
  }
  
  recalcCart(cart);
  saveCart(cart);
  showToast(t('cart.added') || 'Added to cart', 'success');
  return true;
}

/**
 * Remove item from cart
 * @param {string} cartItemId - Cart item ID to remove
 */
function removeFromCart(cartItemId) {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.cartItemId !== cartItemId);
  recalcCart(cart);
  saveCart(cart);
  showToast(t('cart.removed') || 'Removed from cart', 'info');
}

/**
 * Update item quantity
 * @param {string} cartItemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {boolean} Success status
 */
function updateQuantity(cartItemId, quantity) {
  const cart = getCart();
  const item = cart.items.find(item => item.cartItemId === cartItemId);
  
  if (!item) return false;
  
  // Validate quantity
  if (quantity < 1) {
    removeFromCart(cartItemId);
    return true;
  }
  
  if (quantity > item.stock) {
    showToast(t('cart.outOfStock') || 'Not enough stock', 'error');
    return false;
  }
  
  item.quantity = quantity;
  recalcCart(cart);
  saveCart(cart);
  return true;
}

/**
 * Recalculate cart totals
 * @param {object} cart - Cart object to recalculate
 */
function recalcCart(cart) {
  cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get cart total
 * @returns {number} Cart total
 */
function getCartTotal() {
  const cart = getCart();
  return cart.total;
}

/**
 * Get cart item count
 * @returns {number} Total items in cart
 */
function getCartCount() {
  const cart = getCart();
  return cart.itemCount;
}

/**
 * Clear entire cart
 */
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
}

/**
 * Update cart badge in navbar
 */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - 'success', 'error', or 'info'
 */
function showToast(message, type = 'info') {
  // Remove existing toast
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
