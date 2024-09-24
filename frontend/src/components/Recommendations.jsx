import React, { useEffect } from 'react';
import * as d3 from 'd3';

const RecommendationGraph = ({ artists, onArtistClick }) => {
  useEffect(() => {
    const svg = d3.select("#graph");
    const width = window.innerWidth;
    const height = 600;

    svg.attr("width", width).attr("height", height).selectAll("*").remove(); // Clear previous content

    // Define the graph with a central node and connected nodes based on recommendations
    const nodes = artists.map(artist => ({ id: artist })); // Assuming 'artists' is an array of artist names
    const links = []; // Create links based on some logic (e.g., similarity scores)

    // Example links creation based on some dummy data (you may want to fetch this dynamically)
    nodes.forEach((node, index) => {
      if (index > 0) {
        links.push({ source: nodes[0].id, target: node.id, distance: Math.random() * 100 + 50 }); // Random distance
      }
    });

    // Initialize force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(150)) // Increase the distance between linked nodes
      .force("charge", d3.forceManyBody().strength(-500)) // Adjust the repulsion force
      .force("center", d3.forceCenter(width / 2, height / 2))
      .alphaTarget(0) // Reduce the alpha target to stabilize the simulation
      .alphaDecay(0.05); // Control the cooling rate

    // Run the simulation for a fixed number of iterations to stabilize the layout
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    // Create nodes (circles and labels)
    const node = svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node clickable") // Add 'clickable' class
      .on("click", (event, d) => onArtistClick(d.id)); // Handle click event

    node.append("circle")
      .attr("r", 5) // Adjust the radius to make the circles smaller
      .attr("fill", "lightblue");

    node.append("text")
      .attr("x", 10)
      .attr("y", 3)
      .attr("font-size", "16px") // Increase the font size
      .attr("fill", "black")
      .text(d => d.id);

    // Update positions on the initial tick only
    simulation.on("end", () => {
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Stop the simulation after stabilizing
    simulation.stop();
  }, [artists, onArtistClick]); // Run effect whenever 'artists' or 'onArtistClick' prop changes

  return <svg id="graph"></svg>;
};

export default RecommendationGraph;