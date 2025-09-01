import React from 'react';
import { formatMarkdownContent } from '../../utils/markdownUtils';

const MarkdownPreview = ({ content }) => {
  return <div>{formatMarkdownContent(content)}</div>;
};

export default MarkdownPreview;