/// <reference types="chrome" />

chrome.runtime.onMessage.addListener((message: { type: string; text?: string }, sender: chrome.runtime.MessageSender, sendResponse: (response: { summary: string }) => void) => {
  if (message.type === 'SUMMARIZE_TOS') {
    console.log('[ClearTerms] Received SUMMARIZE_TOS message', message);
    // Call backend server instead of Gemini API directly
    fetch('http://localhost:3000/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: message.text })
    })
      .then(response => response.json())
      .then(data => {
        // Extract summary from backend response
        const summary = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text
          ? data.candidates[0].content.parts[0].text
          : (data.error?.message || 'No summary available.');
        sendResponse({ summary });
      })
      .catch(e => {
        console.error('[ClearTerms] Error summarizing:', e);
        sendResponse({ summary: 'Error summarizing: ' + (e?.message || e) });
      });
    return true;
  }
  return false;
});