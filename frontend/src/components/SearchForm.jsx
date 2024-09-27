import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchForm.css'; // Add styles for better presentation

const SearchForm = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchType, setSearchType] = useState('artist'); // New state for search type
  const [inputPlaceholder, setInputPlaceholder] = useState(placeholder); // New state for placeholder

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() && searchType === 'artist') {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/music/artist-suggestions?query=${query}`);
          setSuggestions(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, searchType]);

  useEffect(() => {
    // Update the placeholder based on the search type
    if (searchType === 'artist') {
      setInputPlaceholder('Enter artist name');
    } else if (searchType === 'song') {
      setInputPlaceholder('Enter song name');
    }
  }, [searchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchType);
      clearInputAndSuggestions(); // Clear input and suggestions after search
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]); // Clear suggestions after selection
    onSearch(suggestion.name, searchType);
    clearInputAndSuggestions(); // Clear input and suggestions after selection
  };

  // Function to clear the input and suggestions
  const clearInputAndSuggestions = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-form-container">
      <form onSubmit={handleSearch} className="search-form">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-type-dropdown"
        >
          <option value="artist">Artist</option>
          <option value="song">Song</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={inputPlaceholder}
          className="search-input"
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
  );
};

export default SearchForm;