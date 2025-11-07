require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// ===== MongoDB Connection =====
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

// ===== Schema & Model =====
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model('Video', videoSchema);

// ===== POST API =====
app.post('/api/videos', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title)
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });

    const video = new Video({ title, description });
    await video.save();

    res.status(201).json({
      success: true,
      message: 'Video added successfully!',
      data: video,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== GET API =====
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
