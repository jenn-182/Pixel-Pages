import React from 'react';
import { formatMarkdownContent } from '../../utils/markdownUtils';

const MarkdownPreview = ({ content }) => {
  return (
    <div className="text-white font-mono text-base leading-relaxed">
      {formatMarkdownContent(content)}
    </div>
  );
};

export default MarkdownPreview;