// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [artist, setArtist] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (artist.trim()) {
      const encodedArtist = encodeURIComponent(artist).replace(/%20/g, '+');
      navigate(`/music/${encodedArtist}`);
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/music">Music</Link>
        </li>
        <li className="navbar-item">
          <Link to="/movies">Movies</Link>
        </li>
        <li className="navbar-item">
          <Link to="/blog">Blog</Link>
        </li>
      </ul>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </nav>
  );
};

export default Navbar;