import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSquare, faUser } from '@fortawesome/free-solid-svg-icons';
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="top-row">
        <Link to="/" className="nav-link">
          <FontAwesomeIcon icon={faSquare} className="nav-icon" />
          <span className="madimi-one-regular">SEMOLINA DICTIONARY</span>
        </Link>
      </div>
      <div className="bottom-row">
        <Link to="/wordbank" className="nav-link">
          <FontAwesomeIcon icon={faList} className="nav-icon" />
          Word Bank
        </Link>
        <Link to="/auth" className="nav-link">
          <FontAwesomeIcon icon={faUser} className="nav-icon" />
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
