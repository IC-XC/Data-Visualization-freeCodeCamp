fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(res => res.json())
                .then(res => {
    const {data} = res;
  
  createStuff(data.map(d => [d[0], d[1], d[0].split('-')[0]]));
  
});

function createStuff(data){
  
  let tooltip = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip')
                  .attr('id', 'tooltip')
                  .style('opacity', 0);  
  
  const width = 700;
  const height = 600;
  const padding = 40;
  
  const barWidth = (width - 2 * padding) / data.length;
    
  const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d[1])])
                .range([height, padding * 2]);
  
  const xScale = d3.scaleTime()
                  .domain([d3.min(data, d => new Date(d[0])), d3.max(data, d => new Date(d[0]))])
                  .range([padding, width - padding]);
  
  const unixScale = d3.scaleLinear()
                     .domain([d3.min(data, d => d[2]), d3.max(data, d => d[2])])
                     .range([padding, width - padding]);
  
  const svg = d3.select('body')
              .append('svg')
              .attr('width', width)
              .attr('height', height);

    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * barWidth + padding) 
        .attr('y', d => yScale(d[1]) - padding)
        .attr('width', barWidth)
        .attr('height', d => height - yScale(d[1]))
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .on('mouseover', (d, i) =>{
        var nf = new Intl.NumberFormat();
     
      tooltip.attr('data-date', i[0])
               .html(`<p>"${i[0]}"<br><em><b>$${nf.format(i[1])} Billion</em></p>`)
               .transition()
               .duration(100)
               .style('opacity', '1')
               .style("display", "block");
      
        }).on('mouseout', d => {
           tooltip.transition()
                .duration(100)
                .style('opacity', '0')
                .style('display', 'none');
       })
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`)
    .call(xAxis);
    
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, ${-padding})`)
    .call(yAxis);
    
   svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -250)
    .attr('y', 80)
    .text('Gross Domestic Product');

}
 