/**
 * Idina Mobile Planet - Configuration
 * Central store configuration and helper functions
 */

const config = {
  name: 'Idina Mobile Planet',
  tagline: 'Your Trusted Mobile Store in Birnin Kebbi',
  whatsappNumber: '2348100037050',
  whatsappDisplay: '+234 810 003 7050',
  phone: '+2348100037050',
  address: 'Shop Number 00, Taushi Plaza, Birnin Kebbi, Kebbi State, Nigeria',
  workingHours: 'Mon-Sat 8AM-8PM',
  currency: '₦',
  sanity: {
    projectId: 'kwzovmjy',
    dataset: 'production',
    apiVersion: '2024-01-01'
  }
};

/**
 * Format amount as Nigerian Naira
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "₦1,234,567")
 */
function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG');
}

/**
 * Generate WhatsApp link with pre-filled message
 * @param {string} message - The message to send
 * @returns {string} WhatsApp URL
 */
function whatsappLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${config.whatsappNumber}?text=${encoded}`;
}
