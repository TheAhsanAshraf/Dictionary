import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './WordBank.css'; // Import the CSS file

function WordBank() {
  const [words, setWords] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState('A'); // Default selected letter
  const [loading, setLoading] = useState(true); // State variable to track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/words');
        const sortedWords = response.data.words.sort((a, b) => (a.Word || '').localeCompare(b.Word || ''));
        setWords(sortedWords);
        setLoading(false); // Set loading to false after fetching words
      } catch (error) {
        console.error('Error fetching words:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchData();
  }, []);

  // Function to group words by their first letter
  const groupWordsByFirstLetter = (words) => {
    const groupedWords = {};
    words.forEach(word => {
      if (word && word.Word) {
        const firstLetter = word.Word.charAt(0).toUpperCase();
        if (!groupedWords[firstLetter]) {
          groupedWords[firstLetter] = [];
        }
        groupedWords[firstLetter].push(word);
      } else {
        console.error('Invalid word format:', word);
      }
    });
    return groupedWords;
  };

  const groupedWords = groupWordsByFirstLetter(words);

  // Function to handle letter selection
  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="word-bank-container">
      <h1 className="word-bank-title">Word Bank</h1>
      {loading ? ( // Show loading indicator if loading is true
        <div>Loading...</div>
      ) : (
        <>
          <div className="letters-container">
            {Array.from(Array(26), (e, i) => String.fromCharCode(65 + i)).map(letter => (
              <span key={letter} className={selectedLetter === letter ? 'selected-letter' : 'letter'} onClick={() => handleLetterClick(letter)}>{letter}</span>
            ))}
          </div>
          <ul className="word-list">
            {groupedWords[selectedLetter]?.map(word => (
              <li key={word._id} className="word-list-item">
                <Link to={`/word/${word._id}`} className="word-link">{word.Word}</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default WordBank;
