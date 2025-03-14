require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Verbindung
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schema für Bewertungen
const RatingSchema = new mongoose.Schema({
    stars: Number,
    comment: String,
    date: { type: Date, default: Date.now }
});
const Rating = mongoose.model('Rating', RatingSchema);

// Route zum Speichern einer Bewertung
app.post('/api/ratings', async (req, res) => {
    try {
        const { stars, comment } = req.body;
        const newRating = new Rating({ stars, comment });
        await newRating.save();
        res.status(201).json(newRating);
    } catch (error) {
        res.status(500).json({ error: "Fehler beim Speichern der Bewertung" });
    }
});

// Route zum Abrufen aller Bewertungen
app.get('/api/ratings', async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ error: "Fehler beim Abrufen der Bewertungen" });
    }
});

app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
