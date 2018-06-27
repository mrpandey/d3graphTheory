//node ids are in order in which nodes come in existence
//keep color values in range [1,10]
var nodes = [];

var links = [];

var problems = [

  {
    "order": 5,
    "links": [ [2,3], [3,4], [0,1], [1,2], [4,0] ],
    "k": 3
  },

  {
    "order": 5,
    "links": [ [0,1], [0,2], [0,3], [0,4], [1,2], [1,3], [1,4], [2,3], [2,4], [3,4] ],
    "k": 5
  },

  {
    "order": 7,
    "links": [ [0,1], [0,2], [1,3], [2,3], [3,4], [3,5], [0,4], [0,5], [1,6], [2,6], [4,6], [5,6] ],
    "k": 3
  },

  {
    "order": 8,
    "links": [ [0,1], [0,2], [0,3], [1,4], [2,4], [3,5], [3,6], [1,5], [2,6], [4,7], [5,7], [6,7] ],
    "k": 3
  },

  {
    "order": 6,
    "coords": [ [338, 194], [319, 193], [273, 156], [260, 124], [308, 253], [232, 188] ],
    "links": [ [1,2], [2,4], [2,3], [0,4], [1,3], [2,5], [5,4], [5,3], [0,1], [0,2] ],
    "k": 4
  },

  {
    "order": 6,
    "links": [ [0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,2], [2,4], [4,0], [1,3], [3,5], [5,1] ],
    "k": 3
  },

  {
    "order": 9,
    "links": [ [0,1], [0,2], [0,3], [1,3], [2,3], [1,4], [3,4], [2,5], [3,5], [4,5], [4,6], [1,6], [5,7], [2,7], [4,8], [5,8], [6,8], [7,8] ],
    "k": 4
  },

  {
    "order": 13,
    "links": [ [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1], [1,7], [2,7], [2,8], [3,8], [3,9], [4,9], [4,10], [5,10], [5,11], [6,11], [6,12], [1,12], [9,10], [10,11], [11,12], [12,7], [7,8], [8,9], ],
    "k": 4
  },

  {
    "order": 14,
    "links": [ [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [1, 12], [3, 12], [5, 12], [7, 12],
    [0, 8], [8, 2], [2, 9], [9, 4], [4, 10], [10, 6], [6, 11], [11, 0], [8, 13], [9, 13], [10, 13], [11, 13],  ],
    "k": 2
  },

  {
    "order": 12,
    "coords": [ [294, 272], [328, 250], [339, 264], [227, 249], [254, 221], [304, 222], [423, 256], [316, 222], [262, 197], [279, 88], [386, 108], [381, 113] ],
    "links": [ [1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [6, 1], [6, 2], [7, 2], [7, 3], [8, 3], [8, 4], [9, 4], [9, 5], [10, 5], [10, 1], [6, 7], [7, 8], [8, 9], [9, 10], [10, 6], [11, 6], [11, 7], [11, 8], [11, 9], [11, 10], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5] ],
    "k": 4
  }

];

//here the only use of
//lastNodeId is for positionNodes()
var currentProb = 0,
    numOfColors = 0,
    lastNodeId = 10;

//universal width and height let index.htm control svg dimensions when needed
var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight :400,
    rad = 10;

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
            .linkDistance(60)
            .linkStrength(0.9)
            .charge(-600)
            .chargeDistance((w+h)/2)
            .gravity(0.1)
            .friction(0.88)
            .on("tick",tick)
            .start();

var colors = d3.scale.category10();

var mousedownNode = null, mouseupNode = null;

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

//update the simulation
function tick() {

  edges.attr("x1", function(d) { return d.source.x; })
       .attr("y1", function(d) { return d.source.y; })
       .attr("x2", function(d) { return d.target.x; })
       .attr("y2", function(d) { return d.target.y; });

  vertices.attr("cx", function(d) { return d.x; })
       .attr("cy", function(d) { return d.y; });

}

function changeVertexColor(d){
  if(d3.event.ctrlKey || d3.event.button!=0) return;
  var thisVertex = d3.select(this);
  thisVertex.style("fill", function(d){
    d.color = 1 + d.color%numOfColors;
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
          .on("click", changeVertexColor)
          .append("title")
          .text(function(d){
            return "v"+d.id;
          });

  vertices.exit().remove();
  force.start();
}

//further interface
svg.on("contextmenu", function(){d3.event.preventDefault();});

d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);

restart();
setGraph(0);

function setGraph(index){
  currentProb = index;
  var graphToLoad = problems[index];
  //remove current nodes and update
  nodes.splice(0);
  links.splice(0);
  restart();
  //push nodes and links
  for(var i=0; i<graphToLoad.order; i++){
    if(graphToLoad.coords)
      nodes.push({id:i+1, color:1, x:graphToLoad.coords[i][0], y:graphToLoad.coords[i][1]});
    else
      nodes.push({id:i+1, color:1});
  }
  graphToLoad.links.forEach(function(d){
    links.push({source:d[0], target:d[1]});
  });
  numOfColors = graphToLoad.k;
  lastNodeId = graphToLoad.order;
  if(!graphToLoad.coords) positionNodes();
  force.start();
  restart();
  showGraphLatex();
  //hide and show prev, next buttons
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
  if(flag){
    paginationLinks.selectAll("a")
                    .each(function(d, i){
                      if(i==currentProb)
                        d3.select(this)
                          .classed("prob-solved",true);
                    });
  }
  return flag;
}

//check if colored properly and displays latex
function showGraphLatex () {
  var l = "";
  if(checkColoring()){
    if(currentProb==problems.length-1)
      l = "\\[\\text{You did it!}\\]";
    else
      l = "\\[\\text{You did it! Proceed to next problem.}\\]";
  }
  else
    l = "\\[\\text{You can use at most " + numOfColors + " colors.}\\]";

  document.getElementById("output-text").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
