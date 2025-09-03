const express = require('express');
const app = express();

app.use(express.json());

// Test route — visit: https://ai-voice-backend-b4q2.onrender.com
app.get('/', (req, res) => {
  res.send('✅ Server is LIVE! Use POST /api/generate-voice');
});

// Test API route
app.post('/api/generate-voice', (req, res) => {
  console.log('Received:', req.body);
  res.json({
    success: true,
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-soap-bubble-pop-2093.mp3',
    message: 'Test voice working!'
  });
});

// Fallback for wrong routes
app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
