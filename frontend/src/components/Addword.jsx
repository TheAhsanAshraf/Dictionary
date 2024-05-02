import React, { useState } from 'react';
import axios from 'axios';
import './AddWord.css'; // Import CSS file for styling

function AddWord() {
  // State variables to store form input values and messages
  const [Word, setWord] = useState('');
  const [Category, setCategory] = useState('SomaliToEnglish'); // Default category
  const [Grammar, setGrammar] = useState('');
  const [Meaning, setMeaning] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      // Send POST request to backend API to add a new word
      const response = await axios.post('http://localhost:8000/words', {
        Word,
        Category,
        Grammar,
        Meaning,
      });
      console.log(response.data); // Log the response data
      // Clear form input fields after successful submission
      setWord('');
      setCategory('SomaliToEnglish'); // Reset category to default
      setGrammar('');
      setMeaning('');
      // Set success message
      setSuccessMessage('Word added successfully!');
      // Clear error message
      setErrorMessage('');
      // Redirect to admin page after a short delay (optional)
      setTimeout(() => {
        window.location.href = '/admin'; // Redirect to admin page
      }, 1500); // Redirect after 1.5 seconds (adjust delay as needed)
    } catch (error) {
      console.error('Error adding word:', error);
      // Set error message
      setErrorMessage('Failed to add word. Please try again.');
      // Clear success message
      setSuccessMessage('');
    }
  };

  return (
    <div className="add-word-container">
      <h2>Add New Word</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Word"
            value={Word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={Category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="SomaliToEnglish">Somali To English</option>
            <option value="EnglishToSomali">English To Somali</option>
            <option value="SomaliToSomali">Somali To Somali</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Grammar"
            value={Grammar}
            onChange={(e) => setGrammar(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Meaning"
            value={Meaning}
            onChange={(e) => setMeaning(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Word</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default AddWord;
