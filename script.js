d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then(data => {
    const dataset = data.data; // Extract the data array
    const dates = dataset.map(d => new Date(d[0])); // Extract and convert dates
    const gdps = dataset.map(d => d[1]); // Extract GDP values

    const width = 800;
    const height = 400;
    const padding = 40;

    // Setup the scales
    const xScale = d3.scaleTime()
        .domain([d3.min(dates), d3.max(dates)])
        .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(gdps)])
        .range([height - padding, padding]);

    // Create the SVG element
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add the axes
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(d3.axisBottom(xScale).ticks(10));

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(d3.axisLeft(yScale));

    // Add the bars
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(new Date(d[0])))
        .attr("y", d => yScale(d[1]))
        .attr("width", (width - 2 * padding) / dataset.length)
        .attr("height", d => height - padding - yScale(d[1]))
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("#tooltip")
                .style("opacity", 0.9)
                .html(`Date: ${d[0]}<br>GDP: ${d[1]} Billion`)
                .attr("data-date", d[0])
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select("#tooltip").style("opacity", 0);
        });

    // Add the tooltip (initially hidden)
    d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);
});