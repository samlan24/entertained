import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faYoutube, faSpotify } from '@fortawesome/free-brands-svg-icons'; // Import YouTube icon


// Mapping of song titles and artists to YouTube embed video URLs
const videoLinks = {
  "hello by adele": "https://www.youtube.com/embed/YQHsXMglC9A",
  // Add more mappings as necessary
};

const SongDetails = ({ songDetails }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false); // State to control video display

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set initial volume to 20%
    }
  }, [songDetails]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  if (!songDetails) return null;

  // Create a key for the video link mapping
  const videoKey = `${songDetails.name.toLowerCase()} by ${songDetails.artist.toLowerCase()}`;
  const youtubeEmbedUrl = videoLinks[videoKey] || ''; // Default to an empty string if not found

  return (
    <div className="song-details">
      <h2>{songDetails.name}</h2>
      {songDetails.image_url && (
        <img src={songDetails.image_url} alt={`${songDetails.name} album cover`} className="song-image" />
      )}
      <p><strong>Artist:</strong> {songDetails.artist}</p>
      <p><strong>Album:</strong> {songDetails.album}</p>
      <p><strong>Release Date:</strong> {songDetails.release_date}</p>
      {songDetails.preview_url && (
        <div>
          <button onClick={handlePlayPause} style={{ fontSize: '2rem', padding: '10px', margin: '10px' }}>
            <FontAwesomeIcon icon={playing ? faPause : faSpotify} style={{ color: 'green' }} />
          </button>
          <audio ref={audioRef} src={songDetails.preview_url} />
          {youtubeEmbedUrl && (
            <button onClick={() => setShowVideo(true)} style={{ fontSize: '2rem', padding: '10px', margin: '10px' }}>
              <FontAwesomeIcon icon={faYoutube} style={{ color: '#FF0000' }} />
            </button>
          )}
        </div>
      )}

      {/* Modal for YouTube Video */}
      {showVideo && (
        <div className="video-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowVideo(false)}>&times;</span>
            <iframe
              width="560"
              height="315"
              src={youtubeEmbedUrl}
              title={`${songDetails.name} by ${songDetails.artist}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongDetails;
