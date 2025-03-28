const fetch = require('node-fetch');
const { RateLimiter } = require('limiter');

class SocialMediaMonitor {
  constructor() {
    this.platforms = new Map();
    this.limiter = new RateLimiter({
      tokensPerInterval: 50,
      interval: 'minute'
    });
  }

  registerPlatform(name, config) {
    this.platforms.set(name, {
      ...config,
      limiter: new RateLimiter({
        tokensPerInterval: config.rateLimit || 30,
        interval: 'minute'
      })
    });
  }

  async fetchInstagramPosts(username, accessToken) {
    const platform = this.platforms.get('instagram');
    await platform.limiter.removeTokens(1);

    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  async fetchTwitterPosts(username, bearerToken) {
    const platform = this.platforms.get('twitter');
    await platform.limiter.removeTokens(1);

    try {
      const response = await fetch(
        `https://api.twitter.com/2/users/by/username/${username}/tweets`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`
          }
        }
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching Twitter posts:', error);
      throw error;
    }
  }

  async fetchFacebookPosts(pageId, accessToken) {
    const platform = this.platforms.get('facebook');
    await platform.limiter.removeTokens(1);

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/posts?access_token=${accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching Facebook posts:', error);
      throw error;
    }
  }

  async monitorMultiplePlatforms(configs) {
    const results = {};
    for (const [platform, config] of Object.entries(configs)) {
      switch (platform) {
        case 'instagram':
          results.instagram = await this.fetchInstagramPosts(
            config.username,
            config.accessToken
          );
          break;
        case 'twitter':
          results.twitter = await this.fetchTwitterPosts(
            config.username,
            config.bearerToken
          );
          break;
        case 'facebook':
          results.facebook = await this.fetchFacebookPosts(
            config.pageId,
            config.accessToken
          );
          break;
      }
    }
    return results;
  }
}

module.exports = new SocialMediaMonitor();