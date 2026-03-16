import { BaseGraph } from "./baseGraph.js";
import { SVGS } from "../assets.js";
import { DataCols, ProvinceKeys, Dims, TextWrap } from "../constants.js";
import { Visuals, Translation } from "../tools.js";


const SelectedProvinceClsName = "selectedProvince";


export class MapGraph extends BaseGraph {
    constructor(model) {
        super(model);
        this.width = Dims.MapGraph.GraphWidth;
        this.height = Dims.MapGraph.GraphHeight;

        this.provinces = {};
        this.tooltips = {};
        this.shownTooltip;
        this.shownProvince;
    }

    setup() {
        super.setup();
        this.mapContainer = this.svg.append("g")
            .attr("transform", `translate(${Dims.MapGraph.GraphLeft}, ${Dims.MapGraph.GraphTop})`);
        this.tooltipGroup = this.svg.append("g");

        // add the heading
        this.heading = this.svg.append("g")
            .append("text")
            .attr("text-anchor", "middle")
            .attr("font-size", Dims.MapGraph.HeadingFontSize)
            .attr("x", Dims.MapGraph.GraphLeft + Dims.MapGraph.GraphWidth / 2)
            .attr("y", Dims.MapGraph.HeadingFontSize * 1.25)
            .attr("fill", "var(--fontColour)")
            .attr("font-weight", "bold");

        // text for the heading and axis labels
        const title = Translation.translate(`MapGraph.graphTitle`);
        this.heading.text(title)
            .transition()
            .attr("x", Dims.MapGraph.GraphLeft + Dims.MapGraph.GraphWidth / 2);
    }

    // drawMap(): Draws the map of Canada
    drawMap() {
        this.provinces = {};

        this.provinces[ProvinceKeys.Ontario] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Ontario)
            .attr("transform", "translate(802,1085)")
            .html(SVGS.Ontario)

