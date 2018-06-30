//node ids are in order in which nodes come in existence
var nodes = [];
var links = [];

var problems = [

  {
    "order": 7,
    "links": [ [0,1], [0,2], [1,3], [2,3], [3,4], [3,5], [0,4], [0,5], [1,6], [2,6], [4,6], [5,6] ],
    "coords": [ [239,211], [222,129], [309,257], [335,146], [352,229], [265,100], [287,179] ]
  },

  {
    "order": 8,
    "links": [ [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], [0,4], [0,5], [1,5], [1,6], [2,6], [2,7], [3,7], [3,4] ],
    "coords": [ [384,197], [323,98], [200,127], [278,197], [310,268], [329,177], [257,135], [209,226] ]
  },

  {
    "order": 9,
    "links": [ [0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [0,6], [1,6], [2,7], [3,7], [4,8], [5,8], [6,7], [7,8], [8,6] ],
    "coords": [ [314,62], [200,81], [163,189], [243,280], [355,258], [389,147], [265,123], [237,205], [322,188] ]
  },

  {
    "order": 10,
    "links": [ [0,1], [1,2], [0,2], [1,3], [3,2], [2,4], [3,4], [4,5], [2,5], [5,6], [4,6], [6,7], [4,7], [6,8], [7,8], [6,9], [8,9] ],
    "coords": [ [319,324], [355,387], [390,324], [427,388], [465,324], [425,260], [499,259], [540,321], [571,256], [532,195] ]
  }

];

var currentProb = 0;

//universal width and height let index.htm control svg dimensions when needed
var w = univSvgWidth ? univSvgWidth : 616,
    h = univSvgHeight ? univSvgHeight :400,
    rad = 10;

var svg = d3.select("#svg-wrap")
            .append("div")
            .attr("id", "graph-area")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.select("#svg-wrap")
  .append("div")
  .attr("id", "graph-overlay")
  .append("div")
  .attr("id", "overlay-text")
  .html("Ooops!!<br>You disconnected the graph.<br>Retry.");

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
            .gravity(0.1)
            .on("tick",tick)
            .start();

var colors = d3.scale.category10();

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

var disconnected = false;

function removeEdge(d, i){
  if(links.length==nodes.length-1) return;
  var u = d.source.id-1,
      v = d.target.id-1;
  nodes[u].adj.splice(nodes[u].adj.indexOf(v),1);
  nodes[v].adj.splice(nodes[v].adj.indexOf(u),1);
  links.splice(links.indexOf(d),1);
  d3.event.preventDefault();
  restart();
  checkAndLoad();
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
          	return colors(d.id);
          })
          .append("title")
          .text(function(d){return "v"+d.id;});

  vertices.exit().remove();
  force.start();
}

svg.on("contextmenu", function(){d3.event.preventDefault();});

d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);

restart();
setGraph(0);

function setGraph(index){
  $("#graph-overlay").fadeOut();
  currentProb = index;
  var graphToLoad = problems[index];
  //remove current nodes and update
  nodes.splice(0);
  links.splice(0);
  restart();
  //push nodes and links
  //coords is for initial positioning of nodes
  //adj stores indices of adjacent nodes
  //vis means visited
  for(var i=0; i<graphToLoad.order; i++){
    nodes.push({
      id:i+1,
      x:graphToLoad.coords[i][0],
      y:graphToLoad.coords[i][1],
      adj:[],
      vis:false
    });
  }
  graphToLoad.links.forEach(function(d){
    links.push({source:d[0], target:d[1]});
    nodes[d[0]].adj.push(d[1]);
    nodes[d[1]].adj.push(d[0]);
  });
  force.start();
  restart();
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
  checkAndLoad();
}

function isDisconnected(){
  var ctr=0, u, v;
  var q = [0];
  nodes[0].vis = true;
  while(q.length){
    u = q.shift();
    ctr++;
    for(let i=0; i<nodes[u].adj.length; i++){
      v = nodes[u].adj[i];
      if(!nodes[v].vis){
        q.push(v);
        nodes[v].vis = true;
      }
    }
  }
  for(let i=0; i<nodes.length; i++) nodes[i].vis = false;
  if(ctr==nodes.length) return false;
  return true;
}

function checkAndLoad(){
  if(isDisconnected()){
    $("#graph-overlay").fadeIn();
    setTimeout(function(){setGraph(currentProb);}, 2500);
    showGraphLatex(-1);
    return;
  }

  var rem = links.length-nodes.length+1;
  showGraphLatex(rem);

  if(rem==0 && currentProb<problems.length-1){
    //set currentProb as solved
    paginationLinks.selectAll("a")
                    .each(function(d, i){
                      if(i==currentProb)
                        d3.select(this)
                          .classed("prob-solved",true);
                    });
    setTimeout(function(){setGraph(++currentProb);}, 2500);
  }
}

//handling output area
function showGraphLatex(rem) {
  var l = "\\[";
  if(rem==-1) l += "\\text{Crap!!}\\]";
  else if(rem==0) l += "\\text{Now that's a spanning tree}\\]";
  else l += rem + "\\text{ more to go.}\\]";

  document.getElementById("output-text").textContent = l;
  //recall mathjax
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}
