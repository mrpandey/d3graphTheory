"use strict";
//node ids are in order in which nodes come in existence
//keep color values in range [0,9]
var nodes = [];

var links = [];

var problems = [
  {
    order: 5,
    links: [[2, 3], [3, 4], [0, 1], [1, 2], [4, 0]],
    coords: [[31, -35], [-63, 32], [-24, -73], [10, 35], [-81, -33]],
    k: 3
  },

  {
    order: 5,
    links: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4]
    ],
    coords: [[18, 37], [-88, -29], [36, -39], [-60, 42], [-30, -78]],
    k: 5
  },

  {
    order: 7,
    links: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 4],
      [3, 5],
      [0, 4],
      [0, 5],
      [1, 6],
      [2, 6],
      [4, 6],
      [5, 6]
    ],
    coords: [
      [48, -26],
      [14, 97],
      [-70, -72],
      [-3, 1],
      [-24, -96],
      [61, 75],
      [-56, 26]
    ],
    k: 3
  },

  {
    order: 8,
    links: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 4],
      [2, 4],
      [3, 5],
      [3, 6],
      [1, 5],
      [2, 6],
      [4, 7],
      [5, 7],
      [6, 7]
    ],
    coords: [
      [-8, 22],
      [95, -32],
      [-31, 124],
      [-70, -75],
      [70, 74],
      [31, -125],
      [-96, 31],
      [7, -23]
    ],
    k: 3
  },

  {
    order: 6,
    links: [
      [1, 2],
      [2, 4],
      [2, 3],
      [0, 4],
      [1, 3],
      [2, 5],
      [5, 4],
      [5, 3],
      [0, 1],
      [0, 2]
    ],
    coords: [[88, 48], [80, -67], [5, -5], [-32, -96], [-19, 90], [-93, 2]],
    k: 4
  },

  {
    order: 6,
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [0, 2],
      [2, 4],
      [4, 0],
      [1, 3],
      [3, 5],
      [5, 1]
    ],
    coords: [[-20, 88], [2, 10], [82, 7], [3, -92], [-19, -14], [-99, -10]],
    k: 3
  },

  {
    order: 9,
    links: [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
      [2, 5],
      [3, 5],
      [4, 5],
      [4, 6],
      [1, 6],
      [5, 7],
      [2, 7],
      [4, 8],
      [5, 8],
      [6, 8],
      [7, 8]
    ],
    coords: [
      [-150, 5],
      [-65, 103],
      [-73, -100],
      [-67, 2],
      [21, 48],
      [17, -51],
      [63, 119],
      [55, -125],
      [108, -4]
    ],
    k: 4
  },

  {
    order: 13,
    links: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      [0, 6],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 1],
      [1, 7],
      [2, 7],
      [2, 8],
      [3, 8],
      [3, 9],
      [4, 9],
      [4, 10],
      [5, 10],
      [5, 11],
      [6, 11],
      [6, 12],
      [1, 12],
      [9, 10],
      [10, 11],
      [11, 12],
      [12, 7],
      [7, 8],
      [8, 9]
    ],
    coords: [
      [-11, 3],
      [38, -91],
      [95, -1],
      [44, 93],
      [-61, 96],
      [-116, 5],
      [-67, -87],
      [123, -81],
      [128, 77],
      [-7, 161],
      [-147, 85],
      [-151, -73],
      [-16, -156]
    ],
    k: 4
  },

  {
    order: 14,
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 0],
      [1, 12],
      [3, 12],
      [5, 12],
      [7, 12],
      [0, 8],
      [8, 2],
      [2, 9],
      [9, 4],
      [4, 10],
      [10, 6],
      [6, 11],
      [11, 0],
      [8, 13],
      [9, 13],
      [10, 13],
      [11, 13]
    ],
    coords: [
      [-24, 161],
      [-126, 93],
      [-55, -9],
      [-106, -121],
      [8, -170],
      [-57, -81],
      [36, -1],
      [-70, 62],
      [39, 71],
      [53, -70],
      [108, -100],
      [88, 112],
      [-158, -18],
      [141, 11]
    ],
    k: 2
  },

  {
    order: 12,
    links: [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 1],
      [6, 1],
      [6, 2],
      [7, 2],
      [7, 3],
      [8, 3],
      [8, 4],
      [9, 4],
      [9, 5],
      [10, 5],
      [10, 1],
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
      [10, 6],
      [11, 6],
      [11, 7],
      [11, 8],
      [11, 9],
      [11, 10],
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5]
    ],
    coords: [
      [-46, 44],
      [54, 15],
      [32, 130],
      [-98, 97],
      [-134, -32],
      [-20, -57],
      [127, 32],
      [13, 57],
      [-61, -15],
      [-39, -130],
      [91, -97],
      [39, -44]
    ],
    k: 4
  }
];

