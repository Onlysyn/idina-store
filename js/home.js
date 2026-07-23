/**
 * Idina Mobile Planet - Homepage JavaScript
 * Load and display featured products
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Home page loaded, loading featured products...');
  loadFeaturedProducts();
});

/**
 * Load featured products from Sanity
 */
async function loadFeaturedProducts() {
  const featuredGrid = document.getElementById('featuredGrid');
  if (!featuredGrid) {
    console.error('featuredGrid element not found');
    return;
  }
  
  // Show loading state
  featuredGrid.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
    </div>
  `;
  
  try {
    console.log('Fetching featured products...');
    const products = await getFeaturedProducts();
    console.log('Featured products fetched:', products);
    
    if (!products || products.length === 0) {
      featuredGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <p>No featured products yet. Add some in Sanity Studio!</p>
        </div>
      `;
      return;
    }
    
    // Store products for cart functionality
    window.featuredProducts = products;
    
    // Render product cards with error handling
    const productsHtml = products.map(product => {
      try {
        return renderProductCard(product);
      } catch (error) {
        console.error('Error rendering product card:', product, error);
        return '';
      }
    }).join('');
    
    featuredGrid.innerHTML = productsHtml;
    
    // Apply translations to newly added elements
    applyTranslations();
    
    // Add click handlers for add to cart buttons
    products.forEach(product => {
      const cartBtn = featuredGrid.querySelector(`button[onclick="addToCartFromCard('${product._id}')"]`);
      if (cartBtn) {
        cartBtn.onclick = () => {
          addToCart(product, 1);
        };
      }
    });
    
  } catch (error) {
    console.error('Error loading featured products:', error);
    featuredGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <p>Error loading products. Please try again later.</p>
      </div>
    `;
  }
}
