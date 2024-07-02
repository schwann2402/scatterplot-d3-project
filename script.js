fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    const dataset = data;
    const height = 500;
    const width = 1000;
    const padding = 100;

    const svg = d3
      .select("body")
      .append("svg")
      .style("width", width)
      .style("height", height);

    const minTime = d3.min(dataset, (d) => d3.timeParse("%M:%S")(d.Time));
    const maxTime = d3.max(dataset, (d) => d3.timeParse("%M:%S")(d.Time));
    const minYear = d3.min(dataset, (d) => d.Year);
    const maxYear = d3.max(dataset, (d) => d.Year);
    console.log(maxYear);

    const yScale = d3
      .scaleTime()
      .domain([minTime, maxTime])
      .range([padding, height - padding]);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    const xScale = d3
      .scaleLinear()
      .domain([minYear - 1, maxYear + 1])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg
      .selectAll("circle")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d3.timeParse("%M:%S")(d.Time))
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d3.timeParse("%M:%S")(d.Time)))
      .attr("r", 4)
      .style("fill", (d) => {
        return d.Doping ? "blue" : "orange";
      })
      .on("mouseover", (e, d) => {
        tooltip
          .transition(0)
          .duration(200)
          .style("opacity", 1)
          .style("left", `${e.pageX + 10}px`)
          .style("top", `${e.pageY + 10}px`);

        tooltip
          .attr("data-year", d.Year)
          .html(
            `Name: ${d.Name} <br/> Nationality: ${d.Nationality} <br/>  Year: ${d.Year} <br/> Time: ${d.Time}`
          );
      })
      .on("mouseleave", () => tooltip.style("opacity", 0));

    const legendText = svg.append("g").attr("id", "legend");
    const dopingLegend = legendText.append("g");
    const noDopingLegend = legendText.append("g");

    dopingLegend
      .append("text")
      .attr("x", 400)
      .attr("y", 100)
      .text("Riders with doping allegations");

    noDopingLegend
      .append("text")
      .attr("x", 400)
      .attr("y", 80)
      .text("Riders without doping allegations");

    dopingLegend
      .append("rect")
      .attr("x", 380)
      .attr("y", 84)
      .attr("height", 16)
      .attr("width", 16)
      .style("fill", "blue");

    noDopingLegend
      .append("rect")
      .attr("x", 380)
      .attr("y", 64)
      .attr("height", 16)
      .attr("width", 16)
      .style("fill", "orange");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("background-color", "lightblue")
      .style("color", "black")
      .style("padding", "10px")
      .style("border-radius", "10px")
      .style("position", "absolute");
  });
