import { Component, ViewChild, OnInit, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import * as d3 from "d3";
import { AngularFireDatabase } from "@angular/fire/database";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  public users: number = 0;
  public showChatBox: boolean = true;

  @ViewChild("msgRef") msgRef;
  constructor(
    public afAuth: AngularFireAuth,
    private userService: UserService,
    private db: AngularFireDatabase,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // this.drawHeatMap();
    // this.drawSankeyDiagram();
    // this.drawSunburstDiagram();
    this.drawScatterBubble();
  }

  drawHeatMap() {
    "use strict";

    var csvDataString =
      "day,hour,value\n\
1,1,16\n\
1,2,20\n\
1,3,0\n\
1,4,0\n\
1,5,0\n\
1,6,2\n\
1,7,0\n\
1,8,9\n\
1,9,25\n\
1,10,49\n\
1,11,57\n\
1,12,61\n\
1,13,37\n\
1,14,66\n\
1,15,70\n\
1,16,55\n\
1,17,51\n\
1,18,55\n\
1,19,17\n\
1,20,20\n\
1,21,9\n\
1,22,4\n\
1,23,0\n\
1,24,12\n\
2,1,6\n\
2,2,2\n\
2,3,0\n\
2,4,0\n\
2,5,0\n\
2,6,2\n\
2,7,4\n\
2,8,11\n\
2,9,28\n\
2,10,49\n\
2,11,51\n\
2,12,47\n\
2,13,38\n\
2,14,65\n\
2,15,60\n\
2,16,50\n\
2,17,65\n\
2,18,50\n\
2,19,22\n\
2,20,11\n\
2,21,12\n\
2,22,9\n\
2,23,0\n\
2,24,13\n\
3,1,5\n\
3,2,8\n\
3,3,8\n\
3,4,0\n\
3,5,0\n\
3,6,2\n\
3,7,5\n\
3,8,12\n\
3,9,34\n\
3,10,43\n\
3,11,54\n\
3,12,44\n\
3,13,40\n\
3,14,48\n\
3,15,54\n\
3,16,59\n\
3,17,60\n\
3,18,51\n\
3,19,21\n\
3,20,16\n\
3,21,9\n\
3,22,5\n\
3,23,4\n\
3,24,7\n\
4,1,0\n\
4,2,0\n\
4,3,0\n\
4,4,0\n\
4,5,0\n\
4,6,2\n\
4,7,4\n\
4,8,13\n\
4,9,26\n\
4,10,58\n\
4,11,61\n\
4,12,59\n\
4,13,53\n\
4,14,54\n\
4,15,64\n\
4,16,55\n\
4,17,52\n\
4,18,53\n\
4,19,18\n\
4,20,3\n\
4,21,9\n\
4,22,12\n\
4,23,2\n\
4,24,8\n\
5,1,2\n\
5,2,0\n\
5,3,8\n\
5,4,2\n\
5,5,0\n\
5,6,2\n\
5,7,4\n\
5,8,14\n\
5,9,31\n\
5,10,48\n\
5,11,46\n\
5,12,50\n\
5,13,66\n\
5,14,54\n\
5,15,56\n\
5,16,67\n\
5,17,54\n\
5,18,23\n\
5,19,14\n\
5,20,6\n\
5,21,8\n\
5,22,7\n\
5,23,0\n\
5,24,8\n\
6,1,2\n\
6,2,0\n\
6,3,2\n\
6,4,0\n\
6,5,0\n\
6,6,0\n\
6,7,4\n\
6,8,8\n\
6,9,8\n\
6,10,6\n\
6,11,14\n\
6,12,12\n\
6,13,9\n\
6,14,14\n\
6,15,0\n\
6,16,4\n\
6,17,7\n\
6,18,6\n\
6,19,0\n\
6,20,0\n\
6,21,0\n\
6,22,0\n\
6,23,0\n\
6,24,0\n\
7,1,7\n\
7,2,6\n\
7,3,0\n\
7,4,0\n\
7,5,0\n\
7,6,0\n\
7,7,0\n\
7,8,0\n\
7,9,0\n\
7,10,0\n\
7,11,2\n\
7,12,2\n\
7,13,5\n\
7,14,6\n\
7,15,0\n\
7,16,4\n\
7,17,0\n\
7,18,2\n\
7,19,10\n\
7,20,7\n\
7,21,0\n\
7,22,19\n\
7,23,9\n\
7,24,4";

    var margin = { top: 50, right: 0, bottom: 100, left: 150 },
      width = 1600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 24),
      legendElementWidth = gridSize * 2,
      buckets = 9,
      colors = [
        "#ffffd9",
        "#edf8b1",
        "#c7e9b4",
        "#7fcdbb",
        "#41b6c4",
        "#1d91c0",
        "#225ea8",
        "#253494",
        "#081d58"
      ], // alternatively colorbrewer.YlGnBu[9]
      //days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      //times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
      times = [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
      ];

    var data1 = d3.csvParse(csvDataString);

    var dataArray = d3.csvParse(csvDataString, function(d) {
      return {
        day: +d.day,
        hour: +d.hour,
        value: +d.value
      };
    });

    var dataHandler = function(error, data) {
      var colorScale = d3
        .scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);

      var svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg
        .selectAll(".dayLabel")
        .data(days)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", 0)
        .attr("y", function(d, i) {
          return i * gridSize;
        })
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
        .attr("class", function(d, i) {
          return i >= 0 && i <= 4
            ? "dayLabel mono axis axis-workweek"
            : "dayLabel mono axis";
        });

      var timeLabels = svg
        .selectAll(".timeLabel")
        .data(times)
        .enter()
        .append("text")
        .text(function(d) {
          return d;
        })
        .attr("x", function(d, i) {
          return i * gridSize;
        })
        .attr("y", 0)
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + gridSize / 2 + ", -6)")
        .attr("class", function(d, i) {
          return i >= 7 && i <= 16
            ? "timeLabel mono axis axis-worktime"
            : "timeLabel mono axis";
        });

      var heatMap = svg
        .selectAll(".hour")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
          return (d.hour - 1) * gridSize;
        })
        .attr("y", function(d) {
          return (d.day - 1) * gridSize;
        })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", colors[0]);

      heatMap
        .transition()
        .duration(3000)
        .style("fill", function(d) {
          return colorScale(d.value);
        });

      heatMap.append("title").text(function(d) {
        return d.value;
      });

      //   var legend = svg
      //     .selectAll(".legend")
      //     .data([0].concat(colorScale.quantiles()), function(d) {
      //       return d;
      //     })
      //     .enter()
      //     .append("g")
      //     .attr("class", "legend");

      //   legend
      //     .append("rect")
      //     .attr("x", function(d, i) {
      //       return legendElementWidth * i;
      //     })
      //     .attr("y", height)
      //     .attr("width", legendElementWidth)
      //     .attr("height", gridSize / 2)
      //     .style("fill", function(d, i) {
      //       return colors[i];
      //     });

      //   legend
      //     .append("text")
      //     .attr("class", "mono")
      //     .text(function(d) {
      //       return "= " + Math.round(d);
      //     })
      //     .attr("x", function(d, i) {
      //       return legendElementWidth * i;
      //     })
      //     .attr("y", height + gridSize);
    };

    dataHandler(null, dataArray);
  }

  drawSankeyDiagram() {
    d3.sankey = function() {
      var sankey = {
          nodeWidth: null,
          nodePadding: null,
          size: null,
          nodes: null,
          links: null,
          layout: null,
          relayout: null,
          link: null
        },
        nodeWidth = 24,
        nodePadding = 8,
        size = [1, 1],
        nodes = [],
        links = [];

      sankey.nodeWidth = function(_) {
        if (!arguments.length) return nodeWidth;
        nodeWidth = +_;
        return sankey;
      };

      sankey.nodePadding = function(_) {
        if (!arguments.length) return nodePadding;
        nodePadding = +_;
        return sankey;
      };

      sankey.nodes = function(_) {
        if (!arguments.length) return nodes;
        nodes = _;
        return sankey;
      };

      sankey.links = function(_) {
        if (!arguments.length) return links;
        links = _;
        return sankey;
      };

      sankey.size = function(_) {
        if (!arguments.length) return size;
        size = _;
        return sankey;
      };

      sankey.layout = function(iterations) {
        computeNodeLinks();
        computeNodeValues();
        computeNodeBreadths();
        computeNodeDepths(iterations);
        computeLinkDepths();
        return sankey;
      };

      sankey.relayout = function() {
        computeLinkDepths();
        return sankey;
      };

      sankey.link = function() {
        var curvature = 0.5;

        function link(d) {
          var x0 = d.source.x + d.source.dx,
            x1 = d.target.x,
            xi = d3.interpolateNumber(x0, x1),
            x2 = xi(curvature),
            x3 = xi(1 - curvature),
            y0 = d.source.y + d.sy + d.dy / 2,
            y1 = d.target.y + d.ty + d.dy / 2;
          return (
            "M" +
            x0 +
            "," +
            y0 +
            "C" +
            x2 +
            "," +
            y0 +
            " " +
            x3 +
            "," +
            y1 +
            " " +
            x1 +
            "," +
            y1
          );
        }

        //   link.curvature = function(_) {
        //     if (!arguments.length) return curvature;
        //     curvature = +_;
        //     return link;
        //   };

        return link;
      };

      // Populate the sourceLinks and targetLinks for each node.
      // Also, if the source and target are not objects, assume they are indices.
      function computeNodeLinks() {
        nodes.forEach(function(node) {
          node.sourceLinks = [];
          node.targetLinks = [];
        });
        links.forEach(function(link) {
          var source = link.source,
            target = link.target;
          if (typeof source === "number")
            source = link.source = nodes[link.source];
          if (typeof target === "number")
            target = link.target = nodes[link.target];
          source.sourceLinks.push(link);
          target.targetLinks.push(link);
        });
      }

      // Compute the value (size) of each node by summing the associated links.
      function computeNodeValues() {
        nodes.forEach(function(node) {
          node.value = Math.max(
            d3.sum(node.sourceLinks, value),
            d3.sum(node.targetLinks, value)
          );
        });
      }

      // Iteratively assign the breadth (x-position) for each node.
      // Nodes are assigned the maximum breadth of incoming neighbors plus one;
      // nodes with no incoming links are assigned breadth zero, while
      // nodes with no outgoing links are assigned the maximum breadth.
      function computeNodeBreadths() {
        var remainingNodes = nodes,
          nextNodes,
          x = 0;

        while (remainingNodes.length) {
          nextNodes = [];
          remainingNodes.forEach(function(node) {
            node.x = x;
            node.dx = nodeWidth;
            node.sourceLinks.forEach(function(link) {
              if (nextNodes.indexOf(link.target) < 0) {
                nextNodes.push(link.target);
              }
            });
          });
          remainingNodes = nextNodes;
          ++x;
        }

        //
        moveSinksRight(x);
        scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
      }

      function moveSourcesRight() {
        nodes.forEach(function(node) {
          if (!node.targetLinks.length) {
            node.x =
              d3.min(node.sourceLinks, function(d) {
                return d.target.x;
              }) - 1;
          }
        });
      }

      function moveSinksRight(x) {
        nodes.forEach(function(node) {
          if (!node.sourceLinks.length) {
            node.x = x - 1;
          }
        });
      }

      function scaleNodeBreadths(kx) {
        nodes.forEach(function(node) {
          node.x *= kx;
        });
      }

      function computeNodeDepths(iterations) {
        var nodesByBreadth = d3
          .nest()
          .key(function(d) {
            return d.x;
          })
          .sortKeys(d3.ascending)
          .entries(nodes)
          .map(function(d) {
            return d.values;
          });

        //
        initializeNodeDepth();
        resolveCollisions();
        for (var alpha = 1; iterations > 0; --iterations) {
          relaxRightToLeft((alpha *= 0.99));
          resolveCollisions();
          relaxLeftToRight(alpha);
          resolveCollisions();
        }

        function initializeNodeDepth() {
          var ky = d3.min(nodesByBreadth, function(nodes) {
            return (
              (size[1] - (nodes.length - 1) * nodePadding) /
              d3.sum(nodes, value)
            );
          });

          nodesByBreadth.forEach(function(nodes) {
            nodes.forEach(function(node, i) {
              node.y = i;
              node.dy = node.value * ky;
            });
          });

          links.forEach(function(link) {
            link.dy = link.value * ky;
          });
        }

        function relaxLeftToRight(alpha) {
          nodesByBreadth.forEach(function(nodes, breadth) {
            nodes.forEach(function(node) {
              if (node.targetLinks.length) {
                var y =
                  d3.sum(node.targetLinks, weightedSource) /
                  d3.sum(node.targetLinks, value);
                node.y += (y - center(node)) * alpha;
              }
            });
          });

          function weightedSource(link) {
            return center(link.source) * link.value;
          }
        }

        function relaxRightToLeft(alpha) {
          nodesByBreadth
            .slice()
            .reverse()
            .forEach(function(nodes) {
              nodes.forEach(function(node) {
                if (node.sourceLinks.length) {
                  var y =
                    d3.sum(node.sourceLinks, weightedTarget) /
                    d3.sum(node.sourceLinks, value);
                  node.y += (y - center(node)) * alpha;
                }
              });
            });

          function weightedTarget(link) {
            return center(link.target) * link.value;
          }
        }

        function resolveCollisions() {
          nodesByBreadth.forEach(function(nodes) {
            var node,
              dy,
              y0 = 0,
              n = nodes.length,
              i;

            // Push any overlapping nodes down.
            nodes.sort(ascendingDepth);
            for (i = 0; i < n; ++i) {
              node = nodes[i];
              dy = y0 - node.y;
              if (dy > 0) node.y += dy;
              y0 = node.y + node.dy + nodePadding;
            }

            // If the bottommost node goes outside the bounds, push it back up.
            dy = y0 - nodePadding - size[1];
            if (dy > 0) {
              y0 = node.y -= dy;

              // Push any overlapping nodes back up.
              for (i = n - 2; i >= 0; --i) {
                node = nodes[i];
                dy = node.y + node.dy + nodePadding - y0;
                if (dy > 0) node.y -= dy;
                y0 = node.y;
              }
            }
          });
        }

        function ascendingDepth(a, b) {
          return a.y - b.y;
        }
      }

      function computeLinkDepths() {
        nodes.forEach(function(node) {
          node.sourceLinks.sort(ascendingTargetDepth);
          node.targetLinks.sort(ascendingSourceDepth);
        });
        nodes.forEach(function(node) {
          var sy = 0,
            ty = 0;
          node.sourceLinks.forEach(function(link) {
            link.sy = sy;
            sy += link.dy;
          });
          node.targetLinks.forEach(function(link) {
            link.ty = ty;
            ty += link.dy;
          });
        });

        function ascendingSourceDepth(a, b) {
          return a.source.y - b.source.y;
        }

        function ascendingTargetDepth(a, b) {
          return a.target.y - b.target.y;
        }
      }

      function center(node) {
        return node.y + node.dy / 2;
      }

      function value(link) {
        return link.value;
      }

      return sankey;
    };
    var units = "Widgets";

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 50, left: 150 },
      width = 1400 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.0f"), // zero decimal places
      format = function(d) {
        return formatNumber(d) + " " + units;
      },
      color = d3.scaleOrdinal(d3.schemeCategory20);

    // append the svg object to the body of the page
    var svg = d3
      .select("#sankey")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3
      .sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);

    var path = sankey.link();

    // load the data
    d3.csv("/assets/sankey.csv", function(error, data) {
      //set up graph in same style as original example but empty
      let graph = { nodes: [], links: [] };
      data.forEach(function(d) {
        graph.nodes.push({ name: d.source });
        graph.nodes.push({ name: d.target });
        graph.links.push({
          source: d.source,
          target: d.target,
          value: +d.value
        });
      });

      // return only the distinct / unique nodes
      graph.nodes = d3.keys(
        d3
          .nest()
          .key(function(d) {
            return d.name;
          })
          .object(graph.nodes)
      );

      // loop through each link replacing the text with its index from node
      graph.links.forEach(function(d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
      });

      // now loop through each nodes to make nodes an array of objects
      // rather than an array of strings
      graph.nodes.forEach(function(d, i) {
        graph.nodes[i] = { name: d };
      });

      sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

      // add in the links
      var link = svg
        .append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        });

      // add the link titles
      link.append("title").text(function(d) {
        return d.source.name + " → " + d.target.name + "\n" + format(d.value);
      });

      // add in the nodes
      var node = svg
        .append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(
          d3
            .drag()
            .subject(function(d) {
              return d;
            })
            .on("start", function() {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove)
        );

      // add the rectangles for the nodes
      node
        .append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
          return (d.color = color(d.name.replace(/ .*/, "")));
        })
        .style("stroke", function(d) {
          return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function(d) {
          return d.name + "\n" + format(d.value);
        });

      // add in the title for the nodes
      node
        .append("text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) {
          return d.name;
        })
        .filter(function(d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr(
          "transform",
          "translate(" +
            d.x +
            "," +
            (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
            ")"
        );
        sankey.relayout();
        link.attr("d", path);
      }
    });
  }

  drawSunburstDiagram() {
    const width = window.innerWidth,
      height = window.innerHeight,
      maxRadius = Math.min(width, height) / 2 - 5;

    const formatNumber = d3.format(",d");

    const x = d3
      .scaleLinear()
      .range([0, 2 * Math.PI])
      .clamp(true);

    const y = d3.scaleSqrt().range([maxRadius * 0.1, maxRadius]);

    const color = d3.scaleOrdinal(d3.schemeCategory20);

    const partition = d3.partition();

    const arc = d3
      .arc()
      .startAngle(d => x(d.x0))
      .endAngle(d => x(d.x1))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));

    const middleArcLine = d => {
      const halfPi = Math.PI / 2;
      const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        angles.reverse();
      }

      const path = d3.path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    const textFits = d => {
      const CHAR_SPACE = 6;

      const deltaAngle = x(d.x1) - x(d.x0);
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
      const perimeter = r * deltaAngle;

      return d.data.name.length * CHAR_SPACE < perimeter;
    };

    const svg = d3
      .select("#sunburst")
      .append("svg")
      .style("width", "100vw")
      .style("height", "100vh")
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
      .on("click", () => focusOn()); // Reset zoom on canvas click

    d3.json(
      "https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json",
      (error, root) => {
        if (error) throw error;

        root = d3.hierarchy(root);
        root.sum(d => d.size);

        const slice = svg
          .selectAll("g.slice")
          .data(partition(root).descendants());

        slice.exit().remove();

        const newSlice = slice
          .enter()
          .append("g")
          .attr("class", "slice")
          .on("click", d => {
            d3.event.stopPropagation();
            focusOn(d);
          });

        newSlice
          .append("title")
          .text(d => d.data.name + "\n" + formatNumber(d.value));

        newSlice
          .append("path")
          .attr("class", "main-arc")
          .style("fill", d => color((d.children ? d : d.parent).data.name))
          .attr("d", arc);

        newSlice
          .append("path")
          .attr("class", "hidden-arc")
          .attr("id", (_, i) => `hiddenArc${i}`)
          .attr("d", middleArcLine);

        const text = newSlice
          .append("text")
          .attr("display", d => (textFits(d) ? null : "none"));

        // Add white contour
        text
          .append("textPath")
          .attr("startOffset", "50%")
          .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
          .text(d => d.data.name)
          .style("fill", "none")
          .style("stroke", "#fff")
          .style("stroke-width", 5)
          .style("stroke-linejoin", "round");

        text
          .append("textPath")
          .attr("startOffset", "50%")
          .attr("xlink:href", (_, i) => `#hiddenArc${i}`)
          .text(d => d.data.name);
      }
    );

    function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
      // Reset to top-level if no data point specified

      const transition = svg
        .transition()
        .duration(750)
        .tween("scale", () => {
          const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]);
          return t => {
            x.domain(xd(t));
            y.domain(yd(t));
          };
        });

      transition.selectAll("path.main-arc").attrTween("d", d => () => arc(d));

      transition
        .selectAll("path.hidden-arc")
        .attrTween("d", d => () => middleArcLine(d));

      transition
        .selectAll("text")
        .attrTween("display", d => () => (textFits(d) ? null : "none"));

      moveStackToFront(d);

      //

      function moveStackToFront(elD) {
        svg
          .selectAll(".slice")
          .filter(d => d === elD)
          .each(function(d) {
            this.parentNode.appendChild(this);
            if (d.parent) {
              moveStackToFront(d.parent);
            }
          });
      }
    }
  }

  drawScatterBubble() {
    var margin = { top: 10, right: 30, bottom: 40, left: 50 },
      width = 520 - margin.left - margin.right,
      height = 520 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add the grey background that makes ggplot2 famous
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height)
      .attr("width", height)
      .style("fill", "EBEBEB");

    //Read the data
    d3.csv(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv",
      function(data) {
        // Add X axis
        var x = d3
          .scaleLinear()
          .domain([4 * 0.95, 8 * 1.001])
          .range([0, width]);
        svg
          .append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(
            d3
              .axisBottom(x)
              .tickSize(-height * 1.3)
              .ticks(10)
          )
          .select(".domain")
          .remove();

        // Add Y axis
        var y = d3
          .scaleLinear()
          .domain([-0.001, 9 * 1.01])
          .range([height, 0])
          .nice();
        svg
          .append("g")
          .call(
            d3
              .axisLeft(y)
              .tickSize(-width * 1.3)
              .ticks(7)
          )
          .select(".domain")
          .remove();

        // Customization
        svg.selectAll(".tick line").attr("stroke", "white");

        // Add X axis label:
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("x", width / 2 + margin.left)
          .attr("y", height + margin.top + 20)
          .text("Sepal Length");

        // Y axis label:
        svg
          .append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left + 20)
          .attr("x", -margin.top - height / 2 + 20)
          .text("Petal Length");

        // Color scale: give me a specie name, I return a color
        var color = d3
          .scaleOrdinal()
          .domain(["setosa", "versicolor", "virginica"])
          .range(["#F8766D", "#00BA38", "#619CFF"]);

        // Add dots
        svg
          .append("g")
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x(d.Sepal_Length);
          })
          .attr("cy", function(d) {
            return y(d.Petal_Length);
          })
          .attr("r", function(d){
            console.log("d is : ", d)
            return parseFloat(d.Sepal_Length)
          })
          .style("fill", function(d) {
            return color(d.Species);
          });
      }
    );
  }

  signInWithGoogle() {
    this.afAuth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(result => {
        let user = {
          id: "",
          socialId: result.additionalUserInfo.profile["id"],
          password: "12345",
          token: result.credential["accessToken"],
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          gender: "",
          birthday: ""
        };
        this.db.database
          .ref("users")
          .push(user)
          .then(data => {
            // console.log("data is : ", data.key);
            user.id = data.key;
            this.userService.setUser(user);
            localStorage.setItem("chat-user", JSON.stringify(user));
            this.ngZone.run(() => this.router.navigate(["chat"]));
          });
      });
  }
}
