import { useEffect } from 'react';

export default function UIFrame({ children }) {
  useEffect(() => {
    // 固定使用 CLI 主题
    document.body.classList.add('cli');
  }, []);

  return <>{children}</>;
}
