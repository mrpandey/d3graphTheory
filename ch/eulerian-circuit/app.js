//node ids are in order in which nodes come in existence
var nodes = [];

var links = [];

var problems = [
  {
    "order": 4,
    "links": [ [0,1], [1,2], [2,3], [3,0] ]
  },

  {
    "order": 6,
    "coords": [ [378, 275], [249, 295], [307, 149], [374, 47], [443, 163], [492, 268] ],
    "links": [ [0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,2], [2,4], [4,0] ]
  },

  {
    "order": 6,
    "links": [ [0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,2], [2,4], [4,0], [1,3], [3,5], [5,1] ]
  },

  {
    "order": 5,
    "links": [ [0,1], [0,2], [0,3], [0,4], [1,2], [1,3], [1,4], [2,3], [2,4], [3,4] ]
  },

  {
    "order": 6,
    "coords": [ [246, 240], [468, 216], [398, 299], [302, 308], [361, 189], [343, 128] ],
    "links": [ [0,5], [5,1], [0,2], [0,3], [0,4], [1,2], [1,3], [1,4], [2,3], [2,4], [3,4] ]
  }

];

var walk = [];

var currentProb = 0;
var lastNodeId = nodes.length;

//universal width and height let index.html control svg dimensions when needed
var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight : 400,
    rad = 14;

setWalkDegree();

var svg = d3.select("#svg-wrap")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var edges = svg.append("g")
								.selectAll(".edge");

var vertices = svg.append("g")
									.selectAll(".vertex");

var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w, h])
                    .linkDistance(120)
                    .linkStrength(1)
                    .charge(-500)
                    .chargeDistance((w+h)/2)
                    .gravity(0.05)
                    .on("tick",tick)
                    .start();

var colors = d3.scale.category10();

var mousedownNode = null, mouseupNode = null;

d3.select("#clear-walk").on("click", clearWalk);

d3.select("#reverse-walk").on("click", reverseWalk);

d3.select("#prev-prob")
  .on("click", function(){
    if(currentProb!=0)
      setGraph(--currentProb);
  });

d3.select("#next-prob")
  .on("click", function(){
    if(currentProb<problems.length-1)
      setGraph(++currentProb);
  });

var paginationLinks = d3.select("#prob-list");

paginationLinks.selectAll("a")
                .on("click", function(d, i){
                  if(i<problems.length)
                    setGraph(i);
                });

function resetMouseVar(){
	mousedownNode = null;
	mouseupNode = null;
}

//set initial positions for quick convergence
function positionNodes(){
  nodes.forEach(function(d, i) {
    d.x = d.y = w / lastNodeId * i;
  });
}

function setWalkDegree(){
  nodes.forEach(function(v){v.walkDegree=0;});
}

//update the simulation
function tick() {

  edges.attr("x1", function(d) { return d.source.x; })
       .attr("y1", function(d) { return d.source.y; })
       .attr("x2", function(d) { return d.target.x; })
       .attr("y2", function(d) { return d.target.y; });

  //here vertices are g.vertex elements
  vertices.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });

}

//one response per ctrl keydown
var lastKeyDown = -1;

function keydown(){
	if(lastKeyDown !== -1) return;
	lastKeyDown = d3.event.key;

	if(lastKeyDown === "Control"){
		vertices.call(force.drag);
	}
}

function keyup(){
	lastKeyDown = -1;
	if(d3.event.key === "Control"){
		vertices.on("mousedown.drag", null);
	}
}

//updates the graph by updating links, nodes and binding them with DOM
//interface is defined through several events
function restart(){
  edges = edges.data(links, function(d){return "v"+d.source.id+"-v"+d.target.id;});

  edges.enter()
        .append("line")
        .attr("class","edge")
        .on("click", extendWalk)
        .append("title")
        .text(function(d){return "v"+d.source.id+"-v"+d.target.id;});

  edges.exit().remove();

  //vertices are known by id
  vertices = vertices.data(nodes, function(d){return d.id;});

  var g = vertices.enter()
                  .append("g")
                  .attr("class", "vertex")
                  .attr("id", function(d){return "v"+d.id;});

  g.append("circle")
    .attr("r", rad)
    .style("fill", function(d){
      return colors(d.id);
    })
    .append("title")
    .text(function(d){
      return "v"+d.id;
    });

  g.append("text")
    .attr("x", 0)
    .attr("y", 4)
    .text(function(d){return d.degree;});

  vertices.exit().remove();
  force.start();
}

