import React from 'react';
import './Toolbar.css';

interface ToolbarProps {
  onInsert: (before: string, after?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsert }) => {
  const tools = [
    { label: 'Bold', icon: 'B', before: '**', after: '**', shortcut: 'Ctrl+B' },
    { label: 'Italic', icon: 'I', before: '*', after: '*', shortcut: 'Ctrl+I' },
    { label: 'Code', icon: '</>', before: '`', after: '`', shortcut: 'Ctrl+`' },
    { label: 'Code Block', icon: '{ }', before: '```\n', after: '\n```', shortcut: 'Ctrl+Shift+C' },
    { label: 'Link', icon: '🔗', before: '[', after: '](url)', shortcut: 'Ctrl+K' },
    { label: 'Image', icon: '🖼️', before: '![', after: '](url)', shortcut: 'Ctrl+Shift+I' },
    { label: 'Heading 1', icon: 'H1', before: '# ', after: '', shortcut: 'Ctrl+1' },
    { label: 'Heading 2', icon: 'H2', before: '## ', after: '', shortcut: 'Ctrl+2' },
    { label: 'Heading 3', icon: 'H3', before: '### ', after: '', shortcut: 'Ctrl+3' },
    { label: 'Bullet List', icon: '•', before: '- ', after: '', shortcut: 'Ctrl+Shift+8' },
    { label: 'Numbered List', icon: '1.', before: '1. ', after: '', shortcut: 'Ctrl+Shift+7' },
    { label: 'Quote', icon: '"', before: '> ', after: '', shortcut: 'Ctrl+Shift+Q' },
    { label: 'Divider', icon: '—', before: '\n---\n', after: '', shortcut: 'Ctrl+Shift+H' },
  ];

  return (
    <div className="editor-toolbar">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          className="toolbar-btn"
          onClick={() => onInsert(tool.before, tool.after)}
          title={`${tool.label} (${tool.shortcut})`}
        >
          <span className="toolbar-icon">{tool.icon}</span>
          <span className="toolbar-label">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};
