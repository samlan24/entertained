// src/components/ArtistInfo.jsx
import React from 'react';

const ArtistInfo = ({ artistInfo }) => {
  return (
    <div className="sidebar">
      {artistInfo && (
        <div>
          <h2>Artist Info</h2>
          {artistInfo.image_url && <img src={artistInfo.image_url} alt={`${artistInfo.name}`} style={{ width: '100%', height: 'auto' }} />}
          <p><strong>Name:</strong> {artistInfo.name}</p>
          <p><strong>Bio:</strong> {artistInfo.bio}</p>
          <h3>Top Tracks</h3>
          <ul>
            {artistInfo.top_tracks.map((track, index) => (
              <li key={index}>
                {track.name} {track.preview_url && <a href={track.preview_url} target="_blank" rel="noopener noreferrer">Preview</a>}
              </li>
            ))}
          </ul>
          {artistInfo.social_media && (
            <p><strong>Social Media:</strong> <a href={artistInfo.social_media} target="_blank" rel="noopener noreferrer">Link</a></p>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistInfo;