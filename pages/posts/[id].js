import Head from 'next/head';
import Layout from '../../components/layout';
import Date from '../../components/date';
import CodeCopyButton from '../../components/CodeCopyButton';
import { getAllPostIds, getPostData } from '../../lib/posts';

import utilStyles from '../../styles/utils.module.css';

 
export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  const postData = await getPostData(params.id);
 
  return {
    props: {
      postData,
    },
  };
}
 
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://64n-blog.vercel.app';
  const postUrl = `${siteUrl}/posts/${postData.id}`;

  return (
    <Layout
      title={postData.title}
      description={postData.description}
      keywords={postData.keywords}
      url={postUrl}
      type="article"
      datePublished={postData.date}
    >
      <CodeCopyButton />
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}