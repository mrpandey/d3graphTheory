var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight :400,
    rad = 10;

//node ids are in order in which nodes come in existence
var nodes = [
            {id: 1, fixed:true, x:w/2, y:rad+5, color:0},
            {id: 2, color:1},
            {id: 3, color:1},
            {id: 4, color:2},
            {id: 5, color:2},
            {id: 6, color:2},
            {id: 7, color:2},
];

//source is parent, target is child
var links = [
            {source:0, target:1},
            {source:0, target:2},
            {source:1, target:3},
            {source:2, target:4},
            {source:2, target:5},
            {source:2, target:6},
];

//universal width and height let index.htm control svg dimensions when needed
var lastNodeId = nodes.length,
    maxDepth = 2;

positionNodes();

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
            .linkDistance(30)
            .linkStrength(1)
            .charge(-150)
            .chargeDistance((w+h)/2)
            .gravity(0.05)
            .on("tick",tick)
            .start();

addChilds();
addDepth(nodes[0], 0);

var clrBtn = d3.select("#clear-graph");
clrBtn.on("click", clearGraph);

//empties the graph
function clearGraph(){
  nodes.splice(1);
  links.splice(0);
  nodes[0].childs.splice(0);
  lastNodeId = 1;
  maxDepth = 0;
  restart();
  showGraphLatex();
}

function positionNodes(){
  for(var i=1; i<nodes.length; i++){
    nodes[i].x = nodes[i].y = i*w/lastNodeId;
  }
}

function addChilds(){
  nodes.forEach(function(d){
    d.childs = [];
    d.parentLink = null;
  });
  links.forEach(function(l){
    l.source.childs.push(l.target);
    l.target.parentLink = l;
  });
}

function addDepth(nd, d){
  nd.depth = d;
  nd.childs.forEach(function(c){addDepth(c, d+1);});
}

function calcTreeHeight(){
  maxDepth = 0;
  nodes.forEach(function(d){
    maxDepth = Math.max(maxDepth, d.depth);
  });
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

function addNode(d){
  //node shouldn't be added when draging the nodes
  if(d3.event.ctrlKey) return;
  if(d3.event.button==0){
    var coords = d3.mouse(this);
    var newNode = {x:coords[0], y:coords[1], id:++lastNodeId, childs:[], depth:d.depth+1};
    var newLink = {source:d, target:newNode};
    newNode.parentLink = newLink;
    if(d.color==1) newNode.color = 2;
    else newNode.color = 1;
    d.childs.push(newNode);
    nodes.push(newNode);
    links.push(newLink);
    maxDepth = Math.max(maxDepth, newNode.depth);
    restart();
    showGraphLatex();
  }
}

function removeSubtree(d){
  while(d.childs.length){
    removeSubtree(d.childs[0]);
  }
  var parent = d.parentLink.source;
  parent.childs.splice(parent.childs.indexOf(d), 1);
  links.splice(links.indexOf(d.parentLink), 1);
  nodes.splice(nodes.indexOf(d), 1);
}

function removeNode(d, i){
  //to make ctrl-drag works for mac/osx users
  if(d3.event.ctrlKey || d.id==1) return;
  removeSubtree(d);
  calcTreeHeight();
  d3.event.preventDefault();
  restart();
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
            if(d.color==1) return "#17becf";
            else return "#e377c2";
          })
          .on("mousedown", addNode)
          .on("contextmenu", removeNode)
          .append("title")
          .text(function(d){
            if(d.id==1)
              return "v"+d.id+"\nparent: none"+"\ndepth: "+d.depth+"\nlevel: "+(d.depth+1);
            return "v"+d.id+"\nparent: v"+(d.parentLink.source.id)+"\ndepth: "+d.depth+"\nlevel: "+(d.depth+1);
          });

  vertices.exit().remove();
  force.start();
}

svg.on("contextmenu", function(){d3.event.preventDefault();});

d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);

restart();
d3.select(vertices[0][0]).classed('root', true);
showGraphLatex();

//handling output area
function showGraphLatex () {
  var l = "\\[\\text{Height of tree is }" + maxDepth + "\\]";

  document.getElementById("svg-output").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
