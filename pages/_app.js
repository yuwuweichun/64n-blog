// 在 Next.js 中，您可以通过从 pages/_app.js 导入来添加全局 CSS 文件。
// 您不能在其他任何地方导入全局 CSS。
import '../styles/global.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}