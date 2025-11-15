import Head from 'next/head';
import Image from 'next/image';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import UIFrame from './UIFrame';
 
const name = 'C4LLM364N';
export const siteTitle = '64N Blog';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://64n-blog.vercel.app';
const defaultDescription = '专注前端技术的开发者博客，分享 JavaScript、React、Next.js、Git 等技术文章与实战经验。';
const defaultImage = `${siteUrl}/images/profile.jpg`;
 
export default function Layout({ 
  children, 
  home, 
  title, 
  description, 
  keywords, 
  image, 
  url,
  type = 'website',
  datePublished 
}) {
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageUrl = url || siteUrl;
  const pageKeywords = keywords || 'JavaScript, 前端开发, React, Next.js, Git, 编程, 技术博客';

  // 结构化数据
  const structuredData = type === 'article' && title ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    image: pageImage,
    datePublished: datePublished,
    author: {
      '@type': 'Person',
      name: '64n',
      url: siteUrl
    },
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: defaultImage
      }
    },
    description: pageDescription,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    }
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: siteUrl,
    description: defaultDescription,
    author: {
      '@type': 'Person',
      name: '64n'
    }
  };

  return (
    <UIFrame>
      <div className={styles.container}>
        <Head>
          {/* 基础 Meta */}
          <title>{pageTitle}</title>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={pageKeywords} />
          <meta name="author" content="64n" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="canonical" href={pageUrl} />

          {/* Open Graph */}
          <meta property="og:type" content={type} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={pageImage} />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:site_name" content={siteTitle} />
          {datePublished && <meta property="article:published_time" content={datePublished} />}

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={pageImage} />

          {/* 结构化数据 (JSON-LD) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        <header className={styles.header}>
          {home ? (
            <>
              <Image
                priority
                src="/images/profile.jpg"
                className={utilStyles.borderCircle}
                height={108}
                width={108}
                alt="64n profile picture"
              />
              <h2 className={utilStyles.headingLg}>{name}</h2>
            </>
          ) : (
            <>
              <Link href="/">
                <Image
                  priority
                  src="/images/profile.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt="64n profile picture"
                />
              </Link>
              <h2 className={utilStyles.headingLg}>
                <Link href="/" className={utilStyles.colorInherit}>
                  {name}
                </Link>
              </h2>
            </>
          )}
        </header>
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">$ cd .. <span className={styles.cursor}>_</span></Link>
          </div>
        )}
      </div>
    </UIFrame>
  );
}