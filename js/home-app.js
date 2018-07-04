$(document).ready(function(){

  /*
    GRAPH STUFF BEGINS
  */

  var width = $(window).width(),
      height = $(window).height();

  var introH = $("#intro").height();
  $("#intro").css('margin-top', '' + (height-introH)/2 + 'px');

  var nodes = d3.range(101).map(function(val) { return {radius: Math.floor(Math.random()*6) + 10, id: val}; }),
      links = [],
      root = nodes[0],
      color = d3.scale.category20();

  root.radius = 0;
  root.fixed = true;
  root.x = width/2;
  root.y = height/2;

  var svg = d3.select("#home-graph")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var edges = svg.append("g")
                  .selectAll("line");

  svg.selectAll("circle")
      .data(nodes.slice(1), function(d) {return d.id;})
      .enter()
      .append("circle")
      .attr("r", function(d) { return d.radius; })
      .style("fill", function(d, i) { return color(i); });

  var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .gravity(0.05)
      .friction(0.95)
      .charge(function(d, i) { return i ? -60 : -1800; })
      .linkDistance(60)
      .chargeDistance(1.4*width)
      .size([width, height])
      .start();

  force.on("tick", function(e) {
    var q = d3.geom.quadtree(nodes),
        i = 0,
        n = nodes.length;

    //Collide detection; nodes are joined when they get close enough
    while (++i < n) q.visit(collide(nodes[i]));

    svg.selectAll("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    edges.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

    //delete edges after fixed number of ticks
    links.forEach(function(l, i){
      if(l.tickCounter < 100) {
        l.tickCounter++;
      }
      else {
        links.splice(i,1);
        updateEdges();
      }
    });
  });

  //repel nodes by cursor
  svg.on("mousemove", function() {
        var p1 = d3.mouse(this);
        root.px = p1[0];
        root.py = p1[1];
        force.resume();
      })
      .on("contextmenu", function(){d3.event.preventDefault();});

  //collision detection
  function collide(node) {
    //r decides the size of square in which nearby nodes will be checked for collision
    //if r < max dist b/w two touching nodes
    //then some bigger nodes may not join inspite of touching each other
    //less the value of r, less is frequency of joining nodes
    var r = node.radius + 5,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;

    return function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== node)) {
        var x = node.x - quad.point.x,
            y = node.y - quad.point.y,
            l = Math.sqrt(x*x + y*y),
            r = node.radius + quad.point.radius;

        //join the nodes if they touch
        if (l<r && quad.point!=nodes[0]) {
          links.push({source: node, target: quad.point, tickCounter: 0});
          updateEdges();
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }

  function updateEdges(){
    edges = edges.data(links);
    edges.enter().append("line");
    edges.exit().remove();
    force.start();
  }

  $(window).on('resize', function(){
    width = Math.max($(window).width(), 640);
    height = Math.min($(window).height(), width);
    svg.attr("width", width)
       .attr("height", height);
    force.size([width, height]);
    introH = $("#intro").height();
    $("#intro").css('margin-top', '' + (height-introH)/2 + 'px');
    root.px = width/2;
    root.py = height/2;
  });

  /*
    GRAPH STUFF ENDS
  */

  //generate content-list from content.js
  var contentList = $("#content-list");

  if(contentData){
    var i = 1;
    for(var unit in contentData){
      if(contentData.hasOwnProperty(unit)){
        var starItem = '';
        if(contentData[unit]['star']=="y") starItem = ' star-item';
        var newEntry = '<div class="list-container col-xs-6 col-md-4"><a href="unit.html?' + unit;
        newEntry += '" class="list-wrap"><span class="list-counter">' + i;
        newEntry += '</span><span class="list-item' + starItem + '">' + contentData[unit]['content-title'] + '</span></a></div>';
        contentList.append(newEntry);
        ++i;
      }
    }
  }

  //expand #content-list
  var moreList = $("#more-list .btn");

  moreList.click(function(){
    if($(this).text() == "Show All") {
      contentList.css( "max-height", 10000);
      $(this).text("Show Less");
    }
    else {
      contentList.css( "max-height", 270);
      $(this).text("Show All");
    }
  });

  //set random href to a#random-loader
  var unitLinks = $("a.list-wrap");
  var numOfUnits = unitLinks.length;
  var randIdx = Math.floor(Math.random()*numOfUnits);
  $("a#random-loader").attr("href", unitLinks[randIdx].getAttribute("href"));

  //change navbar style on scrolling
  var homeNav = $("#home-navbar");
  if (window.scrollY > 160) {
    homeNav.removeClass("transparent");
  }

  window.addEventListener("scroll", function() {
      if (window.scrollY > 160) {
        homeNav.removeClass("transparent");
      }
      else {
        homeNav.addClass("transparent");
      }
  }, false);

  //smooth scroll for hash anchors in navbar
  var $root = $('html, body');
  $('a').click(function() {
      $root.animate({
          scrollTop: $( $.attr(this, 'href') ).offset().top
      }, 300);
      return false;
  });

  /*//hide donation-target by default
  $(".donation-target").each(function(){
    $(this).hide();
  });

  //reveal on clicking respective buttons
  $("#upi-donation-button").click(function(){
    $("#upi-target").slideToggle();
  });*/

});
