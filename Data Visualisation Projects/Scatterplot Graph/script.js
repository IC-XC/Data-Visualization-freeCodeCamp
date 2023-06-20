/*fetch(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  )
    .then((res) => res.json())
    .then((res) => {
      const { data } = res;
  
      createStuff(data.map((d) => [d[0], d[1], d[0].split("-")[0]]));
    });*/
  

    var url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var height = 600;
var width = 1200;
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleTime().range([height - 100, 0]);
var timeFormat = d3.timeFormat("%M:%S");
var yaxis = d3.axisLeft(y).tickFormat(timeFormat);
var xaxis = d3.axisBottom(x).tickFormat(d3.format("d"));
var tooltip = d3
  .select("#plot")
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("visibility", "hidden")
  .attr("z-index", 10)
  .style("position", "absolute");
var svgContainer = d3
  .select("#plot")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g");
let jsonPromise = d3.json(url);
jsonPromise.then(function (data) {
  data.forEach(function (d) {
    var parsedTime = d.Time.split(":");
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });
  x.domain([
    d3.min(data, function (d) {
      return d.Year - 1;
    }),
    d3.max(data, function (d) {
      return d.Year - 1;
    })
  ]);
  y.domain(
    d3.extent(data, function (d) {
      return d.Time;
    })
  );
  svgContainer
    .append("g")
    .call(xaxis)
    .attr("id", "x-axis")
    .attr("class", "x-axis")
    .attr("transform", "translate(100,500)");
  svgContainer
    .append("g")
    .call(yaxis)
    .attr("class", "y-axis")
    .attr("transform", "translate(100,0)")
    .attr("id", "y-axis");

  svgContainer.append("g").attr("id", "legend");
  svgContainer
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 6)
    .attr("cx", (d) => {
      return x(d.Year) + 100;
    })
    .attr("cy", (d) => {
      return y(d.Time);
    })
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Time.toISOString())
    .style("fill", "orangered")
    .on("mouseover", (event, d) => {
      tooltip.text(d.Year).attr("data-year", d.Year);
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", function (e) {
      var where = d3.pointer(e);
      tooltip.style("top", where[1] + "px").style("left", where[0] + "px");
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
});
