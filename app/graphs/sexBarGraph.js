import { BaseGraph } from "./baseGraph.js"
import { DataCols, Dims } from "../constants.js";
import { Translation, Visuals } from "../tools.js";


export class SexBarGraph extends BaseGraph {
    constructor(model) {
        super(model);
        this.width = Dims.SexGraph.GraphLeft + Dims.SexGraph.GraphWidth + Dims.SexGraph.GraphRight;
        this.height = Dims.SexGraph.GraphTop + Dims.SexGraph.GraphHeight + Dims.SexGraph.GraphBottom;

        this.provinces = {};
        this.tooltips = {};
        this.shownTooltip;
        this.shownProvince;
    }

    setup() {
        super.setup();

        const data = this.model.plotData;

        // add the heading
        this.heading = this.svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.SexGraph.HeadingFontSize)
            .attr("x", Dims.SexGraph.GraphLeft + Dims.SexGraph.GraphWidth / 2)
            .attr("y", Dims.SexGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)");

        this.axes = this.svg.append("g");

        // x-axis
        this.xAxis = this.axes.append("g");

        this.xAxisLabel = this.xAxis.append("text").attr("font-size", Dims.SexGraph.AxesFontSize)
            .attr("x", Dims.SexGraph.GraphLeft + Dims.SexGraph.GraphWidth / 2)
            .attr("y", this.height - Dims.SexGraph.GraphBottom + Dims.SexGraph.TickFontSize + Dims.SexGraph.AxesFontSize * 2)
            .attr("fill", "var(--fontColour)");

        this.xAxisScale =  d3.scaleBand()
            .domain(data.map((d) => d[DataCols.SubGroup]))
            .range([Dims.SexGraph.GraphLeft, Dims.SexGraph.GraphLeft + Dims.SexGraph.GraphWidth])
            .padding(0.08);

        this.xAxisLine = this.xAxis.append("g")
            .attr("transform", `translate(0, ${Dims.SexGraph.GraphTop + Dims.SexGraph.GraphHeight})`)
            .call(d3.axisBottom(this.xAxisScale))
            .attr("font-size", Dims.SexGraph.TickFontSize);

        // y-axis
        this.yAxis = this.axes.append("g")
        this.yAxisLine = this.yAxis.append("g")
            .attr("transform", `translate(${Dims.SexGraph.GraphLeft}, 0)`);

        this.yAxisLabel = this.yAxis.append("text").attr("font-size", Dims.SexGraph.AxesFontSize)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("y", Dims.SexGraph.GraphLeft / 4)
            .attr("x", -(this.height / 2))
            .attr("fill", "var(--fontColour)");

        const maxEstimate = Math.max(...(data.map((d) => parseFloat(d[DataCols.U95CI]))));

        this.yAxisDomain = [0, maxEstimate];
        this.yAxisScale = d3.scaleLinear()
            .range([this.height - Dims.SexGraph.GraphBottom, Dims.SexGraph.GraphTop])
            .domain(this.yAxisDomain)
            .nice();

        this.yAxisLine
            .call(d3.axisLeft(this.yAxisScale).tickSizeOuter(0))
            .attr("font-size", Dims.SexGraph.TickFontSize);

        // bars in the graph
        this.barGroup = this.svg.append("g");

