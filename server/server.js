require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema and Model ---
const highScoreSchema = new mongoose.Schema({
  levelScores: {
    type: Map,
    of: new mongoose.Schema({
      imageScores: {
        type: Map,
        of: {
          moves: { type: Number, default: 0 }
        }
      }
    }, { _id: false })
  }
}, { timestamps: true });

const HighScore = mongoose.model('HighScore', highScoreSchema);

// --- Utility: Initialize levelScores map ---
function initializeLevelScores() {
  return new Map(Object.entries({
    veryEasy: { imageScores: new Map() },
    easy: { imageScores: new Map() },
    medium: { imageScores: new Map() },
    hard: { imageScores: new Map() }
  }));
}

// --- GET High Scores ---
app.get('/api/highscores', async (req, res) => {
  try {
    let scores = await HighScore.findOne();

    if (!scores) {
      console.log('Creating new high score document.');
      scores = new HighScore({ levelScores: initializeLevelScores() });
      await scores.save();
    }

    if (!(scores.levelScores instanceof Map)) {
      console.warn('Fixing malformed levelScores structure.');
      scores.levelScores = initializeLevelScores();
    }

    const scoresToSend = { levelScores: {} };
    for (let [level, data] of scores.levelScores.entries()) {
      scoresToSend.levelScores[level] = {};
      if (data && data.imageScores instanceof Map) {
        for (let [img, val] of data.imageScores.entries()) {
          scoresToSend.levelScores[level][img] = {
            moves: val?.moves || 0
          };
        }
      }
    }

    res.json(scoresToSend);
  } catch (error) {
    console.error("Error fetching high scores:", error);
    res.status(500).json({ message: 'Server error fetching high scores' });
  }
});

// --- POST New High Score ---
app.post('/api/highscores', async (req, res) => {
  const { level, imageName, moves } = req.body;
  const sanitizedImageName = imageName.replace(/\./g, '_');

  if (!level || !imageName || typeof moves !== 'number' || moves <= 0) {
    return res.status(400).json({ message: 'Level, image name, and positive moves are required.' });
  }

  const validLevels = ['veryEasy', 'easy', 'medium', 'hard'];
  if (!validLevels.includes(level)) {
    return res.status(400).json({ message: 'Invalid level provided.' });
  }

  try {
    let scores = await HighScore.findOne();

    if (!scores) {
      console.log('Creating new high score document.');
      scores = new HighScore({ levelScores: initializeLevelScores() });
      await scores.save();
    }

    if (!(scores.levelScores instanceof Map)) {
      scores.levelScores = initializeLevelScores();
      scores.markModified('levelScores');
    }

    if (!scores.levelScores.has(level)) {
      scores.levelScores.set(level, { imageScores: new Map() });
      scores.markModified('levelScores');
    }

    let levelData = scores.levelScores.get(level);
    if (!levelData || !(levelData.imageScores instanceof Map)) {
      levelData = { imageScores: new Map() };
      scores.levelScores.set(level, levelData);
      scores.markModified('levelScores');
    }

    const currentScore = levelData.imageScores.get(sanitizedImageName)?.moves || Infinity;

    if (moves < currentScore) {
      levelData.imageScores.set(sanitizedImageName, { moves });
      scores.markModified('levelScores');
      await scores.save();
      return res.status(200).json({
        message: `New high score for ${level} level on ${imageName}: ${moves} moves.`,
        isNewHighScore: true
      });
    }

    res.status(200).json({
      message: `Score not high enough for ${level} level on ${imageName}.`,
      isNewHighScore: false
    });

  } catch (error) {
    console.error("Error updating high score:", error);
    res.status(500).json({ message: 'Server error updating high score' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
