document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("#sankey").append("svg")
        .attr("width", 960)
        .attr("height", 600);

    const width = +svg.attr("width"),
          height = +svg.attr("height");

    const sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .extent([[1, 1], [width - 1, height - 5]]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    d3.json("sankey_data.json").then(function(data) {
        const {nodes, links} = sankey({
            nodes: data.nodes.map(d => Object.assign({}, d)),
            links: data.links.map(d => Object.assign({}, d))
        });

        svg.append("g")
            .selectAll("rect")
            .data(nodes)
            .enter().append("rect")
                .attr("x", d => d.x0)
                .attr("y", d => d.y0)
                .attr("height", d => d.y1 - d.y0)
                .attr("width", sankey.nodeWidth())
                .attr("fill", d => color(d.name))
                .attr("stroke", "#000");

        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
            .selectAll("path")
            .data(links)
            .enter().append("path")
                .attr("d", d3.sankeyLinkHorizontal())
                .attr("stroke", d => color(d.source.name))
                .attr("stroke-width", d => Math.max(1, d.width));

        svg.append("g")
            .style("font", "10px sans-serif")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
                .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
                .attr("y", d => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
                .text(d => d.name);
    }).catch(function(error) {
        console.error('Error loading the sankey data:', error);
    });
});
