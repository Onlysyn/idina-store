/**
 * Idina Mobile Planet - Product Detail Page JavaScript
 * Display single product details and related products
 */

let currentProduct = null;
let currentQuantity = 1;
let selectedVariant = null;

document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
});

/**
 * Load product from URL slug parameter
 */
async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  if (!slug) {
    showProductNotFound();
    return;
  }
  
  try {
    const product = await getProductBySlug(slug);
    
    if (!product) {
      showProductNotFound();
      return;
    }
    
    console.log('Product loaded:', product);
    console.log('Has variants:', product.hasVariants);
    console.log('Variants:', product.variants);
    
    currentProduct = product;
    populateProduct(product);
    loadRelatedProducts(product);
    
  } catch (error) {
    console.error('Error loading product:', error);
    showProductNotFound();
  }
}

/**
 * Show product not found message
 */
function showProductNotFound() {
  const productDetail = document.getElementById('productDetail');
  productDetail.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📦</div>
      <h2>Product not found</h2>
      <p>The product you're looking for doesn't exist or has been removed.</p>
      <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Browse Shop</a>
    </div>
  `;
  
  document.getElementById('relatedGrid').innerHTML = '';
}

/**
 * Populate product detail page
 */
function populateProduct(product) {
  const lang = getCurrentLanguage();
  const name = lang === 'ha' && product.nameHa ? product.nameHa : product.nameEn;
  const description = lang === 'ha' && product.descriptionHa ? product.descriptionHa : product.descriptionEn;
  const hasVariants = product.hasVariants && product.variants && product.variants.length > 0;
  
  // Set default variant if product has variants
  if (hasVariants) {
    selectedVariant = product.variants[0];
  }
  
  const variant = hasVariants ? selectedVariant : product;
  const onSale = variant.comparePrice && variant.comparePrice > variant.price;
  const saveAmount = onSale ? variant.comparePrice - variant.price : 0;
  const stock = hasVariants ? variant.stock : product.stock;
  
  const productDetail = document.getElementById('productDetail');
  
  // Build gallery HTML
  const images = product.images || [];
  const mainImage = images.length > 0 ? urlFor(images[0], 800) : '';
  const thumbnailsHtml = images.map((img, index) => `
    <div class="product-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
      <img src="${urlFor(img, 80)}" alt="Thumbnail ${index + 1}">
    </div>
  `).join('');
  
  // Build specs table
  const specsHtml = buildSpecsTable(product.specs, lang);
  
  productDetail.innerHTML = `
    <div class="product-gallery">
      <div class="product-gallery-main">
        <img id="mainImage" src="${mainImage}" alt="${name}">
      </div>
      <div class="product-thumbnails" id="thumbnails">
        ${thumbnailsHtml}
      </div>
    </div>
    
    <div class="product-info">
      <span class="product-brand" id="productBrand">${product.brand}</span>
      <h1 class="product-title" id="productTitle">${name}</h1>
      <span class="product-stock ${stock > 0 ? 'in-stock' : 'out-of-stock'}" id="productStock">
        ${stock > 0 ? t('product.inStock') : t('product.outOfStock')}
      </span>
      
      <div class="product-price-block">
        <span class="price-current" id="productPrice">${formatNaira(variant.price)}</span>
        ${onSale ? `<span class="price-compare" id="productCompare">${formatNaira(variant.comparePrice)}</span>` : ''}
        ${onSale ? `<span class="product-save" id="productSave">${t('product.save', { amount: formatNaira(saveAmount) })}</span>` : ''}
      </div>
      
      ${hasVariants ? `
        <div class="variant-selector" style="margin-bottom: 24px;">
          <div class="filter-group" style="margin-bottom: 12px;">
            <label style="font-weight: 600; color: var(--gray-900); margin-bottom: 8px; display: block;">Color</label>
            <select id="colorSelect" style="width: 100%; padding: 10px 12px; border: 1px solid var(--gray-300); border-radius: var(--radius-sm);">
              ${getUniqueColors(product.variants).map(color => `
                <option value="${color}" ${selectedVariant.color === color ? 'selected' : ''}>${formatColorName(color)}</option>
              `).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label style="font-weight: 600; color: var(--gray-900); margin-bottom: 8px; display: block;">Storage</label>
            <select id="storageSelect" style="width: 100%; padding: 10px 12px; border: 1px solid var(--gray-300); border-radius: var(--radius-sm);">
              ${getUniqueStorage(product.variants).map(storage => `
                <option value="${storage}" ${selectedVariant.storage === storage ? 'selected' : ''}>${formatStorageName(storage)}</option>
              `).join('')}
            </select>
          </div>
        </div>
      ` : ''}
      
      <div class="product-meta">
        <div class="product-meta-row">
          <span class="product-meta-label" data-i18n="product.condition">Condition</span>
          <span class="product-meta-value" id="productCondition">${product.condition || 'N/A'}</span>
        </div>
        <div class="product-meta-row">
          <span class="product-meta-label" data-i18n="product.warranty">Warranty</span>
          <span class="product-meta-value" id="productWarranty">${product.warranty || 'N/A'}</span>
        </div>
      </div>
      
      <div class="product-description" id="productDescription">
        ${description || ''}
      </div>
      
      ${specsHtml ? `
        <div class="specs-section">
          <h3 data-i18n="product.specifications">Specifications</h3>
          <table class="specs-table" id="specsTable">
            ${specsHtml}
          </table>
        </div>
      ` : ''}
      
      <div class="quantity-selector">
        <button id="qtyMinus">−</button>
        <input type="number" id="quantity" value="1" min="1" max="${stock}">
        <button id="qtyPlus">+</button>
      </div>
      
      <div class="product-actions">
        <button class="btn btn-primary" id="addToCartBtn" data-i18n="product.addToCart">Add to Cart</button>
        <a href="#" class="btn btn-whatsapp" id="orderWhatsAppBtn" data-i18n="product.orderWhatsApp">Order on WhatsApp</a>
      </div>
      
      <div class="delivery-info" data-i18n="product.delivery">
        📍 Pickup at Taushi Plaza (free) | 🚚 Nationwide (charges on WhatsApp)
      </div>
    </div>
  `;
  
  // Initialize thumbnail click handlers
  initThumbnails(images);
  
  // Initialize quantity controls
  initQuantityControls(stock);
  
  // Initialize variant selectors if product has variants
  if (hasVariants) {
    initVariantSelectors(product);
  }
  
  // Initialize add to cart button
  document.getElementById('addToCartBtn').onclick = () => {
    const qty = parseInt(document.getElementById('quantity').value) || 1;
    const itemToAdd = hasVariants ? { ...product, selectedVariant } : product;
    addToCart(itemToAdd, qty);
  };
  
  // Initialize WhatsApp button
  const whatsappMessage = t('whatsapp.product', { product: name });
  document.getElementById('orderWhatsAppBtn').href = whatsappLink(whatsappMessage);
  
  // Apply translations
  applyTranslations();
}

/**
 * Initialize thumbnail click handlers
 */
function initThumbnails(images) {
  const thumbnails = document.querySelectorAll('.product-thumb');
  const mainImage = document.getElementById('mainImage');
  
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      // Update active state
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      
      // Update main image
      mainImage.src = urlFor(images[index], 800);
    });
  });
}

/**
 * Initialize quantity controls
 */
function initQuantityControls(maxStock) {
  const qtyInput = document.getElementById('quantity');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  
  qtyMinus.addEventListener('click', () => {
    let value = parseInt(qtyInput.value) || 1;
    if (value > 1) {
      qtyInput.value = value - 1;
    }
  });
  
  qtyPlus.addEventListener('click', () => {
    let value = parseInt(qtyInput.value) || 1;
    if (value < maxStock) {
      qtyInput.value = value + 1;
    }
  });
  
  qtyInput.addEventListener('change', () => {
    let value = parseInt(qtyInput.value) || 1;
    if (value < 1) value = 1;
    if (value > maxStock) value = maxStock;
    qtyInput.value = value;
  });
}

/**
 * Initialize variant selectors
 */
function initVariantSelectors(product) {
  const colorSelect = document.getElementById('colorSelect');
  const storageSelect = document.getElementById('storageSelect');
  
  if (!colorSelect || !storageSelect) return;
  
  colorSelect.addEventListener('change', () => {
    updateSelectedVariant(product);
  });
  
  storageSelect.addEventListener('change', () => {
    updateSelectedVariant(product);
  });
}

/**
 * Update selected variant based on dropdown selections
 */
function updateSelectedVariant(product) {
  const colorSelect = document.getElementById('colorSelect');
  const storageSelect = document.getElementById('storageSelect');
  
  const selectedColor = colorSelect.value;
  const selectedStorage = storageSelect.value;
  
  // Find matching variant
  const variant = product.variants.find(v => v.color === selectedColor && v.storage === selectedStorage);
  
  if (variant) {
    selectedVariant = variant;
    updateVariantDisplay(variant);
  }
}

/**
 * Update display when variant changes
 */
function updateVariantDisplay(variant) {
  const priceEl = document.getElementById('productPrice');
  const compareEl = document.getElementById('productCompare');
  const saveEl = document.getElementById('productSave');
  const stockEl = document.getElementById('productStock');
  const qtyInput = document.getElementById('quantity');
  
  // Update price
  priceEl.textContent = formatNaira(variant.price);
  
  // Update sale display
  const onSale = variant.comparePrice && variant.comparePrice > variant.price;
  if (onSale) {
    compareEl.textContent = formatNaira(variant.comparePrice);
    compareEl.style.display = 'inline';
    const saveAmount = variant.comparePrice - variant.price;
    saveEl.textContent = t('product.save', { amount: formatNaira(saveAmount) });
    saveEl.style.display = 'inline-block';
  } else {
    compareEl.style.display = 'none';
    saveEl.style.display = 'none';
  }
  
  // Update stock
  stockEl.textContent = variant.stock > 0 ? t('product.inStock') : t('product.outOfStock');
  stockEl.className = `product-stock ${variant.stock > 0 ? 'in-stock' : 'out-of-stock'}`;
  
  // Update quantity max
  qtyInput.max = variant.stock;
  if (parseInt(qtyInput.value) > variant.stock) {
    qtyInput.value = variant.stock;
  }
}

/**
 * Get unique colors from variants
 */
function getUniqueColors(variants) {
  const colors = [...new Set(variants.map(v => v.color))];
  return colors;
}

/**
 * Get unique storage options from variants
 */
function getUniqueStorage(variants) {
  const storage = [...new Set(variants.map(v => v.storage))];
  return storage;
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

/**
 * Build specs table HTML
 */
function buildSpecsTable(specs, lang) {
  if (!specs || Object.keys(specs).length === 0) return '';
  
  return Object.entries(specs).map(([key, value]) => {
    // Try to get translated key
    const translatedKey = lang === 'ha' ? key : key; // Add Hausa translations as needed
    return `
      <tr>
        <td>${translatedKey}</td>
        <td>${value}</td>
      </tr>
    `;
  }).join('');
}

/**
 * Load related products
 */
async function loadRelatedProducts(product) {
  try {
    const related = await getRelatedProducts(product.category, product._id);
    const relatedGrid = document.getElementById('relatedGrid');
    
    if (!related || related.length === 0) {
      relatedGrid.innerHTML = '';
      return;
    }
    
    const relatedHtml = related.map(p => renderProductCard(p)).join('');
    relatedGrid.innerHTML = relatedHtml;
    
    // Apply translations
    applyTranslations();
    
    // Add click handlers for add to cart buttons
    related.forEach(p => {
      const cartBtn = relatedGrid.querySelector(`button[onclick="addToCartFromCard('${p._id}')"]`);
      if (cartBtn) {
        cartBtn.onclick = () => {
          addToCart(p, 1);
        };
      }
    });
    
  } catch (error) {
    console.error('Error loading related products:', error);
    document.getElementById('relatedGrid').innerHTML = '';
  }
}
