import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [artist, setArtist] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (artist.trim()) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/music/artist-suggestions?query=${artist}`);
          setSuggestions(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [artist]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (artist.trim()) {
      const encodedArtist = encodeURIComponent(artist).replace(/%20/g, '+');
      navigate(`/music/${encodedArtist}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setArtist(suggestion.name);
    setSuggestions([]);
    const encodedArtist = encodeURIComponent(suggestion.name).replace(/%20/g, '+');
    navigate(`/music/${encodedArtist}`);
  };

  return (
    <div className="home-container">
      <h1>Find similar artists to your favorite artists</h1>
      <div className="form-wrapper">
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
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;