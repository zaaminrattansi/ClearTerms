import React, { ReactNode } from 'react';

export type SidebarProps = {
  onSummarize: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
};

const sidebarStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  width: '380px',
  height: '100vh',
  background: '#fff',
  boxShadow: '-2px 0 16px rgba(0,0,0,0.18)',
  zIndex: 999999,
  padding: '2rem 1.5rem 1.5rem 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  fontFamily: 'system-ui, Arial, sans-serif',
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  fontSize: '1.25rem',
  background: '#0a84ff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 600,
  marginBottom: '0.5rem',
  transition: 'background 0.2s',
};

const summaryAreaStyle: React.CSSProperties = {
  background: '#f7f8fa',
  borderRadius: '8px',
  padding: '1rem',
  maxHeight: '55vh',
  overflowY: 'auto',
  fontSize: '1.08rem',
  lineHeight: 1.6,
  color: '#222',
  wordBreak: 'break-word',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
};

export const Sidebar: React.FC<SidebarProps> = ({ onSummarize, onClose, children }) => {
  // Find summary or error message in children
  let summaryContent = null;
  React.Children.forEach(children, child => {
    if (React.isValidElement(child) && child.type === 'div') {
      summaryContent = child;
    }
  });
  return (
    <div style={sidebarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontWeight: 600, fontSize: '2rem', margin: 0, marginBottom: '0.5rem' }}>ClearTerms Summary</h2>
        {onClose && (
          <button
            aria-label="Close sidebar"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              color: '#888',
              cursor: 'pointer',
              marginLeft: '8px',
              marginTop: '-8px',
              padding: 0,
              lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        )}
      </div>
      <button style={buttonStyle} onClick={onSummarize}>Summarize This Page</button>
      <div style={summaryAreaStyle}>{summaryContent}</div>
    </div>
  );
};