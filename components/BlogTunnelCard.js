import Link from "next/link";
import { Html } from "@react-three/drei";
import Date from "./date";
import styles from "./TimeTunnel.module.css";

export default function BlogTunnelCard({ post, active, onHover, onLeave }) {
  return (
    <Html
      center
      distanceFactor={7}
      position={[1.45, 0.36, 0]}
      zIndexRange={[40, 0]}
      wrapperClass={styles.htmlCardWrap}
    >
      <Link
        href={`/posts/${post.id}`}
        className={`${styles.tunnelCard} ${
          active ? styles.tunnelCardActive : ""
        }`}
        onBlur={onLeave}
        onFocus={onHover}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <span className={styles.cardDate}>
          <Date dateString={post.date} />
        </span>
        <span className={styles.cardTitle}>{post.title}</span>
        {post.description ? (
          <span className={styles.cardDescription}>{post.description}</span>
        ) : null}
      </Link>
    </Html>
  );
}
