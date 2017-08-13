//node ids are in order in which nodes come in existence
var nodes = [
            {id:1, degree:4},
            {id:2, degree:5},
            {id:3, degree:4},
            {id:4, degree:5},
            {id:5, degree:5},
            {id:6, degree:4},
            {id:7, degree:3},
            {id:8, degree:3},
            {id:9, degree:3},

            {id:10, degree:4},
            {id:11, degree:4},
            {id:12, degree:4},
            {id:13, degree:4},
            {id:14, degree:4},
            {id:15, degree:4},
];

var links = [
            {source:0, target:1},
            {source:0, target:3},
            {source:0, target:6},
            {source:0, target:8},
            {source:1, target:2},
            {source:1, target:3},
            {source:1, target:4},
            {source:1, target:6},
            {source:2, target:6},
            {source:2, target:7},
            {source:2, target:4},
            {source:3, target:4},
            {source:3, target:8},
            {source:4, target:7},
            {source:5, target:3},
            {source:5, target:4},
            {source:5, target:7},
            {source:5, target:8},

            {source:9, target:10},
            {source:10, target:11},
            {source:11, target:12},
            {source:12, target:9},
            {source:13, target:9},
            {source:13, target:10},
            {source:13, target:11},
            {source:13, target:12},
            {source:14, target:9},
            {source:14, target:10},
            {source:14, target:11},
            {source:14, target:12},
];

var walk = [];

//universal width and height let index.html control svg dimensions when needed
var lastNodeId = nodes.length,
    componentCount = 0;

var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight : 400,
    rad = 10;

positionNodes();
setWalkDegree();

var svg = d3.select("#svg-wrap")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

var dragLine = svg.append("path")
									.attr("class", "dragLine hidden")
									.attr("d", "M0,0L0,0");

var edges = svg.append("g")
								.selectAll(".edge");

var vertices = svg.append("g")
									.selectAll(".vertex");

var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w, h])
                    .linkDistance(60)
                    .linkStrength(1)
                    .charge(-450)
                    .chargeDistance((w+h)/2)
                    .gravity(0.15)
                    .on("tick",tick)
                    .start();

var colors = d3.scale.category10();

var mousedownNode = null, mouseupNode = null;

var clrBtn = d3.select("#clear-graph"),
    clrWalkBtn = d3.select("#clear-walk"),
    reverseWalkBtn = d3.select("#reverse-walk");

clrBtn.on("click", clearGraph);
clrWalkBtn.on("click", clearWalk);
reverseWalkBtn.on("click", reverseWalk);

function resetMouseVar(){
	mousedownNode = null;
	mouseupNode = null;
}

//empties the graph
function clearGraph(){
  clearWalk();
  nodes.splice(0);
  links.splice(0);
  lastNodeId = 0;
  restart();
  checkConnectivity();
}

//whether nodes are visited or not
function setVisited(){
  
}

function setColor(){
  vertices.selectAll("circle")
          .style("fill", function(d){
            return colors(d.componentId);
          });
}