var currentProb = 0,
  numOfColors = 0;

//universal width and height let index.htm control svg dimensions when needed
var w = univSvgWidth ? univSvgWidth : 616,
  h = univSvgHeight ? univSvgHeight : 400,
  rad = 10;

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
      .strength(-400)
      .distanceMax((w + h) / 2)
  )
  .force(
    "link",
    d3
      .forceLink()
      .distance(100)
      .strength(0.9)
  )
  .force("x", d3.forceX(w / 2).strength(0.05))
  .force("y", d3.forceY(h / 2).strength(0.05))
  .on("tick", tick);

var colors = d3.schemeCategory10;
var mousedownNode = null;

d3.select("#prev-prob").on("click", function() {
  if (currentProb != 0) setGraph(--currentProb);
});

d3.select("#next-prob").on("click", function() {
  if (currentProb < problems.length - 1) setGraph(++currentProb);
});

var paginationLinks = d3.select("#prob-list");

paginationLinks.selectAll("a").on("click", function(d, i) {
  if (i < problems.length) setGraph(i);
});

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

function changeVertexColor(d) {
  var e = d3.event;
  if (e.ctrlKey || e.button != 0) return;
  var thisVertex = d3.select(e.currentTarget);
  thisVertex.style("fill", function(d) {
    d.color = (1 + d.color) % numOfColors;
    return colors[d.color];
  });
  showGraphLatex();
}

//one response per ctrl keydown
var lastKeyDown = -1;

function keydown() {
  d3.event.preventDefault();
  if (lastKeyDown !== -1) return;
  lastKeyDown = d3.event.key;

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
  force.nodes(nodes);
  force.force("link").links(links);

  edges = edges.data(links, function(d) {
    return "v" + d.source.id + "-v" + d.target.id;
  });
  edges.exit().remove();

  var ed = edges
    .enter()
    .append("line")
    .attr("class", "edge")
    .on("mousedown", function() {
      d3.event.stopPropagation();
    });

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
      return colors[d.color];
    })
    .on("click", changeVertexColor);

  ve.append("title").text(function(d) {
    return "v" + d.id;
  });

  vertices = ve.merge(vertices);

  force.alpha(0.8).restart();
}

//further interface
svg.on("contextmenu", function() {
  d3.event.preventDefault();
});

d3.select(window)
  .on("keydown", keydown)
  .on("keyup", keyup);

setGraph(0);

function setGraph(index) {
  currentProb = index;
  var graphToLoad = problems[index];

  //remove current nodes and update
  nodes.splice(0);
  links.splice(0);
  restart();

  //push nodes and links
  for (let i = 0; i < graphToLoad.order; i++) {
    nodes.push({
      id: i + 1,
      color: 0,
      x: graphToLoad.coords[i][0],
      y: graphToLoad.coords[i][1]
    });
  }
  graphToLoad.links.forEach(function(d) {
    links.push({ source: d[0], target: d[1] });
  });

  numOfColors = graphToLoad.k;
  restart();
  showGraphLatex();

  //hide and show prev, next buttons
  if (index == 0) {
    $("#prev-prob").addClass("hidden");
    $("#next-prob").removeClass("hidden");
  } else if (index == problems.length - 1) {
    $("#prev-prob").removeClass("hidden");
    $("#next-prob").addClass("hidden");
  } else {
    $("#prev-prob").removeClass("hidden");
    $("#next-prob").removeClass("hidden");
  }
  //set a.prob-current
  paginationLinks.select(".prob-current").classed("prob-current", false);

  paginationLinks.selectAll("a").each(function(d, i) {
    if (i == index) d3.select(this).classed("prob-current", true);
  });
}

function checkColoring() {
  var flag = true;
  var ln, ed;
  for (let e of edges.nodes()) {
    ed = d3.select(e);
    ln = ed.datum();
    if (ln.target.color == ln.source.color) {
      ed.classed("same-color", true);
      flag = false;
    } else ed.classed("same-color", false);
  }

  if (flag) {
    paginationLinks.selectAll("a").each(function(d, i) {
      if (i == currentProb) d3.select(this).classed("prob-solved", true);
    });
  }

  return flag;
}

//check if colored properly and displays latex
function showGraphLatex() {
  var l = "";
  if (checkColoring()) {
    if (currentProb == problems.length - 1) l = "\\[\\text{You did it!}\\]";
    else l = "\\[\\text{You did it! Proceed to next problem.}\\]";
  } else l = "\\[\\text{You can use at most " + numOfColors + " colors.}\\]";

  document.getElementById("output-text").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
