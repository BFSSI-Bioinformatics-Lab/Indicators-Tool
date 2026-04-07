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
            .attr("transform", `translate(${Dims.MapGraph.GraphLeft}, ${Dims.MapGraph.GraphTop}) scale(${Dims.MapGraph.MapScale})`);
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
            .attr("transform", "translate(431,909)")
            .html(SVGS.Saskatchewan)

        this.provinces[ProvinceKeys.Alberta] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.Alberta)
            .attr("transform", "translate(263,818)")
            .html(SVGS.Alberta)

        this.provinces[ProvinceKeys.BritishColumnbia] = this.mapContainer.append("g")
            .attr("id", ProvinceKeys.BritishColumnbia)
            .attr("transform", "translate(-8,600)")
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
        let mouseX = parseFloat(elementTransform[0]) * Dims.MapGraph.MapScale + Dims.MapGraph.GraphLeft;
        let mouseY = parseFloat(elementTransform[1]) * Dims.MapGraph.MapScale + Dims.MapGraph.GraphTop;

        try {
            mousePos = d3.mouse(element.node());
        } catch (error) {}

        if (mousePos !== undefined) {
            mouseX += mousePos[0] * Dims.MapGraph.MapScale;
            mouseY += mousePos[1] * Dims.MapGraph.MapScale;
        }

        if (mouseX <= Dims.MapGraph.GraphWidth / 2) {
            mouseX += Dims.MapGraph.TooltipMouseXOffset;
        } else {
            const toolTipWidth = tooltip.background.attr("width");
            mouseX -= toolTipWidth * Dims.MapGraph.MapScale - Dims.MapGraph.TooltipMouseXOffset;
        }

        if (mouseY <= Dims.MapGraph.GraphHeight / 2) {
            mouseY += Dims.MapGraph.TooltipMouseYOffset;
        } else {
            const toolTipHeight = tooltip.background.attr("height");
            mouseY -= toolTipHeight * Dims.MapGraph.MapScale - Dims.MapGraph.TooltipMouseYOffset;
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
        
        const toolTip = Visuals.createTooltip({tooltipGroup: this.tooltipGroup, title: provinceName, lines, colour, hide, 
            tooltipMinWidth: Dims.MapGraph.TooltipMinWidth,
            toolTipHeight: Dims.MapGraph.TooltipHeight,
            tooltipPaddingVert: Dims.MapGraph.TooltipPaddingVert,
            tooltipPaddingHor: Dims.MapGraph.TooltipTextPaddingHor,
            tooltipTextPaddingVert: Dims.MapGraph.TooltipTextPaddingVert,
            tooltipTextPaddingHor: Dims.MapGraph.TooltipTextPaddingHor,
            tooltipHighlightWidth: Dims.MapGraph.TooltipHighlightWidth,
            tooltipBorderWidth: Dims.MapGraph.TooltipBorderWidth,
            tooltipFontSize: Dims.MapGraph.TooltipFontSize,
            tooltipTitleMarginBtm: Dims.MapGraph.TooltipTitleMarginBtm,
        });

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