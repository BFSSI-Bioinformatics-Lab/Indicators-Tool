


export class BaseGraph {
    constructor(model) {
        this.model = model;
        this.title = "";
        this.width = 512;
        this.height = 512;

        this.svg;
        this.shownTooltip;
    }

    // hideTooltip(tooltip): Hides the tooltips
    hideTooltip(tooltip) {
        tooltip.group.attr("opacity", 0)
            .style("pointer-events", "none");
    }

    setup() {
        // create the SVG component
        this.svg = this.graph
            .html("")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("viewBox", [0, 0, this.width, this.height])
            .classed("svgGraph", true)
            .on("touchstart", (event) => {
                if (this.shownTooltip === undefined) return;
                this.hideTooltip(this.shownTooltip);
                this.shownTooltip = undefined;
            });

        // create the background for the graph
        this.background = this.svg.append("rect")
        .attr("fill", "none")
        .attr("width", this.width)
        .attr("height", this.height);
    }

    update() {
        this.graph = d3.select(".visualGraph")
            .attr("position", "inherit");
    }
}