//node ids are in order in which nodes come in existence
var nodes = [
            {id: 1, degree:2,},
            {id: 2, degree:2,},
            {id: 3, degree:1,},
            {id: 4, degree:2,},
            {id: 5, degree:1,},
];

var links = [
            {source:0, target:3},
            {source:0, target:4},
            {source:1, target:2},
            {source:1, target:3},
];

//universal width and height let index.html control svg dimensions when needed
var lastNodeId = nodes.length;
var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight :400,
    rad = 16;

setParity();
positionNodes();

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
            .linkStrength(1)
            .charge(-550)
            .chargeDistance((w+h)/2)
            .gravity(0.2)
            .on("tick",tick)
            .start();

var colors = d3.scale.category10();
var extraColors = ["#8AFF33", "#ff5733", "#ccc",];

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
  checkBipartite();
}

//sets parity of nodes
function setParity(){
  nodes.forEach(function(v){
    v.parity = 0;
    v.visited = false;
  });
}

function setColor(){
  vertices.selectAll("circle")
          .style("fill", function(d){
            if(!d.degree)
              return extraColors[2];
            if(d.parity)
              return extraColors[d.parity%2];
            else
              return colors(d.id);
          });
}

//set initial positions for quick convergence
function positionNodes(){
  nodes.forEach(function(d, i) {
    d.y = w / lastNodeId * i;
    if(i%2==0)
      d.x = d.y;
    else
      d.x = w - d.y;
  });
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
    var newNode = {x:coords[0], y:coords[1], id: ++lastNodeId, degree:0,};
    nodes.push(newNode);
    restart();
  }
}

//d is data, i is index according to selection
function removeNode(d, i){
  //to make ctrl-drag works for mac/osx users
  if(d3.event.ctrlKey) return;
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
  checkBipartite();
}

function removeEdge(d, i){
  d.source.degree--;
  d.target.degree--;
  links.splice(links.indexOf(d),1);
  d3.event.preventDefault();
  restart();
  checkBipartite();
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
  checkBipartite();
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
          .text(function(d){return d.degree;});

  var g = vertices.enter()
                  .append("g")
                  .attr("class", "vertex")
                  //so that force.drag and addNode don't interfere
                  //mousedown is initiated on circle which is stopped at .vertex
                  .on("mousedown", function(){d3.event.stopPropagation();});

  g.append("circle")
    .attr("r", rad)
    .style("fill", function(d){
      if(!d.degree)
        return extraColors[2];
      else
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

  g.append("text")
    .attr("x", 0)
    .attr("y", 4)
    .text(function(d){
      return d.degree;
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
checkBipartite();

//check whether the graph is bipartite or not
function checkBipartite(){
  if(nodes.length==0){
    showGraphLatex(null);
    return;
  }
  setParity();
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

    if(adj.length>0 && v1.parity==0)
      v1.parity = 1;

    for(var i=0; i<adj.length; i++){
      var v2 = adj[i];
      if(v2.visited)
        continue;
      if(v2.parity===v1.parity){
        setParity();
        setColor();
        showGraphLatex(false);
        return false;
      }
      else
        v2.parity = 3 - v1.parity;
      q.push(v2);
    }

    v1.visited = true;
    //check for disconnected nodes
    if(q.length==0){
      for(var i=0; i<nodes.length; i++){
        if(!nodes[i].visited){
          q.push(nodes[i]);
          break;
        }
      }
    }
  }//while ends here
  setColor();
  showGraphLatex(true);
  return true;
}

//prints latex in svg-output
function showGraphLatex (isBipartite) {
  var l = "";

  if(isBipartite){
    var setA="", setB="";
    var countA=0; countB=0;
    nodes.forEach(function(v){
      if(v.parity==1){
        countA++;
        setA += "v_{" + v.id + "},";
        if(countA%12==0)
          setA += "\\\\";
      }
      else if(v.parity==2){
        countB++;
        setB += "v_{" + v.id + "},";
        if(countB%12==0)
          setB += "\\\\";
      }
    });
    l = "\\[\\text{Set } A = \\{" + setA + "\\} \\]";
    l += "\\[\\text{Set } B = \\{" + setB + "\\} \\]";
  }

  else if(isBipartite!=false){
    l = "\\[\\text{Draw bipartite graph.}\\]";
  }

  else
    l = "\\[\\text{Not Bipartite}\\]";

  document.getElementById("svg-output").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