        this.provinces[ProvinceKeys.Manitoba] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Manitoba)
            .attr("transform", "translate(660,943)")
            .html(SVGS.Manitoba)

        this.provinces[ProvinceKeys.Saskatchewan] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Saskatchewan)
            .attr("transform", "translate(431,907)")
            .html(SVGS.Saskatchewan)

        this.provinces[ProvinceKeys.Alberta] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Alberta)
            .attr("transform", "translate(263,816)")
            .html(SVGS.Alberta)

        this.provinces[ProvinceKeys.BritishColumnbia] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.BritishColumnbia)
            .attr("transform", "translate(0,600)")
            .html(SVGS.BritishColumbia)

        this.provinces[ProvinceKeys.Nunavut] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Nunavut)
            .attr("transform", "translate(520,0)")
            .html(SVGS.Nunavut)

        this.provinces[ProvinceKeys.NorthWestTerritories] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.NorthWestTerritories)
            .attr("transform", "translate(280,0)")
            .html(SVGS.NorthWestTerritories)

        this.provinces[ProvinceKeys.Yukon] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Yukon)
            .attr("transform", "translate(-5,307)")
            .html(SVGS.Yukon)

        this.provinces[ProvinceKeys.Quebec] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Quebec)
            .attr("transform", "translate(1195, 839)")
            .html(SVGS.Quebec)

        this.provinces[ProvinceKeys.NewfoundlandAndLabrador] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.NewfoundlandAndLabrador)
            .attr("transform", "translate(1440, 823)")
            .html(SVGS.NewFoundlandAndLabrador)

        this.provinces[ProvinceKeys.NewBrunswick] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.NewBrunswick)
            .attr("transform", "translate(1558, 1335)")
            .html(SVGS.NewBruswick)

        this.provinces[ProvinceKeys.NovaScotia] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.NovaScotia)
            .attr("transform", "translate(1674, 1310)")
            .html(SVGS.NovaScotia)

        this.provinces[ProvinceKeys.PrinceEdwardIsland] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.PrinceEdwardIsland)
            .attr("transform", "translate(1680, 1350)")
            .html(SVGS.PrinceEdwardIsland)
    }

    // addData(): Connect the internal data to the graph
    addData() {
        const self = this;
        this.tooltips = {};

        for (const provinceKeyName in ProvinceKeys) {
            const provinceKey = ProvinceKeys[provinceKeyName];
            const province = this.provinces[provinceKey];
            let provinceData = this.model.plotData[provinceKey];

            if (provinceData == undefined) {
                province.classed("unavailableProvince", true);
                continue;
            }

            provinceData = {key: provinceKey, data: provinceData};
            province.datum(provinceData)
                .on("mouseover", function(d) {self.onProvinceHover(d3.select(this), d);})
                .on("mousemove", function(d) {self.onProvinceHover(d3.select(this), d);})
                .on("mouseenter", function(d) {self.onProvinceHover(d3.select(this), d);})
                .on("mouseleave", function(d) {self.onProvinceUnHover(d3.select(this), d);});

            this.hoverTooltip({data: provinceData, hide: true});
        }
    }

    // onProvinceHover(element, data): When hovering over a province
    onProvinceHover(element, data) {
        const provinceKey = data.key;
        const tooltip = this.tooltips[provinceKey];

        if (this.shownTooltip !== undefined && this.shownTooltip != tooltip) {
            this.shownTooltip.group
                .attr("opacity", 0)
                .style("pointer-events", "none");
        }

        if (this.shownProvince !== undefined && element != this.shownProvince) {
            this.shownProvince.classed(SelectedProvinceClsName, false);
        }

        element.style("cursor", "pointer")
            .classed(SelectedProvinceClsName, true);
        
        let elementTransform = element.attr("transform");
        elementTransform = elementTransform.match(/(?<=\().*(?=\))/g);
        elementTransform = elementTransform[0].split(",");

        let mousePos = undefined;
        let mouseX = parseFloat(elementTransform[0]) + Dims.MapGraph.GraphLeft + Dims.MapGraph.TooltipMouseXOffset;
        let mouseY = parseFloat(elementTransform[1]) + Dims.MapGraph.GraphTop + Dims.MapGraph.TooltipMouseYOffset;

        try {
            mousePos = d3.mouse(element.node());
        } catch (error) {}

        if (mousePos !== undefined) {
            mouseX += mousePos[0];
            mouseY += mousePos[1];
        }

        tooltip.group
            .attr("opacity", 1)
            .attr("transform", `translate(${mouseX}, ${mouseY})`)
            .style("pointer-events", "auto");

        this.shownTooltip = tooltip;
        this.shownProvince = element;
    }

    // onProvinceUnHover(element, data): When unhovering from a province
    onProvinceUnHover(element, data) {
        element.style("cursor", "default")
            .classed(SelectedProvinceClsName, false);

        const provinceKey = data.key;
        const tooltip = this.tooltips[provinceKey];
        if (tooltip == undefined)  return;

        this.hideTooltip(tooltip);
        this.shownTooltip = undefined;
        this.shownProvince = undefined;
    }

    /* Creates tooltip for hovering over bars */
    hoverTooltip({data, hide = false} = {}){
        const provinceKey = data.key;
        const provinceName = data.data[DataCols.SubGroup];
        const colour = `var(--${provinceKey}Colour)`;

        const lines = Translation.translate("MapGraph.tooltip", { 
            returnObjects: true, 
            estimate: data.data[DataCols.Estimate]
        });
        
        // ------- draw the tooltip ------------

        // attributes for the tool tip
        const toolTip = {};
        let toolTipWidth = Dims.MapGraph.TooltipMinWidth;
        let toolTipHeight = Dims.MapGraph.TooltipHeight;
        const textGroupPosX = Dims.MapGraph.TooltipHighlightWidth + Dims.MapGraph.TooltipPaddingHor +  Dims.MapGraph.TooltipTextPaddingHor;
        let currentTextGroupPosY = Dims.MapGraph.TooltipPaddingVert + Dims.MapGraph.TooltipTextPaddingVert;

        const toolTipHighlightXPos = Dims.MapGraph.TooltipPaddingHor + Dims.MapGraph.TooltipHighlightWidth / 2;

        // draw the container for the tooltip
        toolTip.group = this.tooltipGroup.append("g")
            .attr("opacity", hide ? 0 : 1)
            .on("touchstart", (event, data) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();

                if (this.shownTooltip === undefined) return;

                let currentOpacity = this.shownTooltip.group.attr("opacity");
                let newOpacity = Math.abs(currentOpacity - 1);
                this.shownTooltip.group
                    .attr("opacity", newOpacity)
                    .style("pointer-events", newOpacity ? "auto": "none");

                if (newOpacity == 0) {
                    this.shownTooltip = undefined;
                }
            });

        // draw the background for the tooltip
        toolTip.background = toolTip.group.append("rect")
            .attr("height", toolTipHeight)
            .attr("width", toolTipWidth)
            .attr("fill", "var(--surface)")
            .attr("stroke", colour)
            .attr("stroke-width", Dims.MapGraph.TooltipBorderWidth)
            .attr("rx", 5);

        // draw the highlight
        toolTip.highlight = toolTip.group.append("line")
            .attr("x1", toolTipHighlightXPos)
            .attr("x2", toolTipHighlightXPos)
            .attr("y1", Dims.MapGraph.TooltipPaddingVert)
            .attr("y2", toolTipHeight - Dims.MapGraph.TooltipPaddingVert)
            .attr("stroke", colour) 
            .attr("stroke-width", Dims.MapGraph.TooltipHighlightWidth)
            .attr("stroke-linecap", "round");

        // draw the title
        toolTip.titleGroup = toolTip.group.append("text")
            .attr("font-size", Dims.MapGraph.TooltipFontSize)
            .attr("font-weight", "bold")
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const titleDims = Visuals.drawText({textGroup: toolTip.titleGroup, text: provinceName, fontSize: Dims.MapGraph.TooltipFontSize, 
                                            textWrap: TextWrap.NoWrap, padding: Dims.MapGraph.TooltipPaddingVert});

        currentTextGroupPosY += titleDims.textBottomYPos + Dims.MapGraph.TooltipTitleMarginBtm;

        // draw the text
        toolTip.textGroup = toolTip.group.append("text")
            .attr("font-size", Dims.MapGraph.TooltipFontSize)
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const textDims = Visuals.drawText({textGroup: toolTip.textGroup, text: lines, fontSize: Dims.MapGraph.TooltipFontSize, 
                                           textWrap: TextWrap.NoWrap, padding: Dims.MapGraph.TooltipPaddingVert});

        currentTextGroupPosY += textDims.textBottomYPos;

        // update the height of the tooltip to be larger than the height of all the text
        toolTipHeight = Math.max(toolTipHeight, currentTextGroupPosY + Dims.MapGraph.TooltipPaddingVert + Dims.MapGraph.TooltipTextPaddingVert);
        toolTip.background.attr("height", toolTipHeight);
        toolTip.highlight.attr("y2", toolTipHeight - Dims.MapGraph.TooltipPaddingVert);

        // update the width of the tooltip to be larger than the width of all the text
        toolTipWidth = Math.max(toolTipWidth, 2 * Dims.MapGraph.TooltipPaddingHor + Dims.MapGraph.TooltipHighlightWidth + 2 * Dims.MapGraph.TooltipTextPaddingHor + Math.max(titleDims.width, textDims.width));
        toolTip.background.attr("width", toolTipWidth);

        // -------------------------------------

        this.tooltips[provinceKey] = toolTip;
        return toolTip;
    }

    update() {
        super.update();
        this.setup();
        this.drawMap();
        this.addData();
    }
}