svg.on("mouseleave", restart)
    .on("contextmenu", function(){d3.event.preventDefault();});

d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);

restart();
setGraph(0);

//managing walk
function extendWalk(d){
  var thisEdge = d3.select(this),
      sourceVertex = d3.select("#v"+d.source.id),
      targetVertex = d3.select("#v"+d.target.id);

  //remove the last added edge
  if(thisEdge.classed("walk-edge")){

    if(walk.length==1 && walk[0]===d){
      clearWalk();
      return;
    }

    if(walk.length>1 && walk[walk.length-1]===d){
      walk.pop();
      thisEdge.classed("walk-edge", false);

      if(sourceVertex.classed("walk-end")){
        sourceVertex.classed("walk-end", false);
        if(d.source.walkDegree==1){
          sourceVertex.classed("walk-vertex", false);
        }
        targetVertex.classed("walk-end",true);
      }

      else if(targetVertex.classed("walk-end")){
        targetVertex.classed("walk-end", false);
        if(d.target.walkDegree==1){
          targetVertex.classed("walk-vertex", false);
        }
        sourceVertex.classed("walk-end",true);
      }

      d.source.walkDegree--;
      d.target.walkDegree--;
    }
    return;
  }

  //add edge
  if(walk.length==0){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    sourceVertex.classed("walk-start walk-vertex", true);
    targetVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
    checkAndLoad();
  }

  else if(sourceVertex.classed("walk-end")){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    sourceVertex.classed("walk-end", false);
    targetVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
    checkAndLoad();
  }

  else if(targetVertex.classed("walk-end")){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    targetVertex.classed("walk-end", false);
    sourceVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
    checkAndLoad();
  }
}

function clearWalk() {
  d3.selectAll(".walk-edge").classed("walk-edge", false);
  d3.selectAll(".walk-vertex").classed("walk-vertex", false);
  d3.select(".walk-start").classed("walk-start", false);
  d3.select(".walk-end").classed("walk-end", false);
  walk.splice(0);
  setWalkDegree();
}

function reverseWalk(){
  if(walk.length==0)
    return;
  walk.reverse();
  var currentStart = d3.select(".walk-start");
  var currentEnd = d3.select(".walk-end");
  if(currentStart.attr("id")!=currentEnd.attr("id")){
    currentStart.classed({"walk-start":false, "walk-end":true});
    currentEnd.classed({"walk-end":false, "walk-start":true});
  }
}

function setGraph(index){
  currentProb = index;
  var graphToLoad = problems[index];
  clearWalk();
  //remove current nodes and update
  nodes.splice(0);
  links.splice(0);
  restart();
  //push nodes and links
  for(var i=0; i<graphToLoad.order; i++){
    if(graphToLoad.coords)
      nodes.push({id:i+1, degree:0, x:graphToLoad.coords[i][0], y:graphToLoad.coords[i][1]});
    else
      nodes.push({id:i+1, degree:0});
  }
  graphToLoad.links.forEach(function(d){
    links.push({source:d[0], target:d[1]});
  });
  lastNodeId = graphToLoad.order;
  if(!graphToLoad.coords) positionNodes();
  force.start();
  links.forEach(function(d){
    d.source.degree++;
    d.target.degree++;
  });
  restart();
  //style prev and next
  if(index==0){
    $("#prev-prob").addClass("hidden");
    $("#next-prob").removeClass("hidden");
  }
  else if(index==problems.length-1){
    $("#prev-prob").removeClass("hidden");
    $("#next-prob").addClass("hidden");
  }
  else{
    $("#prev-prob").removeClass("hidden");
    $("#next-prob").removeClass("hidden");
  }
  //set a.prob-current
  paginationLinks.select(".prob-current")
                  .classed("prob-current",false);

  paginationLinks.selectAll("a")
                  .each(function(d, i){
                    if(i==index)
                      d3.select(this)
                        .classed("prob-current",true);
                  });
}

//checks if problem is solved
//if yes then load next problem
function checkAndLoad(){
  if($(".walk-edge").length!=links.length)
    return;
  //set currentProb as solved
  paginationLinks.selectAll("a")
                  .each(function(d, i){
                    if(i==currentProb)
                      d3.select(this)
                        .classed("prob-solved",true);
                  });
  //load next problem with delay of 1s
  if(currentProb < problems.length-1){
    setTimeout(function(){
      setGraph(++currentProb);
    }, 2500);
  }
}
