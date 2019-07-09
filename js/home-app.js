"use strict";
$(document).ready(function() {
  /*
    GRAPH STUFF BEGINS
  */
  var width = Math.max($(window).width(), 640),
    height = Math.min($(window).height(), width);

  var introH = $("#intro").height();
  $("#intro").css("margin-top", "" + (height - introH) / 2 + "px");

  var nodes = d3.range(91).map(function(val) {
    return {
      radius: Math.floor(Math.random() * 8) + 7,
      id: val,
      degree: 0,
      x: Math.random() * width,
      y: Math.random() * height
    };
  });

  var links = [],
    root = nodes[0],
    color = d3.schemeSet3,
    maxDegree = 5,
    maxLinkLen = 100,
    maxLinkTick = 200;

  root.radius = 0;
  root.fx = width / 2;
  root.fy = height / 2;

  var svg = d3
    .select("#home-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var edges = svg.append("g").selectAll("line");

  var vertices = svg
    .selectAll("circle")
    .data(nodes.slice(1), function(d) {
      return d.id;
    })
    .enter()
    .append("circle")
    .attr("r", function(d) {
      return d.radius;
    })
    .style("fill", function(d, i) {
      return color[i % 12];
    });

  var force = d3
    .forceSimulation(nodes)
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(function(d, i) {
          return i ? -30 : -2000;
        })
        .distanceMax((width + height) / 2)
    )
    .force(
      "link",
      d3
        .forceLink(links)
        .distance(69)
        .strength(0.9)
    )
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .on("tick", tick);

  function tick() {
    var q = d3
      .quadtree()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .addAll(nodes);

    var i = 0,
      n = nodes.length;

    //Collide detection; nodes are connected by edge when they get close enough
    while (++i < n) q.visit(collide(nodes[i]));

    vertices
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });

    edges
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    //delete edges after fixed number of ticks
    links.forEach(function(l, i) {
      if (l.tickCounter < maxLinkTick) {
        l.tickCounter++;
      } else {
        l.source.degree--;
        l.target.degree--;
        links.splice(i, 1);
        updateEdges();
      }
    });
  }

  //repel nodes by cursor
  svg
    .on("mousemove", function() {
      var coords = d3.mouse(d3.event.currentTarget);
      root.fx = coords[0];
      root.fy = coords[1];
      force.alpha(0.8).restart();
    })
    .on("contextmenu", function() {
      d3.event.preventDefault();
    });

  //collision detection
  function collide(node) {
    //r decides the size of square in which nearby nodes will be checked for collision
    //if r < max dist b/w two touching nodes
    //then some bigger nodes may not connect inspite of touching each other
    //less the value of r, less is frequency of adding links
    var r = node.radius + 7,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;

    return function(qnode, x1, y1, x2, y2) {
      //if qnode.length is undefined, then qnode is leaf and qnode.data exists
      if (
        !qnode.length &&
        qnode.data !== node &&
        node.degree < maxDegree &&
        links.length < maxLinkLen
      ) {
        let qd = qnode.data;
        let x = node.x - qd.x,
          y = node.y - qd.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + qd.radius;

        //add edge b/w the nodes if they touch/overlap
        if (l <= r && qd.id != 0 && qd.degree < maxDegree) {
          node.degree++;
          qd.degree++;
          links.push({ source: node, target: qd, tickCounter: 0 });
          updateEdges();
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }

  function updateEdges() {
    edges = edges.data(links);
    edges.exit().remove();
    edges = edges
      .enter()
      .append("line")
      .merge(edges);
    force.nodes(nodes);
    force.force("link").links(links);
    force.alpha(0.8).restart();
  }

  $(window).on("resize", function() {
    width = Math.max($(window).width(), 640);
    height = Math.min($(window).height(), width);
    svg.attr("width", width).attr("height", height);
    force.force("x").x(width / 2);
    force.force("y").y(height / 2);
    introH = $("#intro").height();
    $("#intro").css("margin-top", "" + (height - introH) / 2 + "px");
    root.fx = width / 2;
    root.fy = height / 2;
  });

  /*
    GRAPH STUFF ENDS
  */

  //generate content-list from content.js
  var contentList = $("#content-list");

  if (contentData) {
    var i = 1;
    for (var unit in contentData) {
      if (contentData.hasOwnProperty(unit)) {
        var starItem = "";
        if (contentData[unit].star == "y") starItem = " star-item";
        var newEntry =
          '<div class="list-container col-xs-6 col-md-4"><a href="unit.html?' +
          unit;
        newEntry += '" class="list-wrap"><span class="list-counter">' + i;
        newEntry +=
          '</span><span class="list-item' +
          starItem +
          '">' +
          contentData[unit]["content-title"] +
          "</span></a></div>";
        contentList.append(newEntry);
        ++i;
      }
    }
  }

  //expand #content-list
  var moreList = $("#more-list .btn");

  moreList.click(function() {
    if ($(this).text() == "Show All") {
      contentList.css("max-height", 10000);
      $(this).text("Show Less");
    } else {
      contentList.css("max-height", 270);
      $(this).text("Show All");
    }
  });

  //set random href to a#random-loader
  var unitLinks = $("a.list-wrap");
  var numOfUnits = unitLinks.length;
  var randIdx = Math.floor(Math.random() * numOfUnits);
  $("a#random-loader").attr("href", unitLinks[randIdx].getAttribute("href"));

  //change navbar style on scrolling
  var homeNav = $("#home-navbar");
  if (window.scrollY > 160) {
    homeNav.removeClass("transparent");
  }

  window.addEventListener(
    "scroll",
    function() {
      if (window.scrollY > 160) {
        homeNav.removeClass("transparent");
      } else {
        homeNav.addClass("transparent");
      }
    },
    false
  );

  //smooth scroll for hash anchors in navbar
  var $root = $("html, body");
  $("a").click(function() {
    $root.animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top
      },
      300
    );
    return false;
  });

  /*//hide donation-target by default
  $(".donation-target").each(function() {
    $(this).hide();
  });

  //reveal on clicking respective buttons
  $("#upi-donation-button").click(function() {
    $("#upi-target").slideToggle();
  });*/
});
