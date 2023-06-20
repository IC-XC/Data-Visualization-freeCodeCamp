//the container for the map
var body = d3.select("#svg-container");
var svg = d3
  .select("#svg-container")
  .append("svg")
  .attr("width", "960px")
  .attr("height", "600px");

width = +svg.attr("width");
height = +svg.attr("height");

//the tooltip
var tooltip = body
  .append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

tooltip.append("p").attr("class", "area");

tooltip.append("p").attr("class", "education");

//the legend
var x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeGreens[9]);

var g = svg
  .append("g")
  .attr("class", "key")
  .attr("id", "legend")
  .attr("transform", "translate(0,40)");

g.selectAll("rect")
  .data(
    color.range().map((d) => {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    })
  )
  .enter()
  .append("rect")
  .attr("height", 10)
  .attr("x", (d) => {
    return x(d[0]);
  })
  .attr("width", (d) => {
    return x(d[1]) - x(d[0]);
  })
  .attr("fill", (d) => {
    return color(d[0]);
  });

g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold");

g.call(
  d3
    .axisBottom(x)
    .tickSize(13)
    .tickFormat((x) => {
      return Math.round(x) + "%";
    })
    .tickValues(color.domain())
)
  .select(".domain")
  .remove();

//the map
const userEducation =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const counties =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

var path = d3.geoPath();

var files = [counties, userEducation];
var promises = [];

files.forEach(function (url) {
  promises.push(d3.json(url));
});

Promise.all(promises).then(function createMap(values) {
  var us = values[0];
  var userEducation = values[1];

  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("data-fips", function (d) {
      return d.id;
    })
    .attr("data-education", function (d) {
      var result = userEducation.filter((userEdu) => {
        return userEdu["fips"] == d.id;
      });
      if (result[0]) {
        return result[0].bachelorsOrHigher;
      } else {
        console.log("Could not find data for ", d.id);
        return 0;
      }
    })

    .attr("fill", function (d) {
      var result = userEducation.filter((userEdu) => {
        return userEdu["fips"] === d.id;
      });
      if (result[0]) {
        return color(result[0].bachelorsOrHigher);
      } else {
        return color(0);
      }
    })

    .attr("d", path)
    .on("mouseover", (d) => {
      tooltip.style("opacity", 0.9);
      tooltip
        .html(() => {
          var result = userEducation.filter((userEdu) => {
            return userEdu.fips === d.id;
          });
          if (result[0]) {
            return (
              result[0]["area_name"] +
              ", " +
              result[0].state +
              ": " +
              result[0].bachelorsOrHigher +
              "%"
            );
          } else {
            return 0;
          }
        })

        .attr("data-education", () => {
          var result = userEducation.filter((userEdu) => {
            return userEdu.fips === d.id;
          });
          if (result[0]) {
            return result[0].bachelorsOrHigher;
          } else {
            return 0;
          }
        })
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    });

  svg
    .append("path")
    .datum(
      topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
      })
    )
    .attr("class", "states")
    .attr("d", path);

  svg
    .append("h1")
    .text("Higher Education by County in the USA")
    .attr("id", "title")
    .attr("x", 0);
});