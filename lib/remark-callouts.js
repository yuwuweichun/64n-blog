import { visit } from 'unist-util-visit';
import { h } from 'hastscript';

// 自定义 Callouts 插件
// 支持语法: :::note, :::warning, :::danger, :::success
export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      if (!['note', 'warning', 'danger', 'success', 'tip'].includes(node.name)) {
        return;
      }

      const data = node.data || (node.data = {});
      const title = node.children[0]?.children?.[0]?.value || 
                   node.name.charAt(0).toUpperCase() + node.name.slice(1);

      // 转换为自定义 HTML 结构
      data.hName = 'div';
      data.hProperties = {
        className: ['callout', `callout-${node.name}`]
      };

      // 添加标题
      node.children.unshift({
        type: 'paragraph',
        data: {
          hName: 'div',
          hProperties: { className: ['callout-title'] }
        },
        children: [{ type: 'text', value: title }]
      });
    });
  };
}
