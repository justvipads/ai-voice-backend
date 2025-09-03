const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Get your API key from Render's environment variables
const API_KEY = process.env.ASYNC_API_KEY;

// Test route: visit https://your-app.onrender.com
app.get('/', (req, res) => {
  res.send(`
    <h2>🎙️ AI Voice Server is Running!</h2>
    <p>Ready to generate voiceovers.</p>
    <p>Use <code>POST /api/generate-voice</code> to convert text to speech.</p>
  `);
});

// Main API route: receives text and voice from your site
app.post('/api/generate-voice', async (req, res) => {
  const { text, voice } = req.body;

  // Validate input
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      error: 'Invalid text',
      message: 'Please provide valid text to convert to speech.'
    });
  }

  try {
    // Call Async.AI API to generate voice
    const response = await axios.post(
      'https://api.async.ai/v1/speech',
      {
        text: text.trim(),
        voice_id: voice || 'male1',       // matches your HTML dropdown
        output_format: 'mp3'               // or 'wav', depending on support
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'json' // Expect JSON response from Async.AI
      }
    );

    // Assume Async.AI returns { audio_url: "https://..." }
    const audioUrl = response.data.audio_url;

    if (!audioUrl) {
      return res.status(500).json({
        success: false,
        message: 'No audio URL returned from Async.AI'
      });
    }

    // Send the audio URL back to your website
    res.json({
      success: true,
      audioUrl: audioUrl
    });

  } catch (error) {
    console.error('Async.AI Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Voice generation failed. Check API key or voice ID.'
    });
  }
});

// Fallback for any other route
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found. Use POST /api/generate-voice'
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
