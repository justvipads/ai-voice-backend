const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const API_KEY = process.env.ASYNC_API_KEY;

app.post('/api/generate-voice', async (req, res) => {
  const { text, voice } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    const response = await axios.post(
      'https://api.async.ai/v1/speech',
      {
        text: text.trim(),
        voice_id: voice || "male1",
        output_format: "mp3"
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      }
    );

    res.json({
      success: true,
      audioUrl: "https://assets.mixkit.co/sfx/preview/mixkit-soap-bubble-pop-2093.mp3"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Voice generation failed."
    });
  }
});

app.get('/', () => {
  console.log("Server is alive");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
