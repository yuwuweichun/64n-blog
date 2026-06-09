import Layout from "../components/layout";
import TimeTunnel from "../components/TimeTunnel";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
export default function Home({ allPostsData }) {
  return (
    <Layout 
      home
      title={null}
      description="专注前端技术的开发者博客，分享 JavaScript、React、Next.js、Git 等技术文章与实战经验。"
    >
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <p>Hello, just call me 64n.</p>
        <h2 className={utilStyles.headingXl}>Blog</h2>
        <TimeTunnel posts={allPostsData} />
      </section>
    </Layout>
  );
}