        // tooltips
        this.tooltips = {};
        this.shownTooltip;
        this.tooltipGroup = this.svg.append("g")
    }

    /* Creates tooltip for hovering over bars */
    hoverTooltip({data, hide = false} = {}){
        const sex = data[DataCols.SubGroup];
        const sexKey = Translation.translate(`SexKeys.${sex}`);
        const colour = `var(--${sexKey})`;

        const lines = Translation.translate("SexGraph.tooltip", { 
            returnObjects: true, 
            estimate: data[DataCols.Estimate],
            u95ci: data[DataCols.U95CI],
            l95ci: data[DataCols.L95CI]
        });
        
        const toolTip = Visuals.createTooltip({tooltipGroup: this.tooltipGroup, title: sex, lines, colour, hide, 
            tooltipMinWidth: Dims.SexGraph.TooltipMinWidth,
            toolTipHeight: Dims.SexGraph.TooltipHeight,
            tooltipPaddingVert: Dims.SexGraph.TooltipPaddingVert,
            tooltipPaddingHor: Dims.SexGraph.TooltipTextPaddingHor,
            tooltipTextPaddingVert: Dims.SexGraph.TooltipTextPaddingVert,
            tooltipTextPaddingHor: Dims.SexGraph.TooltipTextPaddingHor,
            tooltipHighlightWidth: Dims.SexGraph.TooltipHighlightWidth,
            tooltipBorderWidth: Dims.SexGraph.TooltipBorderWidth,
            tooltipFontSize: Dims.SexGraph.TooltipFontSize,
            tooltipTitleMarginBtm: Dims.SexGraph.TooltipTitleMarginBtm,
        });

        this.tooltips[sexKey] = toolTip;
        return toolTip;
    }

    getWhiskerEndLeft(data) {
        return this.xAxisScale(data[DataCols.SubGroup]) + this.xAxisScale.bandwidth() / 2 - Dims.SexGraph.WhiskerWidth / 2;
    }

    getWhiskerEndRight(data) {
        return this.xAxisScale(data[DataCols.SubGroup]) + this.xAxisScale.bandwidth() / 2 + Dims.SexGraph.WhiskerWidth / 2;
    }

    getWhiskerConnectXPos(data) {
        return this.xAxisScale(data[DataCols.SubGroup]) + this.xAxisScale.bandwidth() / 2;
    }

    drawBars() {
        const self = this;

        this.bars.append("rect")
            .attr("fill", (d) => `var(--${d.key})`)
            .attr("x", (d) => this.xAxisScale(d.data[DataCols.SubGroup]))
            .attr("y", (d) => this.yAxisScale(d.data[DataCols.Estimate]))
            .attr("height", (d) => this.yAxisScale(0) - this.yAxisScale(d.data[DataCols.Estimate]))
            .attr("width", this.xAxisScale.bandwidth())
            .on("mouseover", function(d) {self.onBarHover(d3.select(this), d);})
            .on("mousemove", function(d) {self.onBarHover(d3.select(this), d);})
            .on("mouseenter", function(d) {self.onBarHover(d3.select(this), d);})
            .on("mouseleave", function(d) {self.onBarUnHover(d3.select(this), d);});;
        
        // draw the whiskers
        this.bars.append("line")
            .attr("x1", (d) => this.getWhiskerEndLeft(d.data))
            .attr("y1", (d) => this.yAxisScale(d.data[DataCols.U95CI]) + 10)
            .attr("x2", (d) => this.getWhiskerEndRight(d.data))
            .attr("y2", (d) => this.yAxisScale(d.data[DataCols.U95CI]) + 10)
            .attr("stroke", "var(--onBackground)")
            .attr("stroke-width", Dims.SexGraph.WhiskerStrokeWidth)
            .attr("stroke-linecap", "round");

        this.bars.append("line")
            .attr("x1", (d) => this.getWhiskerEndLeft(d.data))
            .attr("y1", (d) => this.yAxisScale(d.data[DataCols.L95CI]) - 10)
            .attr("x2", (d) => this.getWhiskerEndRight(d.data))
            .attr("y2", (d) => this.yAxisScale(d.data[DataCols.L95CI]) - 10)
            .attr("stroke", "var(--onBackground)")
            .attr("stroke-width", Dims.SexGraph.WhiskerStrokeWidth)
            .attr("stroke-linecap", "round");

        this.bars.append("line")
            .attr("x1", (d) => this.getWhiskerConnectXPos(d.data))
            .attr("y1", (d) => this.yAxisScale(d.data[DataCols.U95CI]) + 10)
            .attr("x2", (d) => this.getWhiskerConnectXPos(d.data))
            .attr("y2", (d) => this.yAxisScale(d.data[DataCols.L95CI]) - 10)
            .attr("stroke", "var(--onBackground)")
            .attr("stroke-width", Dims.SexGraph.WhiskerStrokeWidth)
            .attr("stroke-linecap", "round");
    }

    // onBarHover(element, data): When hovering over a bar in the bar graph
    onBarHover(element, data) {
        const sexKey = data.key;
        const tooltip = this.tooltips[sexKey];

        if (this.shownTooltip !== undefined && this.shownTooltip != tooltip) {
            this.shownTooltip.group
                .attr("opacity", 0)
                .style("pointer-events", "none");
        }

        element.style("cursor", "pointer");

        let mousePos = undefined;
        let mouseX = Dims.SexGraph.GraphLeft;
        let mouseY = Dims.SexGraph.GraphTop;

        try {
            mousePos = d3.mouse(element.node());
        } catch (error) {}

        if (mousePos !== undefined) {
            mouseX += mousePos[0];
            mouseY += mousePos[1];
        }

        if (mouseX <= Dims.SexGraph.GraphWidth / 2) {
            mouseX += Dims.SexGraph.TooltipMouseXOffset;
        } else {
            const toolTipWidth = tooltip.background.attr("width");
            mouseX -= toolTipWidth - Dims.SexGraph.TooltipMouseXOffset;
        }

        if (mouseY <= Dims.SexGraph.GraphHeight / 2) {
            mouseY += Dims.SexGraph.TooltipMouseYOffset;
        } else {
            const toolTipHeight = tooltip.background.attr("height");
            mouseY -= toolTipHeight - Dims.SexGraph.TooltipMouseYOffset;
        }

        tooltip.group
            .attr("opacity", 1)
            .attr("transform", `translate(${mouseX}, ${mouseY})`)
            .style("pointer-events", "auto");

        this.shownTooltip = tooltip;
    }

    // onBarUnHover(element, data): When unhovering from a bar
    onBarUnHover(element, data) {
        element.style("cursor", "default");

        const sexKey = data.key;
        const tooltip = this.tooltips[sexKey];
        if (tooltip == undefined)  return;

        this.hideTooltip(tooltip);
        this.shownTooltip = undefined;
    }

    drawBarGraph(data) {
        // text for the heading and axis labels
        this.title = Translation.translate(`SexGraph.graphTitle`);
        this.heading.text(this.title)
            .transition()
            .attr("x", Dims.SexGraph.GraphLeft + Dims.SexGraph.GraphWidth / 2)
            .attr("font-weight", "bold");

        this.xAxisLabel.text(Translation.translate(`SexGraph.xAxisTitle`))
            .transition()
            .attr("x", Dims.SexGraph.GraphLeft + Dims.SexGraph.GraphWidth / 2);

        this.yAxisLabel.text(Translation.translate(`SexGraph.yAxisTitle`))
            .transition()
            .attr("x", -(this.height / 2));

        // Add in the bars
        this.barGroup.selectAll("*").remove();
        this.bars = this.barGroup.selectAll()
            .data(data.map((d) => {
                const sex = d[DataCols.SubGroup];
                const sexKey = Translation.translate(`SexKeys.${sex}`);
                return {key: sexKey, data: d};
            }))
            .join("g")

        this.drawBars();

        for (const sexData of data) {
            this.hoverTooltip({data: sexData, hide: true});
        }
    }

    update() {
        super.update();
        this.setup();
        this.drawBarGraph(this.model.plotData);
    }
}