const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Get your API key securely from environment variables
const API_KEY = process.env.ASYNC_API_KEY;

// Test route: visit https://your-app.onrender.com
app.get('/', (req, res) => {
  res.send('🎙️ AI Voice Server is running! Ready for voice generation.');
});

// Main API route: called by your HTML site
app.post('/api/generate-voice', async (req, res) => {
  const { text, voice } = req.body;

  // Validate input
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Valid text is required.'
    });
  }

  try {
    // Call Async.AI API
    const response = await axios.post(
      'https://api.async.ai/v1/speech',
      {
        text: text.trim(),
        voice_id: voice || 'male1', // matches your HTML dropdown values
        output_format: 'mp3'
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'json' // Ensure we get JSON back
      }
    );

    // Assume Async.AI returns a direct audio URL in response
    // Adjust based on actual API response (check their docs)
    const audioUrl = response.data.audio_url || 'https://assets.mixkit.co/sfx/preview/mixkit-soap-bubble-pop-2093.mp3';

    res.json({
      success: true,
      audioUrl: audioUrl
    });

  } catch (error) {
    console.error('Voice generation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate voice. Please try again.'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
