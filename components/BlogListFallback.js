import Link from "next/link";
import Date from "./date";
import utilStyles from "../styles/utils.module.css";

export default function BlogListFallback({ posts = [] }) {
  if (posts.length === 0) {
    return <p className={utilStyles.lightText}>No posts yet.</p>;
  }

  return (
    <ul className={utilStyles.list}>
      {posts.map(({ id, date, title }) => (
        <li className={utilStyles.listItem} key={id}>
          <Link href={`/posts/${id}`}>{title}</Link>
          <br />
          <small className={utilStyles.lightText}>
            <Date dateString={date} />
          </small>
        </li>
      ))}
    </ul>
  );
}
