import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './RecommendationGraph.css';

const RecommendationGraph = ({ artists, onArtistClick }) => {
  const [graphData, setGraphData] = useState(null);

  // Set recommendations when artists prop changes
  useEffect(() => {
    if (artists && artists.length > 0) {
      setGraphData(artists);  // Set graph data when artists is available
    }
  }, [artists]);

  useEffect(() => {
    if (!graphData) return;  // Do nothing if there's no graph data

    const svg = d3.select("#graph");
    const width = 900;
    const height = 600;

    svg.attr("width", width).attr("height", height).selectAll("*").remove(); // Clear previous content

    // Define the graph with a central node and connected nodes based on recommendations
    const nodes = graphData.map(artist => ({ id: artist })); // Assuming 'artists' is an array of artist names
    const links = [];

    // Example links creation based on some dummy data (adjust as necessary)
    nodes.forEach((node, index) => {
      if (index > 0) {
        links.push({ source: nodes[0].id, target: node.id, distance: Math.random() * 100 + 50 }); // Random distance
      }
    });

    // Initialize force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.distance))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create nodes (circles and labels)
    const node = svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node clickable") // Add 'clickable' class
      .on("click", (event, d) => onArtistClick(d.id)); // Handle click event

    node.append("circle")
      .attr("r", 5)
      .attr("fill", "lightblue");

    node.append("text")
      .attr("x", 10)
      .attr("y", 3)
      .attr("font-size", "16px")
      .attr("fill", "black")
      .text(d => d.id);

    // Update positions on each tick
    simulation.on("tick", () => {
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

  }, [graphData, onArtistClick]); // Run effect whenever 'graphData' changes

  return <svg id="graph"></svg>;
};

export default RecommendationGraph;
