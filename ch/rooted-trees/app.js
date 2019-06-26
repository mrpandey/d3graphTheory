"use strict";

var w = univSvgWidth ? univSvgWidth : 616,
  h = univSvgHeight ? univSvgHeight : 400,
  rad = 10;

//node ids are in order in which nodes come in existence
var nodes = [
  { id: 1, fx: w / 2, fy: rad + 5, color: 0 },
  { id: 2, color: 1 },
  { id: 3, color: 1 },
  { id: 4, color: 2 },
  { id: 5, color: 2 },
  { id: 6, color: 2 },
  { id: 7, color: 2 }
];

//source is parent, target is child
var links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
  { source: 1, target: 3 },
  { source: 2, target: 4 },
  { source: 2, target: 5 },
  { source: 2, target: 6 }
];

//universal width and height let index.htm control svg dimensions when needed
var lastNodeId = nodes.length,
  maxDepth = 2;

positionNodes();

var svg = d3
  .select("#svg-wrap")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var edges = svg.append("g").selectAll(".edge");

var vertices = svg.append("g").selectAll(".vertex");

var force = d3
  .forceSimulation()
  .force(
    "charge",
    d3
      .forceManyBody()
      .strength(-100)
      .distanceMax(h / 3)
  )
  .force(
    "link",
    d3
      .forceLink()
      .distance(30)
      .strength(1)
  )
  .force("x", d3.forceX(w / 2).strength(0.02))
  .force("y", d3.forceY(h).strength(0.02))
  .on("tick", tick);

force.nodes(nodes);
force.force("link").links(links);
addChilds();
addDepth(nodes[0], 0);

d3.select("#clear-graph").on("click", clearGraph);

//empties the graph
function clearGraph() {
  nodes.splice(1);
  links.splice(0);
  nodes[0].childs.splice(0);
  lastNodeId = 1;
  maxDepth = 0;
  restart();
  showGraphLatex();
}

function positionNodes() {
  for (let i = 1; i < nodes.length; i++) {
    nodes[i].x = nodes[i].y = (i * w) / lastNodeId;
  }
}

function addChilds() {
  nodes.forEach(function(d) {
    d.childs = [];
    d.parentLink = null;
  });
  links.forEach(function(l) {
    l.source.childs.push(l.target);
    l.target.parentLink = l;
  });
}

function addDepth(nd, d) {
  nd.depth = d;
  nd.childs.forEach(function(c) {
    addDepth(c, d + 1);
  });
}

function calcTreeHeight() {
  maxDepth = 0;
  nodes.forEach(function(d) {
    maxDepth = Math.max(maxDepth, d.depth);
  });
}

//update the simulation
function tick() {
  edges
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  vertices
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
}

function addNode(d) {
  var e = d3.event;
  //node shouldn't be added when draging the nodes
  if (e.ctrlKey) return;
  if (e.button == 0) {
    var coords = d3.mouse(e.currentTarget);
    var newNode = {
      x: coords[0],
      y: coords[1],
      id: ++lastNodeId,
      childs: [],
      depth: d.depth + 1
    };
    var newLink = { source: d, target: newNode };
    newNode.parentLink = newLink;
    if (d.color == 1) newNode.color = 2;
    else newNode.color = 1;
    d.childs.push(newNode);
    nodes.push(newNode);
    links.push(newLink);
    maxDepth = Math.max(maxDepth, newNode.depth);
    restart();
    showGraphLatex();
  }
}

function removeSubtree(d) {
  while (d.childs.length) {
    removeSubtree(d.childs[0]);
  }
  var parent = d.parentLink.source;
  parent.childs.splice(parent.childs.indexOf(d), 1);
  links.splice(links.indexOf(d.parentLink), 1);
  nodes.splice(nodes.indexOf(d), 1);
}

function removeNode(d, i) {
  var e = d3.event;
  //to make ctrl-drag works for mac/osx users
  if (e.ctrlKey || d.id == 1) return;
  removeSubtree(d);
  calcTreeHeight();
  e.preventDefault();
  restart();
  showGraphLatex();
}

//one response per ctrl keydown
var lastKeyDown = -1;

function keydown() {
  var e = d3.event;
  e.preventDefault();
  if (lastKeyDown !== -1) return;
  lastKeyDown = e.key;

  if (lastKeyDown === "Control") {
    vertices.call(
      d3
        .drag()
        .on("start", function dragstarted(d) {
          if (!d3.event.active) force.alphaTarget(1).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", function(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", function(d) {
          if (!d3.event.active) force.alphaTarget(0);
          if (d.id == 1) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
            return;
          }
          d.fx = null;
          d.fy = null;
        })
    );
  }
}

function keyup() {
  lastKeyDown = -1;
  if (d3.event.key === "Control") {
    vertices.on("mousedown.drag", null);
  }
}

//updates the graph by updating links, nodes and binding them with DOM
//interface is defined through several events
function restart() {
  edges = edges.data(links, function(d) {
    return "v" + d.source.id + "-v" + d.target.id;
  });
  edges.exit().remove();

  var ed = edges
    .enter()
    .append("line")
    .attr("class", "edge");

  ed.append("title").text(function(d) {
    return "v" + d.source.id + "-v" + d.target.id;
  });

  edges = ed.merge(edges);

  //vertices are known by id
  vertices = vertices.data(nodes, function(d) {
    return d.id;
  });
  vertices.exit().remove();

  var ve = vertices
    .enter()
    .append("circle")
    .attr("r", rad)
    .attr("class", "vertex")
    .style("fill", function(d, i) {
      if (d.color == 1) return "#17becf";
      else return "#e377c2";
    })
    .on("mousedown", addNode)
    .on("contextmenu", removeNode);

  ve.append("title").text(function(d) {
    if (d.id == 1)
      return (
        "v" +
        d.id +
        "\nparent: none" +
        "\ndepth: " +
        d.depth +
        "\nlevel: " +
        (d.depth + 1)
      );
    return (
      "v" +
      d.id +
      "\nparent: v" +
      d.parentLink.source.id +
      "\ndepth: " +
      d.depth +
      "\nlevel: " +
      (d.depth + 1)
    );
  });

  vertices = ve.merge(vertices);

  force.nodes(nodes);
  force.force("link").links(links);
  force.alpha(0.6).restart();
}

svg.on("contextmenu", function() {
  d3.event.preventDefault();
});

d3.select(window)
  .on("keydown", keydown)
  .on("keyup", keyup);

restart();
d3.select(vertices.nodes()[0]).classed("root", true);
showGraphLatex();

//handling output area
function showGraphLatex() {
  var l = "\\[\\text{Height of tree is }" + maxDepth + "\\]";

  document.getElementById("svg-output").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
