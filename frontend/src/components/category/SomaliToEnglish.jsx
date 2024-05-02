import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SomaliToEnglish.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SomaliToEnglish({ category }) {
  const [words, setWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    axios.get(`http://localhost:8000/words/category/${category}`)
      .then(response => {
        const fetchedWords = response.data.words;
        if (Array.isArray(fetchedWords)) {
          const sortedWords = fetchedWords.sort((a, b) => (a.Word || '').localeCompare(b.Word || ''));
          setWords(sortedWords);
          setLoading(false); // Set loading to false after fetching words
        } else {
          console.error('Invalid data format: Words data is not an array');
        }
      })
      .catch(error => {
        console.error('Error fetching words:', error);
      });
  }, [category]);
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    const foundWord = words.find(word => word && word.Word && word.Word.toLowerCase() === searchTerm.toLowerCase());
    if (foundWord) {
      setSearchResult(foundWord);
    } else {
      setSearchResult('Word not found');
    }
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  const filteredWords = words.filter(word => word && word.Word && word.Word.toLowerCase().startsWith(selectedLetter.toLowerCase()));

  return (
    <div className="somali-to-english-container">
      <h1 className="title">{category}</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </button>
        {loading && <div>Loading...</div>} {/* Loading indicator */}
        {searchResult && (
          <div className="search-result">
            {typeof searchResult === 'object' ? (
              <>
                <h2>{searchResult.Word}</h2>
                <p><strong>Grammar:</strong> {searchResult.Grammar}</p>
                <p><strong>Meaning:</strong> {searchResult.Meaning}</p>
              </>
            ) : (
              <p>{searchResult}</p>
            )}
          </div>
        )}
      </div>
      <div className="word-group-container">
        <div className="letters-container">
          {Array.from(Array(26), (e, i) => String.fromCharCode(65 + i)).map(letter => (
            <span key={letter} className={selectedLetter === letter ? 'selected-letter' : 'letter'} onClick={() => handleLetterClick(letter)}>{letter}</span>
          ))}
        </div>
        <ul className="word-list">
          {filteredWords.map(word => (
            <li key={word._id} className="word-list-item">
              <Link to={`/word/${word._id}`} className="word-link">{word.Word}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SomaliToEnglish;
