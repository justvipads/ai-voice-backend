const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const API_KEY = process.env.ASYNC_API_KEY;

// ✅ Add this: Homepage route
app.get('/', (req, res) => {
  res.send('🎙️ AI Voice Server is LIVE! Send POST to /api/generate-voice');
});

// ✅ Your voice generation route
app.post('/api/generate-voice', async (req, res) => {
  const { text, voice } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const response = await axios.post(
      'https://api.async.ai/v1/speech',
      {
        text: text.trim(),
        voice_id: voice || 'male1',
        output_format: 'mp3'
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      }
    );

    // If Async.AI returns audio_url in response.data
    const audioUrl = response.data.audio_url || 'https://assets.mixkit.co/sfx/preview/mixkit-soap-bubble-pop-2093.mp3';

    res.json({ success: true, audioUrl });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Voice generation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
