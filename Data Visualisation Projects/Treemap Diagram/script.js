const dataUrl =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";

const title = "Movie Sales";
const description = "Top 100 Movies at the Box Office by Genre";

document.getElementById("title").innerText = title;
document.getElementById("description").innerText = description;

d3.json(dataUrl)
.then((d) => {
  const width = 960;
  const height = 570;
  const marginBottom = 80;

  const genreColours = {
    Action: "#66c2a5",
    Drama: "#fc8d62",
    Adventure: "#8da0cb",
    Family: "#e78ac3",
    Animation: "#a6d854",
    Comedy: "#ffd92f",
    Biography: "#e5c494"
  };

  // Tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("width", "100px")
    .style("position", "absolute")
    .style("padding", "5px 10px")
    .style("background", "#333")
    .style("border-radius", "3px")
    .style("opacity", 0)
    .style("cursor", "pointer");

  // TreeMap Data
  let root = d3
    .hierarchy(d)
    .eachBefore((d) => {
      d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
    })
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  let movieTreemap = d3
    .treemap()
    .size([width, height - marginBottom])
    .paddingInner(1);

  let treemapData = movieTreemap(root);

  // Treemap background
  let diagram = d3
    .select("#treemap_diagram")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // build treemap diagram
  let genres = diagram
    .selectAll("g")
    .data(treemapData.children)
    .enter()
    .append("g");

  let movies = genres
    .selectAll("g")
    .data((d) => d.children)
    .enter()
    .append("g")
    .attr("transform", (d) => "translate(" + [d.x0, d.y0] + ")");

  movies
    .append("rect")
    .attr("class", "tile")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => genreColours[d.data.category])
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", (d, i) => {
      tooltip.style("opacity", "0.9").attr("data-value", d.data.value);
      tooltip
        .html(
          '<div style="font-size: 0.9rem; font-weight: bold; color: #eee; text-align: center;">' +
            d.data.name +
            "<br>" +
            d.data.category +
            "<br>$" +
            d.data.value +
            "</div>"
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 60 + "px");
    })
    .on("mouseout", (obj) => {
      tooltip.style("opacity", 0);
    });

  movies
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 5)
    .attr("y", (d, i) => 13 + i * 10)
    .text((d) => d)
    .style("font-size", "8px");

  // Treemap legend
  const legend = d3.select("svg").append("g").attr("id", "legend");

  legend
    .selectAll("rect")
    .data(treemapData.children)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", (d, i) => 130 * i + 50)
    .attr("y", 530)
    .attr("fill", (d) => genreColours[d.data.name]);

  legend
    .selectAll("text")
    .data(treemapData.children)
    .enter()
    .append("text")
    .attr("x", (d, i) => 130 * i + 80)
    .attr("y", 545)
    .attr("color", "#000")
    .style("font-size", "0.9rem")
    .text((d) => d.data.name);

  legend
    .append("text")
    .text("Legend: ")
    .attr("x", 40)
    .attr("y", 520)
    .style("font-size", "14px")
    .style("color", "#000")
    .style("font-weight", "bold");
});
