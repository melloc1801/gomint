import { Descendant, Text } from 'slate';

import { ImageElement } from './types';
import React from 'react';
import escapeHtml from 'escape-html';

const serialize = (node: Descendant) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text) || '&nbsp;';

    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    return string;
  }
  const getChildrenString = (): string => {
    return node.children.map((n) => serialize(n)).join('');
  };

  switch (node.type) {
    case 'numberedList':
      return `<ol style="padding-left: 40px; margin: 1em 0; list-style: decimal">${getChildrenString()}</ol>`;
    case 'bulletedList':
      return `<ul style="padding-left: 40px; margin: 1em 0; list-style: disc">${getChildrenString()}</ul>`;
    case 'list-item':
      return `<li ${
        node.align ? `style="text-align: ${node.align};"` : ''
      }">${getChildrenString()}</li>`;
    case 'paragraph':
      return `<p ${
        node.align ? `style="text-align: ${node.align};"` : ''
      }">${getChildrenString()}</p>`;
    case 'image':
      return `<img class="block w-full h-full rounded" src="${(node as ImageElement).url}"/>`;
    default:
      return '';
  }
};

function createMarkup(value: string) {
  return { __html: value };
}

interface IReadonlyEditor {
  value: Descendant[];
}

export const ReadonlyEditor: React.FC<IReadonlyEditor> = ({ value }) => {
  const str = value.reduce((accum, current) => {
    return (accum += serialize(current));
  }, '');

  const html = createMarkup(str);
  return (
    <div>
      <div dangerouslySetInnerHTML={html} />
    </div>
  );
};
