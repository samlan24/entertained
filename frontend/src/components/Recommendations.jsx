import React from 'react';

const Recommendations = ({ recommendations, handleArtistClick }) => {
  return (
    <div className="recommendations">
      <h2>Recommendations</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index} onClick={() => handleArtistClick(rec)}>
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;