import React from 'react';
import { formatMarkdownContent } from '../../utils/markdownUtils';

const MarkdownPreview = ({ content, className = "" }) => {
  return (
    <div className={`text-white font-mono text-base leading-relaxed ${className}`}>
      {formatMarkdownContent(content)}
    </div>
  );
};

export default MarkdownPreview;