//set initial positions for quick convergence
function positionNodes(){
  nodes.forEach(function(d, i) {
    d.x = d.y = w / lastNodeId * i;
    /*if(i%2==0)
      d.x = d.y;
    else
      d.x = w - d.y;*/
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

function addNode(){
  if(d3.event.button==0){
    var coords = d3.mouse(this);
    var newNode = {x:coords[0], y:coords[1], id: ++lastNodeId, degree:0, walkDegree:0};
    nodes.push(newNode);
    restart();
    checkConnectivity();
  }
}

//d is data, i is index according to selection
function removeNode(d, i){
  //to make ctrl-drag works for mac/osx users
  if(d3.event.ctrlKey) return;
  if(d3.select(this.parentNode).classed("walk-vertex")) return;
  var linksToRemove = links.filter(function(l){
    return l.source===d || l.target===d;
  });
  linksToRemove.map(function(l) {
    l.source.degree--;
    l.target.degree--;
    links.splice(links.indexOf(l), 1);
  });
  nodes.splice(nodes.indexOf(d),1);
  d3.event.preventDefault();
  restart();
  checkConnectivity();
}

function removeEdge(d, i){
  if(d3.select(this).classed("walk-edge")) return;
  d.source.degree--;
  d.target.degree--;
  links.splice(links.indexOf(d),1);
  d3.event.preventDefault();
  restart();
  checkConnectivity();
}

function beginDragLine(d){
  //event must propagate till g.vertex so that force.drag could work
  //stop propagation at .vertex in restart() so that addNode isn't fired

  //to prevent dragging of svg in firefox
	d3.event.preventDefault();
	if(d3.event.ctrlKey || d3.event.button!=0) return;
	mousedownNode = d;
	dragLine.classed("hidden", false)
					.attr("d", "M" + mousedownNode.x + "," + mousedownNode.y + 
						"L" + mousedownNode.x + "," + mousedownNode.y);
}

function updateDragLine(){
	if(!mousedownNode) return;
	dragLine.attr("d", "M" + mousedownNode.x + "," + mousedownNode.y + 
									"L" + d3.mouse(this)[0] + "," + d3.mouse(this)[1]);
}

function hideDragLine(){
	dragLine.classed("hidden", true);
	resetMouseVar();
	restart();
}

//no need to call hideDragLine in endDragLine
//mouseup on vertices propagates to svg which calls hideDragLine
function endDragLine(d){
	if(!mousedownNode || mousedownNode===d) return;
	//return if link already exists
	for(var i=0; i<links.length; i++){
		var l = links[i];
		if((l.source===mousedownNode && l.target===d) || (l.source===d && l.target===mousedownNode)){
			return;
		}
	}
  mousedownNode.degree++;
  d.degree++;
	var newLink = {source: mousedownNode, target:d};
	links.push(newLink);
  checkConnectivity();
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
        .on("mousedown", function(){d3.event.stopPropagation();})
        .on("contextmenu", removeEdge)
        .on("click", extendWalk)
        .on("mouseover", function(d){
        	var thisEdge = d3.select(this);
          if(thisEdge.select("title").empty()){
            thisEdge.append("title")
        		        .text("v"+d.source.id+"-v"+d.target.id);
          }
        });

  edges.exit().remove();

  //vertices are known by id
  vertices = vertices.data(nodes, function(d){return d.id;});

  //update degree
  vertices.selectAll("text")
          .text(function(d){});

  var g = vertices.enter()
                  .append("g")
                  .attr("class", "vertex")
                  .attr("id", function(d){return "v"+d.id;})
                  //so that force.drag and addNode don't interfere
                  //mousedown is initiated on circle which is stopped at .vertex
                  .on("mousedown", function(){d3.event.stopPropagation();});

  g.append("circle")
    .attr("r", rad)
    .style("fill", function(d){
      //default silver color
      return "#ccc";
    })
    .on("mousedown", beginDragLine)
    .on("mouseup", endDragLine)
    .on("mouseover", function(d){
    	var thisVertex = d3.select(this);
      if(thisVertex.select("title").empty()){
        thisVertex.append("title")
    		          .text("v"+d.id);
      }
    })
    .on("contextmenu", removeNode);

  g.append("text")
    .attr("x", 0)
    .attr("y", 4)
    .text(function(d){});
    
  vertices.exit().remove();
  force.start();
}

//further interface
svg.on("mousedown", addNode)
	  .on("mousemove", updateDragLine)
	  .on("mouseup", hideDragLine)
	  .on("contextmenu", function(){d3.event.preventDefault();})
	  .on("mouseleave", hideDragLine);

d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);

restart();
checkConnectivity();

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
  }

  else if(sourceVertex.classed("walk-end")){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    sourceVertex.classed("walk-end", false);
    targetVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
  }

  else if(targetVertex.classed("walk-end")){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    targetVertex.classed("walk-end", false);
    sourceVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
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

function checkConnectivity(){
  if(nodes.length==0){
    componentCount = 0;
    showGraphLatex();
    return;
  }

  componentCount = 1;
  nodes.forEach(function(v){
    v.visited = false;
  });

  //construct adjacency list of graph
  var adjList = {};
  nodes.forEach(function(v){
    adjList[v.id]=[];
  });
  links.forEach(function(e){
    adjList[e.source.id].push(e.target);
    adjList[e.target.id].push(e.source);
  });

  //perform DFS on nodes
  var q = [];
  q.push(nodes[0]);

  while(q.length>0){

    var v1 = q.shift();
    var adj = adjList[v1.id];

    for(var i=0; i<adj.length; i++){
      var v2 = adj[i];
      if(v2.visited)
        continue;
      q.push(v2);
    }

    v1.visited = true;
    v1.componentId = componentCount;
    //check for unvisited nodes
    if(q.length==0){
      for(var i=0; i<nodes.length; i++){
        if(!nodes[i].visited){
          q.push(nodes[i]);
          componentCount++;
          break;
        }
      }
    }
  }//while ends here
  setColor();
  showGraphLatex();
}

//prints latex in svg-output
function showGraphLatex() {
  var l="";
  if(componentCount==0)
    l = "\\[\\text{Draw something.}\\]";
  else if(componentCount==1)
    l = "\\[\\text{There is only one connected component in this graph. Hence, the graph is connected.}\\]";
  else
    l = "\\[\\text{There are " + componentCount + " connected components in this graph. It is a disconnected graph.}\\]";

  document.getElementById("svg-output").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
