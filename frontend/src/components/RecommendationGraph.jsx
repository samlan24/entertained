import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './RecommendationGraph.css';

const RecommendationGraph = ({ artists, onArtistClick }) => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    if (!artists || artists.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 900;
    const height = 600;

    svg.attr("width", width).attr("height", height).selectAll("*").remove(); // Clear previous content

    // Define the graph with a central node and connected nodes based on recommendations
    const centralNode = { id: artists[0] }; // Assuming the first artist is the central node
    const nodes = artists.map(artist => ({ id: artist })); // Assuming 'artists' is an array of artist names
    const links = nodes.slice(1).map(node => ({
      source: centralNode.id,
      target: node.id,
    distance: Math.random() * 100 + 50 // Random distance
    }));

    // Example links creation based on some dummy data (adjust as necessary)
    nodes.forEach((node, index) => {
      if (index > 0) {
        links.push({ source: nodes[0].id, target: node.id, distance: Math.random() * 100 + 50 }); // Random distance
      }
    });

    // Initialize force simulation
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(d => d.distance))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2));
    }

    const simulation = simulationRef.current;
    simulation.nodes(nodes);
    simulation.force("link").links(links);

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

    simulation.alpha(1).restart(); // Restart the simulation with new data

  }, [artists, onArtistClick]); // Run effect whenever 'artists' changes

  return <svg ref={svgRef}></svg>;
};

export default RecommendationGraph;