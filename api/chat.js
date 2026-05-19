const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        mod
cat > package.json << 'EOF'
{
  "name": "akira-proxy",
  "version": "1.0.0",
  "private": true,
  "main": "api/chat.js",
  "scripts": {
    "start": "node api/chat.js"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
