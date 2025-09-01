import React from 'react';

// Helper function to insert formatting at cursor position
export const insertFormatting = (textarea, content, before, after = '', placeholder = 'text') => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = content.substring(start, end);
  const replacement = selectedText || placeholder;
  
  const newContent = 
    content.substring(0, start) + 
    before + replacement + after + 
    content.substring(end);
  
  return {
    newContent,
    newCursorPosition: start + before.length + replacement.length
  };
};

// Handle keyboard shortcuts for formatting
export const handleFormattingKeyDown = (e, textarea, content, onContentChange) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'b':
        e.preventDefault();
        const boldResult = insertFormatting(textarea, content, '**', '**', 'bold text');
        onContentChange(boldResult.newContent);
        setTimeout(() => {
          textarea.setSelectionRange(boldResult.newCursorPosition, boldResult.newCursorPosition);
        }, 0);
        break;
      case 'i':
        e.preventDefault();
        const italicResult = insertFormatting(textarea, content, '*', '*', 'italic text');
        onContentChange(italicResult.newContent);
        setTimeout(() => {
          textarea.setSelectionRange(italicResult.newCursorPosition, italicResult.newCursorPosition);
        }, 0);
        break;
      case 'u':
        e.preventDefault();
        const underlineResult = insertFormatting(textarea, content, '<u>', '</u>', 'underlined text');
        onContentChange(underlineResult.newContent);
        setTimeout(() => {
          textarea.setSelectionRange(underlineResult.newCursorPosition, underlineResult.newCursorPosition);
        }, 0);
        break;
      case '`':
        e.preventDefault();
        const codeResult = insertFormatting(textarea, content, '`', '`', 'code');
        onContentChange(codeResult.newContent);
        setTimeout(() => {
          textarea.setSelectionRange(codeResult.newCursorPosition, codeResult.newCursorPosition);
        }, 0);
        break;
    }
  }
};

// Format inline text with markdown styling
export const formatInlineText = (text) => {
  if (!text) return '';
  
  let currentText = text;
  
  // Process bold text
  currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    return `BOLD_START${content}BOLD_END`;
  });
  
  // Process italic text
  currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
    return `ITALIC_START${content}ITALIC_END`;
  });
  
  // Process underline text
  currentText = currentText.replace(/<u>(.*?)<\/u>/g, (match, content) => {
    return `UNDERLINE_START${content}UNDERLINE_END`;
  });
  
  // Process code text
  currentText = currentText.replace(/`(.*?)`/g, (match, content) => {
    return `CODE_START${content}CODE_END`;
  });
  
  // Process highlight text
  currentText = currentText.replace(/==(.*?)==/g, (match, content) => {
    return `HIGHLIGHT_START${content}HIGHLIGHT_END`;
  });
  
  // Split by our markers and render
  const segments = currentText.split(/(BOLD_START|BOLD_END|ITALIC_START|ITALIC_END|UNDERLINE_START|UNDERLINE_END|CODE_START|CODE_END|HIGHLIGHT_START|HIGHLIGHT_END)/);
  
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  let isCode = false;
  let isHighlight = false;
  
  return segments.map((segment, index) => {
    switch (segment) {
      case 'BOLD_START':
        isBold = true;
        return null;
      case 'BOLD_END':
        isBold = false;
        return null;
      case 'ITALIC_START':
        isItalic = true;
        return null;
      case 'ITALIC_END':
        isItalic = false;
        return null;
      case 'UNDERLINE_START':
        isUnderline = true;
        return null;
      case 'UNDERLINE_END':
        isUnderline = false;
        return null;
      case 'CODE_START':
        isCode = true;
        return null;
      case 'CODE_END':
        isCode = false;
        return null;
      case 'HIGHLIGHT_START':
        isHighlight = true;
        return null;
      case 'HIGHLIGHT_END':
        isHighlight = false;
        return null;
      default:
        if (segment === '') return null;
        
        let className = '';
        let style = {};
        
        if (isBold) className += ' font-bold text-cyan-400';
        if (isItalic) className += ' italic text-purple-400';
        if (isUnderline) {
          className += ' underline';
          style.textDecoration = 'underline';
        }
        if (isCode) className += ' bg-gray-800 text-green-400 px-2 py-1 rounded font-mono text-sm';
        if (isHighlight) {
          className += ' bg-pink-300 text-black px-1 rounded';
          style.backgroundColor = '#f9a8d4'; // Light pink color
          style.color = '#000000';
        }
        
        return (
          <span key={index} className={className} style={style}>
            {segment}
          </span>
        );
    }
  }).filter(Boolean);
};

// Format content with block-level markdown - Updated for better live rendering
export const formatMarkdownContent = (text) => {
  if (!text) return '';
  
  return text.split('\n').map((line, index) => {
    // Headers
    if (line.startsWith('# ')) {
      return (
        <div key={index} className="text-2xl font-bold text-cyan-400 mb-4 border-b border-cyan-400 pb-2">
          {formatInlineText(line.substring(2))}
        </div>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <div key={index} className="text-xl font-bold text-cyan-400 mb-3">
          {formatInlineText(line.substring(3))}
        </div>
      );
    }
    if (line.startsWith('### ')) {
      return (
        <div key={index} className="text-lg font-bold text-cyan-400 mb-2">
          {formatInlineText(line.substring(4))}
        </div>
      );
    }
    
    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <div key={index} className="flex items-start mb-1">
          <span className="text-cyan-400 mr-2 flex-shrink-0">•</span>
          <span className="flex-1">{formatInlineText(line.substring(2))}</span>
        </div>
      );
    }
    
    // Numbered lists
    if (/^\d+\.\s/.test(line)) {
      const match = line.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        return (
          <div key={index} className="flex items-start mb-1">
            <span className="text-cyan-400 mr-2 flex-shrink-0">{match[1]}.</span>
            <span className="flex-1">{formatInlineText(match[2])}</span>
          </div>
        );
      }
    }
    
    // Quotes
    if (line.startsWith('> ')) {
      return (
        <div key={index} className="border-l-4 border-cyan-400 pl-4 italic text-gray-300 my-2">
          {formatInlineText(line.substring(2))}
        </div>
      );
    }
    
    // Empty lines
    if (line.trim() === '') {
      return <div key={index} className="h-6" />;
    }
    
    // Regular paragraphs
    return (
      <div key={index} className="mb-4 leading-relaxed">
        {formatInlineText(line)}
      </div>
    );
  });
};