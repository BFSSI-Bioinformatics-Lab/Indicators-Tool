import { BaseGraph } from "./baseGraph.js"
import { Dims, DataCols } from "../constants.js";
import { Translation, Visuals } from "../tools.js";




export class AgeBarGraph extends BaseGraph {
    constructor(model) {
        super(model);
        this.width = Dims.AgeGraph.GraphLeft + Dims.AgeGraph.GraphWidth + Dims.AgeGraph.GraphRight;
        this.height = Dims.AgeGraph.GraphTop + Dims.AgeGraph.GraphHeight + Dims.AgeGraph.GraphBottom;

        this.tooltips = {};
        this.shownTooltip;
    }

    setup() {
        super.setup();

        const data = this.model.plotData;

        // bars in the graph
        this.barGroup = this.svg.append("g");

        // add the heading
        this.heading = this.svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.AgeGraph.HeadingFontSize)
            .attr("x", Dims.AgeGraph.GraphLeft + Dims.AgeGraph.GraphWidth / 2)
            .attr("y", Dims.AgeGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)");

        this.axes = this.svg.append("g");

        // x-axis
        this.xAxis = this.axes.append("g");

        this.xAxisLabel = this.xAxis.append("text").attr("font-size", Dims.AgeGraph.AxesFontSize)
            .attr("x", Dims.AgeGraph.GraphLeft + Dims.AgeGraph.GraphWidth / 2)
            .attr("y", Dims.AgeGraph.GraphTop - Dims.AgeGraph.TickFontSize - Dims.AgeGraph.AxesFontSize * 2)
            .attr("fill", "var(--fontColour)");

        const maxEstimate = Math.max(...(data.map((d) => parseFloat(d[DataCols.U95CI]))));
        this.xAxisDomain = [0, maxEstimate];

        this.xAxisScale =  d3.scaleLinear()
            .range([Dims.AgeGraph.GraphLeft, Dims.AgeGraph.GraphLeft + Dims.AgeGraph.GraphWidth])
            .domain(this.xAxisDomain)
            .nice();

        this.xAxisLine = this.xAxis.append("g")
            .attr("transform", `translate(0, ${Dims.AgeGraph.GraphTop})`)
            .call(d3.axisTop(this.xAxisScale))
            .attr("font-size", Dims.AgeGraph.TickFontSize);

        // y-axis
        this.yAxis = this.axes.append("g")
        this.yAxisLine = this.yAxis.append("g")
            .attr("transform", `translate(${Dims.AgeGraph.GraphLeft}, 0)`);

        this.yAxisLabel = this.yAxis.append("text").attr("font-size", Dims.AgeGraph.AxesFontSize)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("y", Dims.AgeGraph.GraphLeft / 4)
            .attr("x", -(this.height / 2))
            .attr("fill", "var(--fontColour)");

        this.yAxisScale = d3.scaleBand()
            .range([Dims.AgeGraph.GraphTop, this.height - Dims.AgeGraph.GraphBottom])
            .domain(data.map((d) => d[DataCols.SubGroup]))
            .padding(Dims.AgeGraph.BarPadding);

        this.yAxisLine
            .call(d3.axisLeft(this.yAxisScale).tickSizeOuter(0))
            .attr("font-size", Dims.AgeGraph.TickFontSize);

