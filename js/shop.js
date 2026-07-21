/**
 * Idina Mobile Planet - Shop Page JavaScript
 * Product filtering and display
 */

let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', () => {
  loadAllProducts();
  initFilters();
});

/**
 * Load all products from Sanity
 */
async function loadAllProducts() {
  try {
    allProducts = await getAllProducts();
    applyFilters();
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('productsGrid').innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Error loading products. Please try again later.</p>
      </div>
    `;
  }
}

/**
 * Initialize filter event listeners
 */
function initFilters() {
  // Read URL params and pre-fill filters
  const urlParams = new URLSearchParams(window.location.search);
  const brandParam = urlParams.get('brand');
  const categoryParam = urlParams.get('category');
  
  if (brandParam) {
    document.getElementById('brandSelect').value = brandParam;
  }
  
  if (categoryParam) {
    document.getElementById('categorySelect').value = categoryParam;
  }
  
  // Attach event listeners to all filters
  const filters = [
    'searchInput',
    'brandSelect',
    'categorySelect',
    'conditionSelect',
    'minPrice',
    'maxPrice',
    'sortSelect'
  ];
  
  filters.forEach(filterId => {
    const element = document.getElementById(filterId);
    if (element) {
      element.addEventListener('input', applyFilters);
      element.addEventListener('change', applyFilters);
    }
  });
}

/**
 * Apply filters to products
 */
function applyFilters() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const brand = document.getElementById('brandSelect').value;
  const category = document.getElementById('categorySelect').value;
  const condition = document.getElementById('conditionSelect').value;
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
  const sort = document.getElementById('sortSelect').value;
  
  // Filter products
  filteredProducts = allProducts.filter(product => {
    // Search filter
    const nameEn = product.nameEn?.toLowerCase() || '';
    const nameHa = product.nameHa?.toLowerCase() || '';
    const matchesSearch = nameEn.includes(search) || nameHa.includes(search);
    
    // Brand filter
    const matchesBrand = brand === 'all' || product.brand?.toLowerCase() === brand.toLowerCase();
    
    // Category filter
    const matchesCategory = category === 'all' || product.category?.toLowerCase() === category.toLowerCase();
    
    // Condition filter
    const matchesCondition = condition === 'all' || product.condition?.toLowerCase() === condition.toLowerCase();
    
    // Price filter
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    
    return matchesSearch && matchesBrand && matchesCategory && matchesCondition && matchesPrice;
  });
  
  // Sort products
  switch (sort) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredProducts.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
      break;
    case 'newest':
    default:
      // Keep original order (already sorted by newest from Sanity)
      break;
  }
  
  renderProducts();
}

/**
 * Render products to grid
 */
function renderProducts() {
  const productsGrid = document.getElementById('productsGrid');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');
  
  if (filteredProducts.length === 0) {
    productsGrid.style.display = 'none';
    emptyState.style.display = 'block';
    resultsCount.textContent = t('filters.noResults') || 'No products found';
    return;
  }
  
  productsGrid.style.display = 'grid';
  emptyState.style.display = 'none';
  
  // Update results count
  const countText = t('filters.showing', { 
    count: filteredProducts.length, 
    total: allProducts.length 
  });
  resultsCount.textContent = countText;
  
  // Render product cards
  const productsHtml = filteredProducts.map(product => renderProductCard(product)).join('');
  productsGrid.innerHTML = productsHtml;
  
  // Apply translations to newly added elements
  applyTranslations();
  
  // Add click handlers for add to cart buttons
  filteredProducts.forEach(product => {
    const cartBtn = productsGrid.querySelector(`button[onclick="addToCartFromCard('${product._id}')"]`);
    if (cartBtn) {
      cartBtn.onclick = () => {
        addToCart(product, 1);
      };
    }
  });
}
