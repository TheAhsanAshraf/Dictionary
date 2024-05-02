import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "./Home.css";

function Home() {
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
        window.location.href = `http://localhost:3000/word/${data.words[0]._id}`;
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

  return (
    <div className="home">
      <div className="bg"></div>
      <div className="header">
        <h3>Experience Somalia's own Dictionary App</h3>
        <p>Clear and simple meaning from language experts.</p>
      </div>
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
        {loading && <p></p>}
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
      <div className="category-boxes">
        <Link to="/category/SomaliToEnglish" className="category-box">
          Somali to English
        </Link>
        <Link to="/category/EnglishToSomali" className="category-box">
          English to Somali
        </Link>
        <Link to="/category/SomaliToSomali" className="category-box">
          Somali to Somali
        </Link>
      </div>
    </div>
  );
}

export default Home;
