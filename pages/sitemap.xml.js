import { getSortedPostsData } from '../lib/posts.js';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://64n-blog.vercel.app';

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- 文章页面 -->
  ${posts
    .map(({ id, date }) => {
      return `
  <url>
    <loc>${SITE_URL}/posts/${id}</loc>
    <lastmod>${new Date(date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const allPostsData = getSortedPostsData();
  const sitemap = generateSiteMap(allPostsData);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  // getServerSideProps 会处理响应，此组件不会被渲染
  return null;
}
