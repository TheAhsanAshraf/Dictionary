const Word = require('../models/word');
const ApiFeatures = require("../utils/apifeatures");

// Create a new word
exports.createWord = async (req, res) => {
    try {
        const newWord = new Word(req.body);
        await newWord.save();
        res.status(201).json(newWord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all words
exports.getAllWords = async (req, res) => {
    const apiFeature = new ApiFeatures(Word.find(), req.query).search();
    
        const words = await apiFeature.query;
        

        res.status(200).json({ success: true,words, });
      
};

exports.getWord = async (req, res) => {
    
     
        const word = await Word.findById(req.params.id);
        if(!word)
        {
         return res.status(500),json({
             success:false,
             message: "word not found"
         })
        }
        return res.status(200).json({
            success: true,
            word
        });
};

// Update a word
exports.updateWord = async (req, res) => {
    try {
        let word = await Word.findById(req.params.id);

        if (!word) {
            return res.status(404).json({
                success: false,
                message: "Word not found"
            });
        }

        word = await Word.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            word
        });
    } catch (error) {
        console.error("Error updating word:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



// controller.js

exports.searchWordsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const searchKeyword = req.params.key;

        if (!category || !searchKeyword) {
            return res.status(400).json({ success: false, message: 'Category and search keyword are required' });
        }

        const words = await Word.find({ 
            Category: category, 
            $or: [
                { Word: { $regex: new RegExp(searchKeyword, 'i') } },
                { Grammar: { $regex: new RegExp(searchKeyword, 'i') } },
                { Meaning: { $regex: new RegExp(searchKeyword, 'i') } }
            ]
        });

       

        res.status(200).json({ success: true, words });
    } catch (error) {
        console.error('Error searching words:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



// Delete a word
exports.deleteWord = async (req, res) => {
    try {
        const deletedWord = await Word.findOneAndDelete({ _id: req.params.id });
        
        if (!deletedWord) {
            return res.status(404).json({
                success: false,
                message: "Word not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Word deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting word:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
