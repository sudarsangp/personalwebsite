import './main.css';
import {select, event} from 'd3-selection';
import {forceSimulation, forceLink, forceManyBody, forceCenter} from 'd3-force';
import {drag} from 'd3-drag';

'use strict';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered:', registration);
    }).catch(registrationError => {
      console.log('SW registration failed', registrationError)
    });
  });
}

var graph = {
  "nodes": [
    {"id": "Day at Work", "group": 1, "size": 3},
    {"id": "Grocery Inventory", "group": 1, "size": 3},
    {"id": "Grocery Deals", "group": 1, "size": 2},
    {"id": "Developer Hireable", "group": 1, "size": 1},
    {"id": "Blinkr Extension", "group": 1, "size": 1},
    {"id": "HTML", "group": 2, "size": 3},
    {"id": "CSS", "group": 2, "size": 3},
    {"id": "Javascript", "group": 2, "size": 3},
    {"id": "Android", "group": 2, "size": 3},
    {"id": "Tensorflow", "group": 2, "size": 1},
    {"id": "Google Cloud", "group": 2, "size": 2},
    {"id": "Firebase", "group": 2, "size": 2},
    {"id": "React", "group": 2, "size": 1}
  ],
  "links": [
    {"source": "HTML", "target": "Day at Work", "value": 16},
    {"source": "HTML", "target": "Grocery Deals", "value": 16},
    {"source": "HTML", "target": "Developer Hireable", "value": 9},
    {"source": "HTML", "target": "Blinkr Extension", "value": 4},
    {"source": "CSS", "target": "Day at Work", "value": 16},
    {"source": "CSS", "target": "Grocery Deals", "value": 16},
    {"source": "CSS", "target": "Developer Hireable", "value": 9},
    {"source": "CSS", "target": "Blinkr Extension", "value": 4},
    {"source": "Javascript", "target": "Day at Work", "value": 16},
    {"source": "Javascript", "target": "Grocery Deals", "value": 16},
    {"source": "Javascript", "target": "Developer Hireable", "value": 9},
    {"source": "Javascript", "target": "Blinkr Extension", "value": 4},
    {"source": "Android", "target": "Grocery Inventory", "value": 4},
    {"source": "Tensorflow", "target": "Grocery Inventory", "value": 4},
    {"source": "Google Cloud", "target": "Grocery Inventory", "value": 4},
    {"source": "Firebase", "target": "Grocery Deals", "value": 9},
    {"source": "Firebase", "target": "Developer Hireable", "value": 4},
    {"source": "Grocery Inventory", "target": "Grocery Deals", "value": 16},
    {"source": "React", "target": "Day at Work", "value": 16}
  ]
};

var svg = select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var simulation = forceSimulation()
  .force("link", forceLink().id(function(d) { return d.id; }).distance(function() { return 50;}))
  .force("charge", forceManyBody().strength(function() {return -200;}))
  .force("center", forceCenter(width / 2, height / 2));

var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line")
  .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

var gdata = svg.append("g").attr("class", "nodes").selectAll("g")
  .data(graph.nodes)
  .enter().append("g");

var node =  gdata.append("circle")
  .attr("r", function(d) {return d.size * 5;})
  .attr("fill", function(d) { return d.group === 1 ? '#3F51B5' : '#FF80AB'; })
  .call(drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  gdata.append("text")
    .style("font-size","14px")
    .text(function(d) { return d.id; });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    gdata.attr("transform", function(d) {
      return 'translate(' + [d.x, d.y] + ')';
    });
  }

function dragstarted(d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

window.addEventListener('load', () => {
  const customEmbedEl = document.querySelector('.custom-embed');
  customEmbedEl.setAttribute('src', customEmbedEl.getAttribute('data-src'));

  const youtubeEmbeds = document.querySelectorAll('.youtube-embed');
  for (let i=0; i<youtubeEmbeds.length; i++) {
    const youtubeEl = youtubeEmbeds[i];
    youtubeEl.setAttribute('src', youtubeEl.getAttribute('data-src'));
  }
});
