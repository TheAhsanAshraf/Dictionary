import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './AdminComponent.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


function AdminComponent() {
  const [selectedWordId, setSelectedWordId] = useState(localStorage.getItem('selectedWordId') || null); // State to store selected word ID
  const [word, setWord] = useState(null); // State to store word details
  const [words, setWords] = useState(JSON.parse(localStorage.getItem('words')) || []);

  const [showViewWord, setShowViewWord] = useState(false); // State to toggle the visibility of ViewWord

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        return;
      }
      setLoading(true);
      const response = await fetch(`http://localhost:8000/search/${searchTerm}`);
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResult(data.words);
      setError(null);
      setSearchClicked(true);
      setLoading(false);
      if (data.words.length > 0) {
        window.location.href = `http://localhost:3000/wordUpdate/${data.words[0]._id}`;
      }
    } catch (error) {
      console.error('Error searching word:', error);
      setError('Failed to fetch search results');
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchClicked(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('selectedWordId')) {
      localStorage.setItem('selectedWordId', null);
    }
    if (!localStorage.getItem('words')) {
      localStorage.setItem('words', JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/words')
      .then(response => {
        const sortedWords = response.data.words.sort((a, b) => (a.Word || '').localeCompare(b.Word || ''));
        setWords(sortedWords);
        localStorage.setItem('words', JSON.stringify(sortedWords));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching words:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedWordId) {
      axios.get(`http://localhost:8000/words/${selectedWordId}`)
        .then(response => {
          const { Word, Grammar, Meaning } = response.data.word;
          setWord({ Word, Grammar, Meaning });
        })
        .catch(error => {
          console.error('Error fetching word:', error);
        });
    }
  }, [selectedWordId]);

  const handleWordClick = (wordId) => {
    setSelectedWordId(wordId); // Set selected word ID
    setShowViewWord(true); // Show the ViewWord component when a word is clicked in the Word Bank
    localStorage.setItem('selectedWordId', wordId);
  };

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

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Dashboard</h2>
      <div className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Please enter a word to search"
            value={searchTerm}
            onChange={handleChange}
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </button>
        </div>

        {error && <p>{error}</p>}
        {!loading && searchResult.length > 0 && !searchClicked && (
          <div>
            <h2>Search Result:</h2>
            <ul>
              {searchResult.map(word => (
                <li key={word._id}>
                  <Link to={`/word/${word._id}`}>{word.word}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!loading && searchResult.length === 0 && searchClicked && (
          <p>Word not found</p>
        )}
      </div>
      <div className="action-buttons">
        <Link to="/add" className="nav-link">
          <button className="add-button">Add Word</button>
        </Link>
      </div>
      {showViewWord && word && (
        <div className="view-word-container">
          <h1>{word.Word}</h1>
          {word.Grammar && <p><strong>Grammar:</strong> {word.Grammar}</p>}
          <p><strong>Meaning:</strong> {word.Meaning}</p>
          <div>
            <Link to={`/wordUpdate/${selectedWordId}`} className="edit-button">
              Edit <FontAwesomeIcon icon={faEdit} />
            </Link>
            <button className="delete-button">
              Delete <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        </div>
      )}
      <WordBank onWordClick={handleWordClick} selectedWordId={selectedWordId} groupedWords={groupedWords} loading={loading} />
    </div>
  );
}

function WordBank({ onWordClick, selectedWordId, groupedWords, loading }) {
  const [selectedLetter, setSelectedLetter] = useState('A'); // Default selected letter

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
  };

  return (
    <div className="word-bank-container">
      {loading && <p>Loading...</p>}
      <h1 className="word-bank-title">Word Bank</h1>
      <div className="letters-container">
        {Array.from(Array(26), (e, i) => String.fromCharCode(65 + i)).map(letter => (
          <span key={letter} className={selectedLetter === letter ? 'selected-letter' : 'letter'} onClick={() => handleLetterClick(letter)}>{letter}</span>
        ))}
      </div>
      <ul className="word-list">
        {groupedWords[selectedLetter]?.map(word => (
          <li key={word._id} className="word-list-item">
            <Link to={`/wordUpdate/${word._id}`} className={selectedWordId === word._id ? 'selected-word' : 'word-link'} onClick={() => onWordClick(word._id)}>{word.Word}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminComponent;
