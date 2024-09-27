import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './fontAwesome';
import Home from './components/Home';
import Music from './components/Music';
import Blog from './components/Blog';
import Navbar from './components/Navbar';

import SongSearch from './components/SongSearch'; // Import the new SongSearch component

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music/:artist" element={<Music />} />

        <Route path="/blog" element={<Blog />} />

        <Route path="/song-search" element={<SongSearch />} /> {/* Add route for SongSearch component */}
      </Routes>
    </Router>
  );
};

export default App;