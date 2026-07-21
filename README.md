# Idina Mobile Planet 🪐

A static e-commerce website for a mobile phone store in Birnin Kebbi, Kebbi State, Nigeria. Built with vanilla HTML, CSS, and JavaScript, featuring a premium "Midnight Galaxy" theme with bilingual support (English and Hausa).

## Features

- **Bilingual Support**: English and Hausa language toggle with localStorage persistence
- **Product Catalog**: Dynamic product loading from Sanity CMS
- **Advanced Filtering**: Search, brand, category, condition, price range, and sorting
- **Shopping Cart**: LocalStorage-based cart with stock validation
- **WhatsApp Integration**: Direct WhatsApp checkout and product inquiries
- **Responsive Design**: Mobile-first, works on all screen sizes
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- **Premium Theme**: Deep space colors with cosmic blue and solar gold accents

## Project Structure

```
store/
├── css/
│   └── style.css          # Midnight Galaxy theme styles
├── js/
│   ├── config.js          # Configuration and helper functions
│   ├── i18n.js            # Internationalization (EN/HA)
│   ├── sanity.js          # Sanity CMS integration
│   ├── cart.js            # Shopping cart management
│   ├── main.js            # Common JavaScript functionality
│   ├── home.js            # Homepage specific logic
│   ├── shop.js            # Shop page filtering logic
│   ├── product.js         # Product detail page logic
│   └── cart-page.js       # Cart page logic
├── index.html             # Homepage
├── shop.html              # Shop page with filters
├── product.html           # Product detail page
├── cart.html              # Shopping cart page
├── about.html             # About us page
├── contact.html           # Contact page
├── 404.html               # Custom 404 page
├── sitemap.xml            # SEO sitemap
├── robots.txt             # SEO robots file
├── package.json           # Project configuration
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## Configuration

### Sanity CMS
- **Project ID**: `kwzovmjy`
- **Dataset**: `production`
- **API Version**: `2024-01-01`

### Contact Information
- **WhatsApp**: +234 810 003 7050
- **Address**: Shop Number 00, Taushi Plaza, Birnin Kebbi, Kebbi State, Nigeria
- **Hours**: Mon-Sat 8AM-8PM

## Setup Instructions

### Local Development

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd "c:\Users\Synn\Documents\Sentratech Labs\store"
   ```
3. Start a local server:
   ```bash
   python3 -m http.server 5500
   ```
   Or use the npm script:
   ```bash
   npm start
   ```
4. Open your browser to `http://localhost:5500`

### Sanity CMS Setup

1. Create a Sanity project at [sanity.io](https://www.sanity.io)
2. Configure the project with ID: `kwzovmjy`
3. Create a `product` schema with the following fields:
   - `nameEn` (string) - English product name
   - `nameHa` (string) - Hausa product name
   - `slug` (slug) - URL slug
   - `brand` (string) - Brand name
   - `category` (string) - Product category
   - `condition` (string) - Product condition
   - `price` (number) - Current price
   - `comparePrice` (number) - Original price (for sales)
   - `stock` (number) - Available stock
   - `featured` (boolean) - Featured product flag
   - `images` (array) - Product images
   - `specs` (object) - Product specifications
   - `warranty` (string) - Warranty information
   - `descriptionEn` (text) - English description
   - `descriptionHa` (text) - Hausa description

### Deployment

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

The `vercel.json` file is pre-configured with:
- Clean URLs
- Security headers
- Asset caching

## Theme Colors

The "Midnight Galaxy" theme uses the following color palette:

- **Backgrounds**: `#0B0F1F` (dark), `#060914` (darker), `#141A2E` (elevated)
- **Primary**: `#3B82F6` (blue), `#2563EB` (hover), `#60A5FA` (light)
- **Gold Accents**: `#F59E0B`, `#FBBF24`, `#D97706`
- **WhatsApp**: `#25D366`, `#1DA851`
- **Success**: `#10B981`
- **Error**: `#EF4444`

## JavaScript Functions

### config.js
- `formatNaira(amount)` - Format numbers as Nigerian Naira
- `whatsappLink(message)` - Generate WhatsApp chat links

### i18n.js
- `getCurrentLanguage()` - Get current language from localStorage
- `setLanguage(lang)` - Set language (en/ha)
- `t(key, replacements)` - Get translation with variable replacement
- `applyTranslations()` - Apply translations to all data-i18n elements

### sanity.js
- `urlFor(imageRef, width)` - Generate optimized Sanity image URLs
- `getAllProducts()` - Fetch all products
- `getFeaturedProducts()` - Fetch featured products (limit 8)
- `getProductBySlug(slug)` - Fetch single product
- `getRelatedProducts(category, currentId)` - Fetch related products

### cart.js
- `getCart()` - Get cart from localStorage
- `addToCart(product, quantity)` - Add item to cart
- `removeFromCart(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear entire cart
- `showToast(message, type)` - Display toast notification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Optimized image loading via Sanity CDN
- CSS animations with hardware acceleration
- LocalStorage for cart and language persistence
- Minimal JavaScript dependencies
- Asset caching via Vercel headers

## SEO Features

- Unique meta titles and descriptions per page
- Open Graph tags for social sharing
- Twitter Card support
- JSON-LD structured data for local business
- XML sitemap
- Robots.txt
- Canonical URLs

## License

Private project for Idina Mobile Planet.

## Support

For support, contact via WhatsApp: +234 810 003 7050
