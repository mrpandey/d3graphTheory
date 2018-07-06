var currentProb = 0;

//universal width and height let index.htm control svg dimensions when needed
var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight :400,
    rad = 10,
    cx = w/2,
    cy = h/2;

//node ids are in order in which nodes come in existence
//keep color values in range [1,10]
var nodes = [];

var links = [];

var problems = [

  {
    "order": 4,
    "colors": [1, 1, 1, 1],
    "coords": [ [cx+100, cy-100], [cx+100,cy+100], [cx-100,cy+100], [cx-100,cy-100] ],
    "links": [],
    "latex": "\\[\\text{Empty graph: }\\hspace{5px} \\chi(G)=1\\]"
  },

  {
    "order": 6,
    "colors": [3, 3, 2, 2, 2, 2],
    "coords": [ [50,0], [0,50], [cx-50,cy+50], [cx-50,cy-50], [cx+50,cy-50], [cx+50,cy+50] ],
    "links": [ [0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5] ],
    "latex": "\\[\\text{Non-empty Bipartite Graph: }\\hspace{5px} \\chi(K_{2,4})=2\\]"
  },

  {
    "order": 6,
    "colors": [1, 4, 4, 4, 4, 4],
    "coords": [ [cx,cy], [0,cy], [0,0], [cx,0], [w,0], [w,cy] ],
    "links": [ [0,1], [0,2], [0,3], [0,4], [0,5] ],
    "latex": "\\[\\text{Non-empty Star Graph: }\\hspace{5px} \\chi(S_6)=2\\]"
  },

  {
    "order": 6,
    "colors": [4, 2, 4, 2, 4, 2],
    "coords": [ [0,0], [0,cy], [0,h], [w,h], [w,cy], [w,0] ],
    "links": [ [0,1], [1,2], [2,3], [3,4], [4,5], [5,0] ],
    "latex": "\\[\\text{Cycle Graph of Even Order: }\\hspace{5px} \\chi(C_6)=2\\]"
  },

  {
    "order": 5,
    "colors": [5, 6, 5, 6, 7],
    "coords": [ [cx,0], [w,cy], [w,h], [0,h], [0,cy] ],
    "links": [ [0,1], [1,2], [2,3], [3,4], [4,0] ],
    "latex": "\\[\\text{Cycle Graph of Odd Order: }\\hspace{5px} \\chi(C_5)=3\\]"
  },

  {
    "order": 6,
    "colors": [6, 8, 1, 6, 8, 4],
    "coords": [ [cx,cy], [cx,cy-200], [cx+190,cy-62], [cx+118,cy+162], [cx-118,cy+162], [cx-190,cy-62] ],
    "links": [ [0,1], [0,2], [0,3], [0,4], [0,5], [1,2], [2,3], [3,4], [4,5], [5,1] ],
    "latex": "\\[\\text{Wheel Graph of Even Order: }\\hspace{5px} \\chi(W_6)=4\\]"
  },

  {
    "order": 7,
    "colors": [5, 6, 3, 6, 3, 6, 3],
    "coords": [ [cx,cy], [cx+200,cy], [cx+100,cy+173], [cx-100,cy+173], [cx-200,cy], [cx-100,cy-173], [cx+100,cy-173] ],
    "links": [ [0,1], [0,2], [0,3], [0,4], [0,5], [0,6], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1] ],
    "latex": "\\[\\text{Wheel Graph of Odd Order: }\\hspace{5px} \\chi(W_7)=3\\]"
  },

  {
    "order": 6,
    "colors": [1, 2, 3, 4, 5, 6],
    "coords": [ [0,0], [w,0], [w,cy], [w,h], [0,h], [0,cy] ],
    "links": [ [0,1], [0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,3], [2,4], [2,5], [3,4], [3,5], [4,5]  ],
    "latex": "\\[\\text{Complete Graph: }\\hspace{5px} \\chi(K_6)=6\\]"
  }

];

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
            .linkDistance(80)
            .linkStrength(0.9)
            .charge(-600)
            .chargeDistance((w+h)/2)
            .gravity(0.08)
            //.friction(0.88)
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

//update the simulation
function tick() {

  edges.attr("x1", function(d) { return d.source.x; })
       .attr("y1", function(d) { return d.source.y; })
       .attr("x2", function(d) { return d.target.x; })
       .attr("y2", function(d) { return d.target.y; });

  vertices.attr("cx", function(d) { return d.x; })
       .attr("cy", function(d) { return d.y; });

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
    nodes.push({id:i+1, color:graphToLoad.colors[i], x:graphToLoad.coords[i][0], y:graphToLoad.coords[i][1]});
  }
  graphToLoad.links.forEach(function(d){
    links.push({source:d[0], target:d[1]});
  });
  force.start();

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
  restart();
  showGraphLatex();
}

function showGraphLatex () {
  var l = problems[currentProb].latex;
  document.getElementById("output-text").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
