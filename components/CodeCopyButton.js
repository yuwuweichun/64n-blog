import { useEffect } from 'react';
import styles from './CodeCopyButton.module.css';

export default function CodeCopyButton() {
  useEffect(() => {
    // 为所有代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      
      // 避免重复添加
      if (pre.querySelector(`.${styles.copyButton}`)) {
        return;
      }
      
      // 获取代码语言
      const language = Array.from(codeBlock.classList)
        .find(cls => cls.startsWith('language-'))
        ?.replace('language-', '') || 'code';
      
      // 创建复制按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.className = styles.copyButtonContainer;
      
      // 创建语言标签
      const langLabel = document.createElement('span');
      langLabel.className = styles.langLabel;
      langLabel.textContent = language;
      buttonContainer.appendChild(langLabel);
      
      // 创建复制按钮
      const button = document.createElement('button');
      button.className = styles.copyButton;
      button.setAttribute('aria-label', '复制代码');
      button.innerHTML = `
        <svg class="${styles.copyIcon}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
        </svg>
        <span class="${styles.copyText}">复制</span>
      `;
      
      buttonContainer.appendChild(button);
      pre.style.position = 'relative';
      pre.insertBefore(buttonContainer, pre.firstChild);
      
      // 复制功能
      button.addEventListener('click', async () => {
        const code = codeBlock.textContent;
        
        try {
          await navigator.clipboard.writeText(code);
          
          // 显示成功状态
          button.innerHTML = `
            <svg class="${styles.successIcon}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" fill="currentColor"/>
            </svg>
            <span class="${styles.copyText}">已复制</span>
          `;
          button.classList.add(styles.copied);
          
          // 2秒后恢复
          setTimeout(() => {
            button.innerHTML = `
              <svg class="${styles.copyIcon}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
              </svg>
              <span class="${styles.copyText}">复制</span>
            `;
            button.classList.remove(styles.copied);
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
          // 显示错误状态
          button.innerHTML = `
            <span class="${styles.copyText}">复制失败</span>
          `;
          setTimeout(() => {
            button.innerHTML = `
              <svg class="${styles.copyIcon}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
              </svg>
              <span class="${styles.copyText}">复制</span>
            `;
          }, 2000);
        }
      });
    });
  }, []);
  
  return null;
}
