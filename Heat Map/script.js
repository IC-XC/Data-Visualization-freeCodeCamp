function std(str) {
  return new Date(null, str - 1);
}

var color = ["#9db4ff", "#e4e8ff", "#ffd7ae", "#b22222"];

var w = 700;
var h = 300;
var pb = 20;
var ps = 60;

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((res) => res.json())
  .then((dt) => {
    var data = dt.monthlyVariance;

    const xScale = d3
      .scaleBand()
      .domain(
        data.map((a) => {
          return a.year;
        })
      )
      .range([ps, w - pb]);

    const xAxeScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.year), d3.max(data, (d) => d.year)])
      .range([ps, w - pb]);

    const yScale = d3
      .scaleBand()
      .domain([
        new Date(null, 11),
        new Date(null, 10),
        new Date(null, 9),
        new Date(null, 8),
        new Date(null, 7),
        new Date(null, 6),
        new Date(null, 5),
        new Date(null, 4),
        new Date(null, 3),
        new Date(null, 2),
        new Date(null, 1),
        new Date(null, 0)
      ])
      .range([h - pb, 0]);

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("height", h)
      .attr("width", w);

    var tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .attr("class", "tooltip");

    const xAxis = d3.axisBottom(xAxeScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => dt.baseTemperature + d.variance)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(std(d.month)))
      .attr("height", (d) => yScale.bandwidth(d.month))
      .attr("width", (d) => xScale.bandwidth(d.year))
      .style("fill", (d) => {
        if (dt.baseTemperature - d.variance < 5) {
          return color[0];
        } else if (dt.baseTemperature - d.variance < 7) {
          return color[1];
        } else if (dt.baseTemperature - d.variance < 10) {
          return color[2];
        } else {
          return color[3];
        }
      })
      .on("mouseover", async function (d, i) {
        tooltip.style("opacity", 0.9).attr("data-year", i.year);
        tooltip
          .html(
            `<h6>${i.year} :</h6><p>${(dt.baseTemperature + i.variance).toFixed(
              2
            )} - ${i.month}</p>`
          )
          .style("left", d.pageX + "px")
          .style("top", d.pageY + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${h - pb})`)
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("g")
      .attr("transform", "translate(" + ps + ",0)")
      .attr("id", "y-axis")
      .call(yAxis);
  });

var color = ['#a50026','#d73027','#f46d43','#fdae61'];

const legend = d3.select("#legend").append("svg").attr("height", "50px");

legend
  .selectAll("rect")
  .data(color)
  .enter()
  .append("rect")
  .attr("class", "legend")
  .attr("height", "30px")
  .attr("width", "30px")
  .attr("x", (d, i) => 30 * i)
  .style("fill", (d) => d);
