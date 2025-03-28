const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { RateLimiter } = require('limiter');

class WebScanner {
  constructor() {
    this.limiter = new RateLimiter({
      tokensPerInterval: 100,
      interval: 'minute'
    });
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async scanWebPage(url) {
    await this.limiter.removeTokens(1);
    
    // Check cache first
    const cachedResult = this.cache.get(url);
    if (cachedResult && Date.now() - cachedResult.timestamp < this.cacheTimeout) {
      return cachedResult.data;
    }

    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const data = {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content'),
        content: $('body').text(),
        links: [],
        images: []
      };

      $('a').each((i, link) => {
        const href = $(link).attr('href');
        if (href && !href.startsWith('#')) {
          data.links.push(href);
        }
      });

      $('img').each((i, img) => {
        const src = $(img).attr('src');
        if (src) {
          data.images.push(src);
        }
      });

      // Cache the result
      this.cache.set(url, {
        timestamp: Date.now(),
        data
      });

      return data;
    } catch (error) {
      console.error(`Error scanning ${url}:`, error);
      throw error;
    }
  }

  async scanMultiplePages(urls) {
    return Promise.all(urls.map(url => this.scanWebPage(url)));
  }
}

module.exports = new WebScanner();