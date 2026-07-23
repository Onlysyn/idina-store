/**
 * Idina Mobile Planet - Sanity CMS Integration
 * Fetch products and data from Sanity CMS
 */

const SANITY_PROJECT_ID = config.sanity.projectId;
const SANITY_DATASET = config.sanity.dataset;
const SANITY_API_VERSION = config.sanity.apiVersion;

const SANITY_API_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}`;

/**
 * Generate optimized Sanity CDN URL for images
 * @param {object} imageRef - Sanity image reference
 * @param {number} width - Desired width in pixels
 * @returns {string} Optimized image URL
 */
function urlFor(imageRef, width = 800) {
  if (!imageRef) return '';
  
  const ref = imageRef.asset?._ref || imageRef;
  if (!ref) return '';
  
  // Ensure ref is a string before calling match
  if (typeof ref !== 'string') return '';
  
  // Parse Sanity image reference: image-<id>-<dimensions>-<format>
  const [, id, dimensions, format] = ref.match(/image-([a-f0-9]+)-(\d+x\d+)-(\w+)/) || [];
  if (!id) return '';
  
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}?w=${width}&auto=format&q=80`;
}

/**
 * Execute GROQ query against Sanity API
 * @param {string} query - GROQ query string
 * @param {object} params - Query parameters
 * @returns {Promise<object>} Query results
 */
async function fetchSanity(query, params = {}) {
  try {
    const response = await fetch(`${SANITY_API_URL}/data/query/${SANITY_DATASET}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sanity API error response:', errorText);
      throw new Error(`Sanity API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return null;
  }
}

/**
 * Get all products sorted by newest
 * @returns {Promise<Array>} Array of all products
 */
async function getAllProducts() {
  const query = `
    *[_type == "product"] | order(_createdAt desc) {
      _id,
      nameEn,
      nameHa,
      slug,
      brand,
      category,
      condition,
      price,
      comparePrice,
      stock,
      featured,
      hasVariants,
      variants,
      images,
      specs,
      warranty,
      descriptionEn,
      descriptionHa,
      _createdAt
    }
  `;
  
  try {
    const result = await fetchSanity(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

/**
 * Get featured products (limit 8)
 * @returns {Promise<Array>} Array of featured products
 */
async function getFeaturedProducts() {
  const query = `
    *[_type == "product" && featured == true] | order(_createdAt desc)[0...8] {
      _id,
      nameEn,
      nameHa,
      slug,
      brand,
      category,
      condition,
      price,
      comparePrice,
      stock,
      featured,
      hasVariants,
      variants,
      images,
      specs,
      warranty,
      descriptionEn,
      descriptionHa,
      _createdAt
    }
  `;
  
  try {
    const result = await fetchSanity(query);
    return result || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

/**
 * Get single product by slug
 * @param {string} slug - Product slug
 * @returns {Promise<object|null>} Product object or null
 */
async function getProductBySlug(slug) {
  const query = `
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      nameEn,
      nameHa,
      slug,
      brand,
      category,
      condition,
      price,
      comparePrice,
      stock,
      featured,
      hasVariants,
      variants,
      images,
      specs,
      warranty,
      descriptionEn,
      descriptionHa,
      _createdAt
    }
  `;
  
  try {
    const result = await fetchSanity(query, { slug });
    return result || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * Get related products by category (excluding current product)
 * @param {string} category - Product category
 * @param {string} currentId - Current product ID to exclude
 * @returns {Promise<Array>} Array of 4 related products
 */
async function getRelatedProducts(category, currentId) {
  const query = `
    *[_type == "product" && category == $category && _id != $currentId] | order(_createdAt desc)[0...4] {
      _id,
      nameEn,
      nameHa,
      slug,
      brand,
      category,
      condition,
      price,
      comparePrice,
      stock,
      featured,
      hasVariants,
      variants,
      images,
      specs,
      warranty,
      descriptionEn,
      descriptionHa,
      _createdAt
    }
  `;
  
  try {
    const result = await fetchSanity(query, { category, currentId });
    return result || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
