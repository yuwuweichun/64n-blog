import { visit } from 'unist-util-visit';

// 自定义 Callouts 插件
// 支持语法: :::note 以及 >[!note]
const CALLOUT_TYPES = new Set([
  'note',
  'warning',
  'danger',
  'success',
  'tip',
  'question',
]);

const CALLOUT_TITLES = {
  note: 'Note',
  warning: 'Warning',
  danger: 'Danger',
  success: 'Success',
  tip: 'Tip',
  question: 'Question',
};

export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      const type = normalizeCalloutType(node.name);

      if (!type) {
        return;
      }

      const title = node.children[0]?.children?.[0]?.value || CALLOUT_TITLES[type];

      applyCalloutData(node, type);

      // 添加标题
      node.children.unshift(createCalloutTitle(title));
    });

    visit(tree, 'blockquote', (node) => {
      const callout = readBlockquoteCallout(node);

      if (!callout) {
        return;
      }

      applyCalloutData(node, callout.type);
      node.children.unshift(createCalloutTitle(callout.title));
    });
  };
}

function normalizeCalloutType(name) {
  const type = String(name || '').toLowerCase();

  return CALLOUT_TYPES.has(type) ? type : null;
}

function applyCalloutData(node, type) {
  const data = node.data || (node.data = {});

  data.hName = 'div';
  data.hProperties = {
    className: ['callout', `callout-${type}`],
  };
}

function createCalloutTitle(title) {
  return {
    type: 'paragraph',
    data: {
      hName: 'div',
      hProperties: { className: ['callout-title'] },
    },
    children: [{ type: 'text', value: title }],
  };
}

function readBlockquoteCallout(node) {
  const firstChild = node.children[0];

  if (firstChild?.type !== 'paragraph') {
    return null;
  }

  const firstText = firstChild.children[0];

  if (firstText?.type !== 'text') {
    return null;
  }

  const match = firstText.value.match(/^\s*\[!([a-zA-Z][\w-]*)\]([^\r\n]*)\r?\n?/);
  const type = normalizeCalloutType(match?.[1]);

  if (!type) {
    return null;
  }

  const title = match[2].trim() || CALLOUT_TITLES[type];
  firstText.value = firstText.value.slice(match[0].length);

  if (!firstText.value) {
    firstChild.children.shift();
  }

  if (firstChild.children.length === 0) {
    node.children.shift();
  }

  return { type, title };
}
