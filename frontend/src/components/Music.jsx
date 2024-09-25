import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import RecommendationGraph from './RecommendationGraph'; // Import the new component
import ArtistInfo from './ArtistInfo';

const Music = () => {
  const { artist } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [artistInfo, setArtistInfo] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [recommendationsFetched, setRecommendationsFetched] = useState(false); // Flag to track if recommendations have been fetched
  const navigate = useNavigate();

  useEffect(() => {
    if (artist) {
      if (!recommendationsFetched) {
        handleSearch(artist);
      } else {
        fetchArtistInfo(artist);
      }
    }
  }, [artist]);

  const handleSearch = async (searchArtist) => {
    try {
      const response = await axios.get(`http://localhost:5000/music/recommendations?artist=${searchArtist}`);
      setRecommendations(response.data.artists);
      setRecommendationsFetched(true); // Set the flag to true after fetching recommendations
      fetchArtistInfo(searchArtist); // Fetch artist info after setting recommendations
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchArtistInfo = async (artistName) => {
    try {
      const response = await axios.get(`http://localhost:5000/music/artist-info?artist=${artistName}`);
      setArtistInfo(response.data);
    } catch (error) {
      console.error('Error fetching artist info:', error);
    }
  };

  const handleTrackClick = (trackUrl) => {
    setCurrentTrack(trackUrl);
  };

  const handleArtistClick = (clickedArtist) => {
    const encodedArtist = encodeURIComponent(clickedArtist).replace(/%20/g, '+');
    navigate(`/music/${encodedArtist}`);
    setRecommendationsFetched(false); // Reset the flag when navigating to a new artist
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchArtist = e.target.elements.artist.value.trim();
    if (searchArtist) {
      navigate(`/music/${encodeURIComponent(searchArtist).replace(/%20/g, '+')}`);
      setRecommendationsFetched(false); // Reset the flag when a new search is made
    }
  };

  return (
    <div className="container">
      {!artist ? (
        <div>
          <h1>Search for an artist</h1>
          <form onSubmit={handleSearchSubmit}>
            <input type="text" name="artist" placeholder="Enter artist name" />
            <button type="submit">Search</button>
          </form>
        </div>
      ) : (
        <>
          <ArtistInfo artistInfo={artistInfo} />
          <div className="main-content">
            <h1 className='music-heading'>Similar Artists</h1>
            <RecommendationGraph
              artists={recommendations}
              onArtistClick={handleArtistClick} // Pass the click handler
            />
          </div>
          {currentTrack && (
            <audio className="media-player" controls>
              <source src={currentTrack} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </>
      )}
    </div>
  );
};

export default Music;