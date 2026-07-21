/**
 * Idina Mobile Planet - Main JavaScript
 * Common functionality for all pages
 */

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateCartBadge();
  initLanguageToggle();
  initWhatsAppLinks();
  initBackToTop();
  initGlobalSearch();
  initQuickViewModal();
});

/**
 * Initialize language toggle buttons
 */
function initLanguageToggle() {
  const langEN = document.getElementById('langEN');
  const langHA = document.getElementById('langHA');
  
  if (langEN) {
    langEN.addEventListener('click', () => setLanguage('en'));
  }
  
  if (langHA) {
    langHA.addEventListener('click', () => setLanguage('ha'));
  }
}

/**
 * Initialize WhatsApp links with greeting messages
 */
function initWhatsAppLinks() {
  const greeting = t('whatsapp.greeting');
  
  const links = [
    { id: 'heroWhatsApp', message: greeting },
    { id: 'ctaWhatsApp', message: greeting },
    { id: 'fabWhatsApp', message: greeting },
    { id: 'footerWhatsApp', message: greeting }
  ];
  
  links.forEach(({ id, message }) => {
    const element = document.getElementById(id);
    if (element) {
      element.href = whatsappLink(message);
    }
  });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Render product card HTML
 * @param {object} product - Product object
 * @returns {string} HTML string for product card
 */
function renderProductCard(product) {
  const lang = getCurrentLanguage();
  const name = lang === 'ha' && product.nameHa ? product.nameHa : product.nameEn;
  const imageUrl = urlFor(product.images?.[0], 400) || '';
  const onSale = product.comparePrice && product.comparePrice > product.price;
  const discountPercent = onSale ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  
  const stockBadge = product.stock > 0 
    ? `<span class="badge badge-in" data-i18n="product.inStock">${t('product.inStock')}</span>`
    : `<span class="badge badge-out" data-i18n="product.outOfStock">${t('product.outOfStock')}</span>`;
  
  const saleBadge = onSale 
    ? `<span class="badge badge-sale">${discountPercent}% OFF</span>`
    : '';
  
  const comparePriceHtml = onSale 
    ? `<span class="compare-price">${formatNaira(product.comparePrice)}</span>`
    : '';
  
  return `
    <div class="product-card">
      <div class="product-card-image">
        <a href="product.html?slug=${product.slug}">
          <img src="${imageUrl}" alt="${name}" loading="lazy">
        </a>
        <span class="badge badge-brand">${product.brand}</span>
        ${stockBadge}
        ${saleBadge}
      </div>
      <div class="product-card-body">
        <h3 class="product-card-title">
          <a href="product.html?slug=${product.slug}">${name}</a>
        </h3>
        <p class="product-card-brand">${product.brand}</p>
        <p class="product-card-price">
          ${formatNaira(product.price)}${comparePriceHtml}
        </p>
        <div class="product-card-actions">
          <button class="btn-cart" onclick="addToCartFromCard('${product._id}')">
            <span data-i18n="product.addToCart">${t('product.addToCart')}</span>
          </button>
          <a href="${whatsappLink(t('whatsapp.product', { product: name }))}" 
             class="btn-wa-card" 
             target="_blank"
             rel="noopener">
            💬
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize global search functionality
 */
function initGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  const searchBtn = document.getElementById('searchBtn');
  
  if (!searchInput || !searchBtn) return;
  
  // Search on button click
  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
  });
  
  // Search on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
}

/**
 * Initialize quick view modal
 */
function initQuickViewModal() {
  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const closeBtn = document.getElementById('quickViewClose');
  
  if (!modal || !overlay || !closeBtn) return;
  
  // Close on overlay click
  overlay.addEventListener('click', closeQuickView);
  
  // Close on button click
  closeBtn.addEventListener('click', closeQuickView);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeQuickView();
    }
  });
}

/**
 * Open quick view modal for a product
 * @param {string} productId - Product ID
 */
async function openQuickView(productId) {
  const modal = document.getElementById('quickViewModal');
  const quickViewBody = document.getElementById('quickViewBody');
  
  if (!modal || !quickViewBody) return;
  
  // Show modal in loading state
  modal.classList.add('active', 'loading');
  modal.classList.remove('loaded');
  
  try {
    // Fetch product by ID (need to implement this in sanity.js)
    // For now, we'll use slug-based approach
    const products = await getAllProducts();
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      closeQuickView();
      showToast('Product not found', 'error');
      return;
    }
    
    // Render product in modal
    const lang = getCurrentLanguage();
    const name = lang === 'ha' && product.nameHa ? product.nameHa : product.nameEn;
    const description = lang === 'ha' && product.descriptionHa ? product.descriptionHa : product.descriptionEn;
    const imageUrl = urlFor(product.images?.[0], 600) || '';
    const onSale = product.comparePrice && product.comparePrice > product.price;
    
    quickViewBody.innerHTML = `
      <div class="quick-view-product">
        <div class="quick-view-image">
          <img src="${imageUrl}" alt="${name}">
        </div>
        <div class="quick-view-info">
          <span class="quick-view-brand">${product.brand}</span>
          <h2>${name}</h2>
          <p class="quick-view-price">${formatNaira(product.price)}</p>
          ${onSale ? `<p class="compare-price" style="color: var(--gray-500); text-decoration: line-through;">${formatNaira(product.comparePrice)}</p>` : ''}
          <p class="quick-view-description">${description || ''}</p>
          <div class="quick-view-actions">
            <button class="btn btn-primary" onclick="addToCartFromCard('${product._id}'); closeQuickView();">
              Add to Cart
            </button>
            <a href="product.html?slug=${product.slug}" class="btn btn-primary" style="background: var(--bg-elevated);">
              View Details
            </a>
          </div>
        </div>
      </div>
    `;
    
    // Show loaded state
    modal.classList.remove('loading');
    modal.classList.add('loaded');
    
  } catch (error) {
    console.error('Error loading quick view:', error);
    closeQuickView();
    showToast('Error loading product', 'error');
  }
}

/**
 * Close quick view modal
 */
function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    modal.classList.remove('active', 'loading', 'loaded');
  }
}

/**
 * Perform search and redirect to shop page
 * @param {string} query - Search query
 */
function performSearch(query) {
  if (!query || query.trim() === '') return;
  
  const encodedQuery = encodeURIComponent(query.trim());
  window.location.href = `shop.html?search=${encodedQuery}`;
}

/**
 * Add product to cart from card (global function for onclick)
 * @param {string} productId - Product ID
 */
async function addToCartFromCard(productId) {
  // This would need to fetch product details first
  // For now, we'll need to implement this in the specific page scripts
  console.log('Add to cart:', productId);
}
