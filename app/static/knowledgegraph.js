
var canvas = d3.select("#network"),
  width = canvas.attr("width"),
  height = canvas.attr("height"),
  ctx = canvas.node().getContext("2d"),
  r = 30,
  color = d3.scaleOrdinal(d3.schemeCategory20),
  simulation = d3.forceSimulation()
    .force("x", d3.forceX(width/2))
    .force("y", d3.forceY(height/2))
    .force("collide", d3.forceCollide(r+30))
    .force("charge", d3.forceManyBody()
      .strength(-30))
    .force("link", d3.forceLink()
      .id(function (d) { return d.name; }));

d3.json("/static/dataset.json", function (err, graph) {
//d3.json("/static/VotacionesSenado2017.json", function (err, graph) {
//   d3.json("{{ url_for('static', filename='VotacionesSenado2017.json') }}", function (err, graph) {
  if (err) throw err;

  simulation.nodes(graph.nodes);
  simulation.force("link")
    .links(graph.links);
  simulation.on("tick", update);

  canvas
      .call(d3.drag()
          .container(canvas.node())
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  function update() {
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = "#00f";
    graph.links.forEach(drawLink);
    ctx.stroke();


    ctx.globalAlpha = 1.0;
    graph.nodes.forEach(drawNode);
  }

  function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  }

});

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
  console.log(d3.event.subject);
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}



function drawNode(d) {
  ctx.beginPath();
  ctx.fillStyle = color(d.party);
  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, Math.PI*2);
  ctx.fill();
}

function drawLink(l) {
  ctx.moveTo(l.source.x, l.source.y);
  ctx.lineTo(l.target.x, l.target.y);
}

function tooltip(){
    // tooltip div:
    const tooltip = d3.select('#network').append("div")
    .classed("tooltip", true)
    .style("opacity", 0) // start invisible
    nodeWrapper
    .on("mouseover", function(d) {
    tooltip.transition()
    .duration(300)
    .style("opacity", 1) // show the tooltip
    tooltip.html(d.name)
    .style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
    .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
    })
    .on("mouseleave", function(d) {
    tooltip.transition()
    .duration(200)
    .style("opacity", 0)
    })
}
