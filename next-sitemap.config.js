/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.uxercise.com',
  generateRobotsTxt: false, // Using custom robots.txt in public/
  // Exclude any admin or private routes
  exclude: [],
  // Generate both sitemap.xml and sitemap-0.xml
  generateIndexSitemap: false,
  // Additional paths to include
  additionalPaths: async (config) => {
    const result = [];

    // Add article pages
    const articleSlugs = [
      'beginner-strength-training',
      'home-gym-essentials',
      'nutrition-basics',
      'progressive-overload',
      'recovery-and-sleep',
    ];

    articleSlugs.forEach((slug) => {
      result.push({
        loc: `/articles/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
  // Change frequency settings for different routes
  changefreq: 'weekly',
  priority: 0.7,
  // Transform function to set custom priorities and change frequencies
  transform: async (config, path) => {
    // Custom priority and changefreq based on path
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/demo') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/calculators') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path === '/articles') {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.startsWith('/articles/')) {
      priority = 0.7;
      changefreq = 'monthly';
    } else if (path === '/privacy-policy' || path === '/terms') {
      priority = 0.3;
      changefreq = 'monthly';
    } else if (path === '/data') {
      priority = 0.3;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  autoLastmod: true,
};
