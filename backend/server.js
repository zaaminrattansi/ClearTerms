// Gemini backend proxy for ClearTerms Chrome Extension
const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Use node-fetch in a way compatible with CommonJS and ESM
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  console.log('Received /summarize request with text length:', text ? text.length : 0);
  if (!text) return res.status(400).json({ error: 'Missing text' });

  const prompt = `Give me a TLDR of the following Terms of Service or Privacy Policy in plain English. Highlight any potentially risky or unusual clauses (such as data sharing, forced arbitration, license to content, no refunds, etc). Format the output as a bullet list very short and concise. do not say anything else, just give me the list of the main risks and issues you find. Do not include any other text or commentary.\n\nCONTENT:\n${text}`;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (e) {
    console.error('Gemini API error:', e);
    res.status(500).json({ error: 'Gemini API error', details: e.message });
  }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
