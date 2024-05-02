// models/Word.js

const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    Word: { type: String, required: true },
    Category: { type: String, enum: ['SomaliToEnglish', 'EnglishToSomali', 'SomaliToSomali'], required: true },
    Grammar: String,
    Meaning: String
});

module.exports = mongoose.model('Word', wordSchema);
