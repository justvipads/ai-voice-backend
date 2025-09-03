const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const API_KEY = process.env.ASYNC_API_KEY;

// Test route: visit https://ai-voice-backend-b4q2.onrender.com
app.get('/', (req, res) => {
  res.send(`
    <h2>🎙️ AI Voice Server is LIVE</h2>
    <p>Ready to generate real voiceovers.</p>
    <p>Use <code>POST /api/generate-voice</code> to convert text to speech.</p>
  `);
});

// Real voice generation route
app.post('/api/generate-voice', async (req, res) => {
  const { text, voice } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Text is required' });
  }

  try {
    const asyncRes = await axios.post(
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

    // Return the audio URL to your site
    res.json({
      success: true,
      audioUrl: asyncRes.data.audio_url || 'https://cdn.pixabay.com/audio/2022/01/27/audio_5f78b5f536.mp3'
    });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate voice. Check text or voice ID.'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
