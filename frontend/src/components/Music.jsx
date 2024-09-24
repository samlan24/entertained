// src/components/Music.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import Recommendations from './Recommendations';
import ArtistInfo from './ArtistInfo';

const Music = () => {
  const [artist, setArtist] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [artistInfo, setArtistInfo] = useState(null);

  const handleSearch = async (searchArtist) => {
    try {
      const response = await axios.get(`http://localhost:5000/music/recommendations?artist=${searchArtist}`);
      setRecommendations(response.data.artists);
      fetchArtistInfo(searchArtist);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleArtistClick = (clickedArtist) => {
    setArtist(clickedArtist);
    handleSearch(clickedArtist);
  };

  const fetchArtistInfo = async (artistName) => {
    try {
      const response = await axios.get(`http://localhost:5000/music/artist-info?artist=${artistName}`);
      setArtistInfo(response.data);
    } catch (error) {
      console.error('Error fetching artist info:', error);
    }
  };

  return (
    <div className="container">
      <ArtistInfo artistInfo={artistInfo} />
      <div className="main-content">
        <h1>Music Recommendations</h1>
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Enter artist name"
        />
        <button onClick={() => handleSearch(artist)}>Search</button>
        <Recommendations recommendations={recommendations} handleArtistClick={handleArtistClick} />
      </div>
    </div>
  );
};

export default Music;