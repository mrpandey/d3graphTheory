//node ids are in order in which nodes come in existence
//keep color values in range [1,10]
var nodes = [
            {id: 1, color:1},
            {id: 2, color:2},
            {id: 3, color:3},
            {id: 4, color:4},
            {id: 5, color:5},
];

var links = [
            {source:0, target:1},
            {source:0, target:2},
            {source:1, target:2},
            {source:1, target:3},
            {source:2, target:3},
];

//universal width and height let index.htm control svg dimensions when needed
var lastNodeId = nodes.length;
var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight :400,
    rad = 10;

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
            .linkDistance(100)
            .linkStrength(0.9)
            .charge(-500)
            .chargeDistance((w+h)/2)
            .gravity(0.12)
            .on("tick",tick)
            .start();

var colors = d3.scale.category10();

var mousedownNode = null, mouseupNode = null;

var clrBtn = d3.select("#clear-graph");
clrBtn.on("click", clearGraph);


function resetMouseVar(){
	mousedownNode = null;
	mouseupNode = null;
}

//empties the graph
function clearGraph(){
  nodes.splice(0);
  links.splice(0);
  lastNodeId = 0;
  restart();
  showGraphLatex();
}

//update the simulation
function tick() {

  edges.attr("x1", function(d) { return d.source.x; })
       .attr("y1", function(d) { return d.source.y; })
       .attr("x2", function(d) { return d.target.x; })
       .attr("y2", function(d) { return d.target.y; });

  vertices.attr("cx", function(d) { return d.x; })
       .attr("cy", function(d) { return d.y; });

}

function addNode(){
  if(d3.event.button==0){
    var coords = d3.mouse(this);
    var newNode = {x:coords[0], y:coords[1], id: ++lastNodeId, color:1+lastNodeId%10};
    nodes.push(newNode);
    restart();
    showGraphLatex();
  }
}

//d is data, i is index according to selection
function removeNode(d, i){
  //to make ctrl-drag works for mac/osx users
  if(d3.event.ctrlKey) return;
  nodes.splice(nodes.indexOf(d),1);
  var linksToRemove = links.filter(function(l){
    return l.source===d || l.target===d;
  });
  linksToRemove.map(function(l) {
    links.splice(links.indexOf(l), 1);
  });
  d3.event.preventDefault();
  restart();
  showGraphLatex();
}

function removeEdge(d, i){
  links.splice(links.indexOf(d),1);
  d3.event.preventDefault();
  restart();
  showGraphLatex();
}

function beginDragLine(d){
  //to prevent call of addNode through svg
	d3.event.stopPropagation();
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
	//restart();
  //showGraphLatex();
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
	var newLink = {source: mousedownNode, target:d};
	links.push(newLink);
  restart();
  showGraphLatex();
}

function changeVertexColor(d){
  if(d3.event.ctrlKey || d3.event.button!=0) return;
  var thisVertex = d3.select(this);
  thisVertex.style("fill", function(d){
    d.color = 1 + d.color%10;
    return colors(d.color);
  });
  showGraphLatex();
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
        .append("title")
        .text(function(d){return "v"+d.source.id+"-v"+d.target.id;});

  edges.exit().remove();

  //vertices are known by id
  vertices = vertices.data(nodes, function(d){return d.id;});

  vertices.enter()
          .append("circle")
          .attr("r", rad)
          .attr("class", "vertex")
          .style("fill", function(d,i){
          	return colors(d.color);
          })
          .on("mousedown", beginDragLine)
          .on("mouseup", endDragLine)
          .on("click", changeVertexColor)
          .on("contextmenu", removeNode)
          .append("title")
          .text(function(d){
            return "v"+d.id;
          });

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

function checkColoring(){
  var flag = true;
  var ln, ed;
  for(var e of edges[0]){
    ed = d3.select(e);
    ln = ed.datum();
    if(ln.target.color==ln.source.color){
      ed.classed("same-color", true);
      flag = false;
    }
    else
      ed.classed("same-color", false);
  }
  return flag;
}

//check if colored properly and displays latex
function showGraphLatex () {
  var l = "";
  if(nodes.length==0)
    l = "\\[\\text{Draw something.}\\]";
  else if(checkColoring())
    l = "\\[\\text{The graph is properly colored.}\\]";
  else
    l = "\\[\\text{Not properly colored. Watch out for those red edges!}\\]";

  document.getElementById("svg-output").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
