// routes/wordRoutes.js

const express = require('express');
const router = express.Router();
const wordController = require('../controller/controller');
const Word = require('../models/word');

// Middleware to find word by ID
router.param('id', async (req, res, next, id) => {
    try {
        const word = await Word.findById(id);
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }
        res.word = word;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// routes/wordRoutes.js

// Routes
router.post('/', wordController.createWord);
router.get('/', wordController.getAllWords);
router.get('/:id', wordController.getWord);

router.put('/:id', wordController.updateWord);
router.delete('/:id', wordController.deleteWord);

router.get('/search/:category/:key', wordController.searchWordsByCategory);

module.exports = router;

