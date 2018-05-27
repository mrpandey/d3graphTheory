//node ids are in order in which nodes come in existence
var nodes = [
            {id:1, degree:5, x:262, y:246},
            {id:2, degree:5, x:359, y:314},
            {id:3, degree:5, x:362, y:252},
            {id:4, degree:5, x:324, y:168},
            {id:5, degree:5, x:272, y:133},
            {id:6, degree:5, x:319, y:222},
            {id:7, degree:5, x:462, y:265},
            {id:8, degree:5, x:415, y:177},
            {id:9, degree:5, x:378, y:85},
            {id:10, degree:5, x:371, y:146},
            {id:11, degree:5, x:411, y:230},
            {id:12, degree:5, x:472, y:150},
];

var links = [
            {source:0, target:1},
            {source:0, target:2},
            {source:0, target:3},
            {source:0, target:4},
            {source:0, target:5},
            {source:1, target:2},
            {source:2, target:3},
            {source:3, target:4},
            {source:4, target:5},
            {source:5, target:1},

            {source:6, target:1},
            {source:6, target:2},
            {source:7, target:2},
            {source:7, target:3},
            {source:8, target:3},
            {source:8, target:4},
            {source:9, target:4},
            {source:9, target:5},
            {source:10, target:5},
            {source:10, target:1},

            {source:6, target:7},
            {source:7, target:8},
            {source:8, target:9},
            {source:9, target:10},
            {source:10, target:6},

            {source:11, target:6},
            {source:11, target:7},
            {source:11, target:8},
            {source:11, target:9},
            {source:11, target:10}
];

var walk = [];

//universal width and height let index.html control svg dimensions when needed
var lastNodeId = nodes.length;

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
                    .linkDistance(80)
                    .linkStrength(1)
                    .charge(-565)
                    .chargeDistance((w+h)/2)
                    .gravity(0.1)
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
}

//set initial positions for quick convergence
function positionNodes(){
  nodes.forEach(function(d, i) {
    //d.x = d.y = w / lastNodeId * i;
    d.x += Math.random()*200 - 100;
    d.y += Math.random()*200 - 100;
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
}

function removeEdge(d, i){
  if(d3.select(this).classed("walk-edge")) return;
  d.source.degree--;
  d.target.degree--;
  links.splice(links.indexOf(d),1);
  d3.event.preventDefault();
  restart();
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
      return colors(d.id);
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
showGraphLatex();

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
      showGraphLatex();
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
    showGraphLatex();
  }

  else if(sourceVertex.classed("walk-end")){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    sourceVertex.classed("walk-end", false);
    targetVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
    showGraphLatex();
  }

  else if(targetVertex.classed("walk-end")){
    walk.push(d);
    thisEdge.classed("walk-edge", true);
    targetVertex.classed("walk-end", false);
    sourceVertex.classed("walk-end walk-vertex", true);
    d.source.walkDegree++;
    d.target.walkDegree++;
    showGraphLatex();
  }
}

function clearWalk() {
  d3.selectAll(".walk-edge").classed("walk-edge", false);
  d3.selectAll(".walk-vertex").classed("walk-vertex", false);
  d3.select(".walk-start").classed("walk-start", false);
  d3.select(".walk-end").classed("walk-end", false);
  walk.splice(0);
  setWalkDegree();
  showGraphLatex();
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
  showGraphLatex();
}

//prints latex in svg-output
function showGraphLatex() {
  var l = "";
  if(walk.length==0){
    l += "\\[\\text{Create a Walk}\\]";
  }
  else {

    var vertexRep = false;

    l += "\\[\\text{Walk : }";
    var currentVertex = d3.select(".walk-start").datum();
    l += "v_{" + currentVertex.id + "}";

    walk.forEach(function(e, i){

      if(e.source===currentVertex)
        currentVertex = e.target;
      else if(e.target===currentVertex)
        currentVertex = e.source;

      if(currentVertex.walkDegree>2)
        vertexRep = true;

      l += "\\to v_{" + currentVertex.id + "}";
      if((i+1)%10==0)
        l += "\\\\";
    });

    l += "\\]";

    if(d3.select(".walk-start").attr("id")===d3.select(".walk-end").attr("id")){
      l += "\\[\\text{This walk is closed.}\\]";
      if(vertexRep)
        l += "\\[\\text{It is an example of Circuit.}\\]";
      else
        l += "\\[\\text{It is both a Circuit and a Cycle.}\\]";
    }
    else{
      l += "\\[\\text{This walk is open.}\\]";
      if(vertexRep)
        l += "\\[\\text{It is an example of Trail.}\\]";
      else
        l += "\\[\\text{It is both a Trail and a Path.}\\]";
    }
  }

  document.getElementById("svg-output").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
