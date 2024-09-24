// src/components/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
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
    <div className="home-container">
      <h1>Find similar artists to your favorite artists</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
          className="home-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default Home;