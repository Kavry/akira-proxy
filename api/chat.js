const express = require('express');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.get('/debug', (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY || 'NON TROVATA';
  const elKey = process.env.ELEVENLABS_API_KEY || 'NON TROVATA';
  res.json({ anthropic_length: key.length, elevenlabs_length: elKey.length });
});

// Chat con Anthropic
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
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: system || '',
        messages
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Text-to-speech con ElevenLabs
app.post('/api/speak', async (req, res) => {
  const { text, voice_id } = req.body;
  const vid = voice_id || 'Dzlw1nIlAqiOOW6J7qo1';
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.82,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });
    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err });
    }
    const audioBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('AKIRA proxy running on port ' + PORT));
