import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import BlogListFallback from "./BlogListFallback";

const BlogTunnelScene = dynamic(() => import("./BlogTunnelScene"), {
  ssr: false,
});

const MIN_TUNNEL_WIDTH = 768;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function TimeTunnel({ posts = [] }) {
  const [canRenderTunnel, setCanRenderTunnel] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateCapability = () => {
      const isWideEnough = window.innerWidth >= MIN_TUNNEL_WIDTH;
      const shouldReduceMotion = motionQuery.matches;

      setCanRenderTunnel(
        posts.length > 0 && isWideEnough && !shouldReduceMotion && hasWebGL()
      );
      setIsReady(true);
    };

    updateCapability();
    window.addEventListener("resize", updateCapability);

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", updateCapability);
    } else {
      motionQuery.addListener(updateCapability);
    }

    return () => {
      window.removeEventListener("resize", updateCapability);

      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", updateCapability);
      } else {
        motionQuery.removeListener(updateCapability);
      }
    };
  }, [posts.length]);

  if (!isReady || !canRenderTunnel) {
    return <BlogListFallback posts={posts} />;
  }

  return <BlogTunnelScene posts={posts} />;
}
