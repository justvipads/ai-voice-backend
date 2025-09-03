const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ Parse JSON bodies
app.use(express.json());

// 🔰 Homepage — test with: https://ai-voice-backend-b4q2.onrender.com
app.get('/', (req, res) => {
  res.send(`
    <h2>🎙️ AI Voice Server</h2>
    <p><strong>Status:</strong> Live and ready</p>
    <p>Send a <code>POST /api/generate-voice</code> request with:</p>
    <pre>
{
  "text": "Hello, world!",
  "voice": "male1"
}
    </pre>
  `);
});

// ✅ POST route for voice generation
app.post('/api/generate-voice', async (req, res) => {
  const { text, voice } = req.body;

  // ✅ Log for debugging
  console.log('Received request:', { text, voice });

  // ✅ Validate text
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      error: 'Invalid or missing text',
      message: 'You must provide valid text to convert to speech.'
    });
  }

  try {
    // 🌐 Call Async.AI API
    const asyncResponse = await axios.post(
      'https://api.async.ai/v1/speech',
      {
        text: text.trim(),
        voice_id: voice || 'male1',
        output_format: 'mp3'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.ASYNC_API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'json' // Expect JSON response
      }
    );

    // ✅ Assume Async.AI returns { audio_url: "https://..." }
    const audioUrl = asyncResponse.data.audio_url;

    if (!audioUrl) {
      throw new Error('No audio URL returned from Async.AI');
    }

    // ✅ Send back to frontend
    return res.json({ success: true, audioUrl });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate voice.',
      error: error.message
    });
  }
});

// 🚨 Catch-all for wrong routes
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found. Use POST /api/generate-voice'
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`👉 Test at: https://ai-voice-backend-b4q2.onrender.com`);
});
