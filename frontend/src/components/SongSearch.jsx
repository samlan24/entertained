import React, { useState } from 'react';
import axios from 'axios';
import SongDetails from './SongDetails';
import './SongSearch.css'; // Import the CSS file for styling

const SongSearch = () => {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [songDetails, setSongDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        const encodedQuery = encodeURIComponent(query);
        console.log(`Fetching recommendations for song: ${encodedQuery}`);
        const response = await axios.get(`http://localhost:5000/music/similar-songs?song=${encodedQuery}`);
        console.log('Response:', response.data);

        // Set song details and recommendations
        setSongDetails(response.data.song_details);
        setRecommendations(response.data.similar_songs || []); // Ensure recommendations is an array
        console.log('Updated Recommendations:', response.data.similar_songs || []);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching song recommendations:', error);
        setError('Failed to fetch song recommendations. Please try again later.');
        setRecommendations([]); // Clear recommendations on error
      }
    }
  };

  return (
    <div className="song-search-container">
      <h1>Search for Song Recommendations</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter song name"
        />
        <button type="submit">Search</button>
      </form>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="results-container">
          <div className="sidebar">
            <SongDetails songDetails={songDetails} />
          </div>
          <div className="main-content">
            <h2>Similar Songs</h2>
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}>
                  {rec.name} by {rec.artist}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongSearch;