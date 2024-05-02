import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ViewWord.css'; // Import CSS file for styling

function WordAdmin() {
  const [word, setWord] = useState(null);
  const [wordDeleted, setWordDeleted] = useState(false);
  const [updateFormVisible, setUpdateFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    Word: '',
    Grammar: '',
    Meaning: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8000/words/${id}`)
      .then(response => {
        const { Word, Grammar, Meaning } = response.data.word;
        setWord({ Word, Grammar, Meaning });
        setFormData({ Word, Grammar, Meaning: Meaning.join(', ') }); // Set initial form data
      })
      .catch(error => {
        console.error('Error fetching word:', error);
      });
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/words/${id}`);
      setWordDeleted(true);
      setSuccessMessage('Word deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting word:', error);
      setErrorMessage('Failed to delete word. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/words/${id}`, formData);
      // Refresh word details after update
      axios.get(`http://localhost:8000/words/${id}`)
        .then(response => {
          const { Word, Grammar, Meaning } = response.data.word;
          setWord({ Word, Grammar, Meaning });
          setUpdateFormVisible(false); // Hide update form after successful update
          setSuccessMessage('Word updated successfully!');
          setErrorMessage('');
        });
    } catch (error) {
      console.error('Error updating word:', error);
      setErrorMessage('Failed to update word. Please try again.');
      setSuccessMessage('');
    }
  };

  if (!word) {
    return <div>Loading...</div>;
  }

  if (wordDeleted) {
    return <div className="deleted-message">Word no longer exists</div>;
  }
  
  return (
    <div className="view-word-container">
      <h1>{word.Word}</h1>
      {word.Grammar && (
        <p><strong>Grammar:</strong> {word.Grammar}</p>
      )}
      <p><strong>Meaning:</strong> {word.Meaning}</p>

      {!updateFormVisible && (
        <div>
          <button onClick={() => setUpdateFormVisible(true)}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      {updateFormVisible && (
        <div className="update-form-container">
          <input type="text" name="Word" value={formData.Word} onChange={handleChange} placeholder="Word" />
          <input type="text" name="Grammar" value={formData.Grammar} onChange={handleChange} placeholder="Grammar" />
          <input type="text" name="Meaning" value={formData.Meaning} onChange={handleChange} placeholder="Meaning" />
          <button onClick={handleUpdate}>Submit</button>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {successMessage && (
        <div>
          <Link to="/admin">Go back to Admin page</Link>
        </div>
      )}
    </div>
  );
}

export default WordAdmin;
