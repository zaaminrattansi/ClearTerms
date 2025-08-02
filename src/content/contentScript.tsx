/// <reference types="chrome" />
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Sidebar } from './ui/Sidebar';
import './ui/styles.css';
import { extractVisibleText } from '../utils/extractText';

const urlPatterns = [/terms/i, /privacy/i, /terms-of-service/i, /privacy-policy/i];
const legalPhrases = [
  /we reserve/i,
  /your data/i,
  /arbitration/i,
  /no refund/i,
  /license to/i
];

function matchesLegalPage() {
  const urlMatch = urlPatterns.some((pat) => pat.test(window.location.pathname));
  if (!urlMatch) return false;
  const bodyText = document.body.innerText;
  return legalPhrases.some((pat) => pat.test(bodyText));
}

const LoadingSpinner = () => (
  <div className="clearterms-loading">
    <div className="clearterms-spinner"></div>
    <p>Analyzing document...</p>
  </div>
);

const formatSummary = (summary: string) => {
  // Check if it's an error message
  if (summary.startsWith('Error') || summary.includes('No Gemini API key')) {
    return (
      <div className="clearterms-error">
        <span className="clearterms-error-icon">⚠️</span>
        <p>{summary}</p>
      </div>
    );
  }

  // Split by newlines and format as bullet points
  const points = summary.split('\n').filter(point => point.trim());
  
  return (
    <div className="clearterms-summary">
      {points.map((point, index) => {
        // Remove leading '*' and whitespace
        let clean = point.trim().replace(/^\*\s*/, '');
        clean = clean.replace(/^•\s*/, '');
        // Bold markdown headings (e.g. **Title**: rest)
        const match = clean.match(/^\*\*(.+?)\*\*\s*:?\s*(.*)$/);
        let content;
        if (match) {
          // Remove any leading colons from the rest, then add a single colon if there is content
          const rest = match[2].replace(/^:+\s*/, '');
          content = <><b>{match[1]}</b>{rest ? ': ' + rest : ''}</>;
        } else {
          content = clean;
        }
        const isRisk = clean.toLowerCase().includes('risk') || 
                      clean.toLowerCase().includes('warning') ||
                      clean.toLowerCase().includes('important');
        return (
          <div 
            key={index} 
            className={`clearterms-point${isRisk ? ' clearterms-risk' : ''}`}
            tabIndex={0}
          >
            • {content}
          </div>
        );
      })}
    </div>
  );
};

const SidebarContainer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSummarize = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    
    const text = extractVisibleText();
    chrome.runtime.sendMessage(
      { type: 'SUMMARIZE_TOS', text }, 
      (response: { summary: string }) => {
        setLoading(false);
        if (response?.summary) {
          setSummary(response.summary);
        } else {
          setError('Failed to generate summary. Please try again.');
        }
      }
    );
  };

  return (
    <Sidebar onSummarize={onSummarize} onClose={onClose}>
      {loading ? <LoadingSpinner /> : null}
      {error ? (
        <div className="clearterms-error">
          <span className="clearterms-error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      ) : null}
      {summary ? formatSummary(summary) : null}
    </Sidebar>
  );
};

function injectSidebar() {
  if (document.getElementById('clearterms-sidebar-root')) return;
  const root = document.createElement('div');
  root.id = 'clearterms-sidebar-root';
  document.body.appendChild(root);
  const handleClose = () => {
    root.remove();
  };
  createRoot(root).render(<SidebarContainer onClose={handleClose} />);
}

if (matchesLegalPage()) {
  injectSidebar();
}