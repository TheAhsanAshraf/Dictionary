import React, { useState } from 'react';
import './Authorization.css'; // Import CSS file for styling
import { Navigate } from 'react-router-dom'; // Import Navigate component

const Authorization = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (username === 'semoline' && password === 'semoline1234') {
      setIsLoggedIn(true);
    } else {
      setError('Invalid username or password');
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}> {/* Handle form submission */}
        <div className="form-group">
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button> {/* Use type="submit" for login button */}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Authorization;
