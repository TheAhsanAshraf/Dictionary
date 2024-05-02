const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const wordRoutes = require('./routes/route'); // Import the route file
const Word = require('./models/word');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/search/:key', async (req, res) => {
  try {
      const searchKeyword = req.params.key.trim(); // Use req.params.key to get the search keyword and trim any leading/trailing spaces
      console.log('Search keyword:', searchKeyword); // Log the search keyword
      if (!searchKeyword) {
          return res.status(400).json({ success: false, message: 'Search keyword is required' });
      }
  
      // Perform case-insensitive search for words containing the search keyword
      const words = await Word.find({ Word: { $regex: new RegExp(searchKeyword, 'i') } });
  
      console.log('Search results:', words); // Log the search results
  
      if (words.length === 0) {
          return res.status(404).json({ success: false, message: 'No matching words found' });
      }
  
      res.status(200).json({ success: true, words });
  } catch (error) {
      console.error('Error searching words:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/search/:category/:key', async (req, res) => {
  try {
    const category = req.params.category; // Extract the category from the URL
    const searchKeyword = req.params.key; // Use req.params.key to get the search keyword
    
    if (!category || !searchKeyword) {
      return res.status(400).json({ success: false, message: 'Category and search keyword are required' });
    }

    // Perform case-insensitive search for words containing the search keyword within the specified category
    const words = await Word.find({ 
        Category: category, 
        Word: { $regex: new RegExp(searchKeyword, 'i') } 
    });

    console.log('Search results:', words); // Log the search results

    res.status(200).json({ success: true, words });
  } catch (error) {
    console.error('Error searching words:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/words/category/:category', async (req, res) => {
  try {
    const category = req.params.category; // Extract the category from the URL
    
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    // Retrieve all words belonging to the specified category
    const words = await Word.find({ Category: category });

    console.log('Words in category:', words); // Log the words
    
    res.status(200).json({ success: true, words });
  } catch (error) {
    console.error('Error retrieving words:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGODB;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB, { useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Use the wordRoutes
app.use('/words', wordRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
