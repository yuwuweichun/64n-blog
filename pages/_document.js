import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* Google Search Console 验证标签 */}
        {/* 请替换 YOUR_VERIFICATION_CODE_HERE 为你从 Google Search Console 获取的验证码 */}
        <meta name="google-site-verification" content="dP__OoA8yBYTvTxYu_CS4PhyJuN1f3kQ4D8vJDF41XU" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
