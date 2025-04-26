/**
 * Converts a string to a URL-friendly slug
 * @param {string} text - The text to convert to a slug
 * @return {string} The URL-friendly slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with dashes
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Remove duplicate dashes
    .replace(/\-\-+/g, '-')
    // Remove leading and trailing dashes
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

module.exports = slugify; 