import { BaseGraph } from "./baseGraph.js";
import { SVGIcons } from "../constants.js";


export class MapGraph extends BaseGraph {

    drawNoData() {
        const noDataContainer = d3.select(".visualGraph")
        .html("")
        .append("div")
        .classed("emptyGraphsContainer", true)
        .append("div")
        .classed("emptyGraphTextContainer", true);

        noDataContainer.append("h2")
            .text("TODO: Add Map Graph");

        noDataContainer.append("svg")
        .classed("emptyGraphIcon", true)
        .attr("viewBox", "0 0 512 512")
        .attr("width", "512")
        .attr("height", "512")
        .html(SVGIcons["MagnifyingGlass"]);
    }


    // TODO: Draw the map
    update() {
        super.update();
        this.setup();
        this.drawNoData();
    }
}