import { BaseGraph } from "./baseGraph.js";
import { SVGIcons } from "../constants.js";
import { Translation } from "../tools.js";


export class EmptyGraph extends BaseGraph {

    // drawNoData(): Draws the label and image when there is no data to display for the graph
    drawNoData() {
        const noDataContainer = d3.select(".visualGraph")
        .html("")
        .append("div")
        .classed("emptyGraphsContainer", true)
        .append("div")
        .classed("emptyGraphTextContainer", true);

        // No Data available title
        noDataContainer.append("h2")
            .text(Translation.translate("NoGraphAvailable"));

        noDataContainer.append("svg")
        .classed("emptyGraphIcon", true)
        .attr("viewBox", "0 0 512 512")
        .attr("width", "512")
        .attr("height", "512")
        .html(SVGIcons["MagnifyingGlass"]);
    }

    update() {
        super.update();
        this.setup();
        this.drawNoData();
    }
}