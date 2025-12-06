const https = require('https');
const http = require('http');

/**
 * Fetch metadata/preview from a URL
 * @param {string} url - The URL to fetch metadata from
 * @returns {Promise<object>} - Metadata object with title, description, image, etc.
 */
const fetchLinkPreview = async (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const timeout = 5000; // 5 seconds timeout

    const request = client.get(url, { timeout }, (response) => {
      let data = '';

      // Only process HTML content
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) {
        return resolve({
          title: null,
          description: null,
          image: null,
          siteName: null,
        });
      }

      response.on('data', (chunk) => {
        data += chunk;
        // Limit data size to prevent memory issues
        if (data.length > 100000) {
          response.destroy();
          return resolve({
            title: null,
            description: null,
            image: null,
            siteName: null,
          });
        }
      });

      response.on('end', () => {
        try {
          const metadata = parseHTMLMetadata(data, url);
          resolve(metadata);
        } catch (error) {
          resolve({
            title: null,
            description: null,
            image: null,
            siteName: null,
          });
        }
      });
    });

    request.on('error', () => {
      resolve({
        title: null,
        description: null,
        image: null,
        siteName: null,
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        title: null,
        description: null,
        image: null,
        siteName: null,
      });
    });

    request.setTimeout(timeout);
  });
};

/**
 * Parse HTML to extract metadata (Open Graph, Twitter Cards, or standard meta tags)
 * @param {string} html - HTML content
 * @param {string} baseUrl - Base URL for resolving relative image URLs
 * @returns {object} - Extracted metadata
 */
const parseHTMLMetadata = (html, baseUrl) => {
  const metadata = {
    title: null,
    description: null,
    image: null,
    siteName: null,
  };

  // Extract title (Open Graph > Twitter > standard)
  const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const twitterTitle = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
  const standardTitle = html.match(/<title>([^<]+)<\/title>/i);

  if (ogTitle) metadata.title = ogTitle[1];
  else if (twitterTitle) metadata.title = twitterTitle[1];
  else if (standardTitle) metadata.title = standardTitle[1].trim();

  // Extract description
  const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  const twitterDesc = html.match(/<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i);
  const standardDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);

  if (ogDesc) metadata.description = ogDesc[1];
  else if (twitterDesc) metadata.description = twitterDesc[1];
  else if (standardDesc) metadata.description = standardDesc[1];

  // Extract image
  const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const twitterImage = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

  if (ogImage) metadata.image = ogImage[1];
  else if (twitterImage) metadata.image = twitterImage[1];

  // Extract site name
  const ogSiteName = html.match(/<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i);
  if (ogSiteName) metadata.siteName = ogSiteName[1];

  return metadata;
};

module.exports = { fetchLinkPreview };

