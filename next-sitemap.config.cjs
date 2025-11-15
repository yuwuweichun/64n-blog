/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://64n-blog.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/sitemap.xml.js'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    // 首页优先级最高
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }
    
    // 文章页面次优先级
    if (path.startsWith('/posts/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // 其他页面
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
