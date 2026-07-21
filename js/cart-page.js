/**
 * Idina Mobile Planet - Cart Page JavaScript
 * Render cart items and handle checkout
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  
  document.getElementById('checkoutBtn').addEventListener('click', checkoutWhatsApp);
});

/**
 * Render cart items
 */
function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartSummary = document.querySelector('.cart-summary');
  
  if (cart.items.length === 0) {
    // Show empty cart state
    cartItems.style.display = 'none';
    cartSummary.style.display = 'none';
    emptyCart.style.display = 'block';
    return;
  }
  
  // Hide empty cart, show items and summary
  emptyCart.style.display = 'none';
  cartItems.style.display = 'block';
  cartSummary.style.display = 'block';
  
  // Build cart items HTML
  const itemsHtml = cart.items.map(item => {
    const imageUrl = urlFor(item.image, 80) || '';
    const lineTotal = item.price * item.quantity;
    const name = getCurrentLanguage() === 'ha' && item.nameHa ? item.nameHa : item.name;
    
    // Format variant info if present
    const variantInfo = item.variant 
      ? `<p style="font-size: 12px; color: var(--gray-500); margin-top: 4px;">
           ${formatColorName(item.variant.color)} - ${formatStorageName(item.variant.storage)}
         </p>`
      : '';
    
    return `
      <div class="cart-item" data-id="${item.cartItemId}">
        <img src="${imageUrl}" alt="${name}">
        <div class="cart-item-info">
          <h4>${name}</h4>
          <p class="cart-item-brand">${item.brand}</p>
          ${variantInfo}
        </div>
        <div class="cart-item-price">${formatNaira(item.price)}</div>
        <div class="cart-item-qty">
          <button class="qty-minus" data-id="${item.cartItemId}">−</button>
          <input type="number" value="${item.quantity}" min="1" max="${item.stock}" readonly>
          <button class="qty-plus" data-id="${item.cartItemId}">+</button>
        </div>
        <div class="cart-item-total">${formatNaira(lineTotal)}</div>
        <span class="cart-item-remove" data-id="${item.cartItemId}" data-i18n="cart.remove">${t('cart.remove')}</span>
      </div>
    `;
  }).join('');
  
  cartItems.innerHTML = itemsHtml;
  
  // Update summary
  document.getElementById('subtotal').textContent = formatNaira(cart.total);
  document.getElementById('cartTotal').textContent = formatNaira(cart.total);
  
  // Attach event listeners
  attachCartListeners();
  
  // Apply translations
  applyTranslations();
}

/**
 * Attach event listeners to cart items
 */
function attachCartListeners() {
  // Quantity minus buttons
  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cartItemId = e.target.dataset.id;
      const cart = getCart();
      const item = cart.items.find(i => i.cartItemId === cartItemId);
      if (item) {
        const newQty = item.quantity - 1;
        if (newQty >= 1) {
          updateQuantity(cartItemId, newQty);
          renderCart();
        }
      }
    });
  });
  
  // Quantity plus buttons
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cartItemId = e.target.dataset.id;
      const cart = getCart();
      const item = cart.items.find(i => i.cartItemId === cartItemId);
      if (item) {
        const newQty = item.quantity + 1;
        if (newQty <= item.stock) {
          updateQuantity(cartItemId, newQty);
          renderCart();
        } else {
          showToast(t('cart.outOfStock') || 'Not enough stock', 'error');
        }
      }
    });
  });
  
  // Remove buttons
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cartItemId = e.target.dataset.id;
      removeFromCart(cartItemId);
      renderCart();
    });
  });
}

/**
 * Checkout via WhatsApp
 */
function checkoutWhatsApp() {
  const cart = getCart();
  
  if (cart.items.length === 0) {
    showToast('Your cart is empty', 'error');
    return;
  }
  
  // Build WhatsApp message
  let message = '🛒 New Order from Idina Mobile Planet Website\n\n';
  
  cart.items.forEach(item => {
    const name = getCurrentLanguage() === 'ha' && item.nameHa ? item.nameHa : item.name;
    const lineTotal = item.price * item.quantity;
    const variantText = item.variant 
      ? ` (${formatColorName(item.variant.color)} - ${formatStorageName(item.variant.storage)})`
      : '';
    message += `[${name}${variantText}] Qty: ${item.quantity} × ${formatNaira(item.price)} = ${formatNaira(lineTotal)}\n`;
  });
  
  message += `\n💰 Total: ${formatNaira(cart.total)}`;
  message += `\n📍 Pickup: Taushi Plaza, Birnin Kebbi (Free)`;
  message += `\n🚚 Delivery: Nationwide — Please share your address for delivery quote`;
  message += `\n💳 Payment: Bank Transfer | Cash on Delivery (Local)`;
  message += `\n✅ Please confirm availability and payment method.`;
  
  // Open WhatsApp
  window.open(whatsappLink(message), '_blank');
}

/**
 * Format color name for display
 */
function formatColorName(color) {
  return color.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * Format storage name for display
 */
function formatStorageName(storage) {
  return storage.toUpperCase();
}
