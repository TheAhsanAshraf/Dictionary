import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ViewWord.css'; // Import CSS file for styling

function ViewWord() {
  const [word, setWord] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/words/${id}`)
      .then(response => {
        const { Word, Grammar, Meaning } = response.data.word;
        setWord({ Word, Grammar, Meaning });
      })
      .catch(error => {
        console.error('Error fetching word:', error);
      });
  }, [id]);

  if (!word) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-word-container">
      <h1>{word.Word}</h1>
      {word.Grammar && (
        <p><strong>Grammar:</strong> {word.Grammar}</p>
      )}
      <p><strong>Meaning:</strong> {word.Meaning}</p>
    </div>
  );
}

export default ViewWord;