        // tooltips
        this.tooltips = {};
        this.shownTooltip;
        this.tooltipGroup = this.svg.append("g")
    }

    /* Creates tooltip for hovering over bars */
    hoverTooltip({data, hide = false} = {}){
        const ageGroup = data[DataCols.SubGroup];
        const colour = `var(--ageGraphBarColour)`;

        const lines = Translation.translate("AgeGraph.tooltip", { 
            returnObjects: true, 
            estimate: data[DataCols.Estimate],
            u95ci: data[DataCols.U95CI],
            l95ci: data[DataCols.L95CI]
        });
        
        const toolTip = Visuals.createTooltip({tooltipGroup: this.tooltipGroup, title: ageGroup, lines, colour, hide, 
            tooltipMinWidth: Dims.AgeGraph.TooltipMinWidth,
            toolTipHeight: Dims.AgeGraph.TooltipHeight,
            tooltipPaddingVert: Dims.AgeGraph.TooltipPaddingVert,
            tooltipPaddingHor: Dims.AgeGraph.TooltipTextPaddingHor,
            tooltipTextPaddingVert: Dims.AgeGraph.TooltipTextPaddingVert,
            tooltipTextPaddingHor: Dims.AgeGraph.TooltipTextPaddingHor,
            tooltipHighlightWidth: Dims.AgeGraph.TooltipHighlightWidth,
            tooltipBorderWidth: Dims.AgeGraph.TooltipBorderWidth,
            tooltipFontSize: Dims.AgeGraph.TooltipFontSize,
            tooltipTitleMarginBtm: Dims.AgeGraph.TooltipTitleMarginBtm,
        });

        this.tooltips[ageGroup] = toolTip;
        return toolTip;
    }

    getWhiskerEndTop(data) {
        return this.yAxisScale(data[DataCols.SubGroup]) + this.yAxisScale.bandwidth() / 2 - Dims.AgeGraph.WhiskerWidth / 2;
    }

    getWhiskerEndBottom(data) {
        return this.yAxisScale(data[DataCols.SubGroup]) + this.yAxisScale.bandwidth() / 2 + Dims.AgeGraph.WhiskerWidth / 2;
    }

    getWhiskerConnectYPos(data) {
        return this.yAxisScale(data[DataCols.SubGroup]) + this.yAxisScale.bandwidth() / 2;
    }

    drawBars() {
        const self = this;

        this.bars.append("rect")
            .attr("fill", (d) => `var(--ageGraphBarColour)`)
            .attr("x", this.xAxisScale(0))
            .attr("y", (d) => this.yAxisScale(d.data[DataCols.SubGroup]))
            .attr("height", this.yAxisScale.bandwidth())
            .attr("width", (d) => this.xAxisScale(d.data[DataCols.Estimate]) - this.xAxisScale(0))
            .on("mouseover", function(d) {self.onBarHover(d3.select(this), d);})
            .on("mousemove", function(d) {self.onBarHover(d3.select(this), d);})
            .on("mouseenter", function(d) {self.onBarHover(d3.select(this), d);})
            .on("mouseleave", function(d) {self.onBarUnHover(d3.select(this), d);});
        
        // draw the whiskers
        this.bars.append("line")
            .attr("x1", (d) => this.xAxisScale(d.data[DataCols.U95CI]) + 10)
            .attr("y1", (d) => this.getWhiskerEndTop(d.data))
            .attr("x2", (d) => this.xAxisScale(d.data[DataCols.U95CI]) + 10)
            .attr("y2", (d) => this.getWhiskerEndBottom(d.data))
            .attr("stroke", "var(--onBackground)")
            .attr("stroke-width", Dims.AgeGraph.WhiskerStrokeWidth)
            .attr("stroke-linecap", "round");

        this.bars.append("line")
            .attr("x1", (d) => this.xAxisScale(d.data[DataCols.L95CI]) - 10)
            .attr("y1", (d) => this.getWhiskerEndTop(d.data))
            .attr("x2", (d) => this.xAxisScale(d.data[DataCols.L95CI]) - 10)
            .attr("y2", (d) => this.getWhiskerEndBottom(d.data))
            .attr("stroke", "var(--onBackground)")
            .attr("stroke-width", Dims.AgeGraph.WhiskerStrokeWidth)
            .attr("stroke-linecap", "round");

        this.bars.append("line")
            .attr("x1", (d) => this.xAxisScale(d.data[DataCols.U95CI]) + 10)
            .attr("y1", (d) => this.getWhiskerConnectYPos(d.data))
            .attr("x2", (d) => this.xAxisScale(d.data[DataCols.L95CI]) - 10)
            .attr("y2", (d) => this.getWhiskerConnectYPos(d.data))
            .attr("stroke", "var(--onBackground)")
            .attr("stroke-width", Dims.AgeGraph.WhiskerStrokeWidth)
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

        if (mouseX <= Dims.AgeGraph.GraphWidth / 2) {
            mouseX += Dims.AgeGraph.TooltipMouseXOffset;
        } else {
            const toolTipWidth = tooltip.background.attr("width");
            mouseX -= toolTipWidth - Dims.AgeGraph.TooltipMouseXOffset;
        }

        if (mouseY <= Dims.AgeGraph.GraphHeight / 2) {
            mouseY += Dims.AgeGraph.TooltipMouseYOffset;
        } else {
            const toolTipHeight = tooltip.background.attr("height");
            mouseY -= toolTipHeight - Dims.AgeGraph.TooltipMouseYOffset;
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
        this.title = Translation.translate(`AgeGraph.graphTitle`);
        this.heading.text(this.title)
            .transition()
            .attr("x", Dims.AgeGraph.GraphLeft + Dims.AgeGraph.GraphWidth / 2)
            .attr("font-weight", "bold");

        this.xAxisLabel.text(Translation.translate(`AgeGraph.xAxisTitle`))
            .transition()
            .attr("x", Dims.AgeGraph.GraphLeft + Dims.AgeGraph.GraphWidth / 2);

        this.yAxisLabel.text(Translation.translate(`AgeGraph.yAxisTitle`))
            .transition()
            .attr("x", -(this.height / 2));

        // Add in the bars
        this.barGroup.selectAll("*").remove();
        this.bars = this.barGroup.selectAll()
            .data(data.map((d) => {
                const ageGroup = d[DataCols.SubGroup];
                return {key: ageGroup, data: d};
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