import { Pages, DataCols, PlotFilterOpts, PlotFilterOrderInds, PlotFilterOrder, GraphTypes } from "./constants.js"
import { DictTools, Translation } from "./tools.js";


export class Model {
    constructor() {
        this.pageName = Pages.Home;
    
        this.groupedData = {};
        this.filteredData = {};

        this.plotSelections = {};
        this.plotInputs = {};
        this.plotData;
    }

    async loadData() {
        let data = await this.loadCSV(`data/${i18next.language}/Mock data for prototype.csv`);
        data = Object.freeze(d3.nest()
                            .key(d => d[DataCols.Topic])
                            .key(d => d[DataCols.Indicator])
                            .key(d => d[DataCols.Population])
                            .key(d => d[DataCols.GraphType])
                            .object(data.data));

        this.groupedData = data;
    }

    // initPlotInputs(): Initialize the data to hold the inputs
    initPlotInputs() {
        const topic = DictTools.getFirstKey(this.groupedData);
        const indicator = DictTools.getFirstKey(this.groupedData[topic]);
        const population = DictTools.getFirstKey(this.groupedData[topic][indicator]);

        let graphType = DictTools.getFirstKey(this.groupedData[topic][indicator][population]);
        if (graphType == "") {
            graphType = DictTools.getKeyAtInd(this.groupedData[topic][indicator][population], 1);
        }

        this.plotInputs = {[PlotFilterOpts.Topic]: topic, 
                           [PlotFilterOpts.Indicator]: indicator, 
                           [PlotFilterOpts.Population]: population,
                           [PlotFilterOpts.GraphType]: graphType};
    }

    // initPlotSelections(): Initializes the selection data
    initPlotSelections() {
        const selectedTopic = this.plotInputs[PlotFilterOpts.Topic];
        const selectedIndicator = this.plotInputs[PlotFilterOpts.Indicator];
        const selectedPopulation = this.plotInputs[PlotFilterOpts.Population];

        const topic = Object.keys(this.groupedData);
        const indicator = Object.keys(this.groupedData[selectedTopic]);
        const population = Object.keys(this.groupedData[selectedTopic][selectedIndicator]);
        const graphType = Object.keys(this.groupedData[selectedTopic][selectedIndicator][selectedPopulation]);

        this.plotSelections = {[PlotFilterOpts.Topic]: topic, 
                               [PlotFilterOpts.Indicator]: indicator, 
                               [PlotFilterOpts.Population]: population,
                               [PlotFilterOpts.GraphType]: graphType};
    }

    // updatePlotFilterOpt(filterOpt, value): Updates the filter inputs and selections
    updatePlotFilterOpt(filterOpt, value) {
        this.plotInputs[filterOpt] = value;

        const orderInd = PlotFilterOrderInds[filterOpt];
        let selections = this.groupedData;

        for (let i = 0; i < PlotFilterOrder.length; ++i) {
            if (i > 0) {
                const prevOpt = PlotFilterOrder[i - 1];
                const prevInput = this.plotInputs[prevOpt];
                selections = selections[prevInput];
            }
            
            if (i > orderInd) {
                const currentOpt = PlotFilterOrder[i];
                this.plotInputs[currentOpt] = (currentOpt != PlotFilterOpts.GraphType) ? DictTools.getFirstKey(selections) : DictTools.getKeyAtInd(selections, 1);
                this.plotSelections[currentOpt] = Object.keys(selections);
            }
        }
    }

    // getFilteredData(): Retrives the data filtered based on the filter options the user selected
    getFilteredData() {
        let result = this.groupedData;

        for (let i = 0; i < PlotFilterOrder.length; ++i) {
            const currentOpt = PlotFilterOrder[i];
            const currentInput = this.plotInputs[currentOpt];
            result = result[currentInput];
        }

        return result;
    }

    // updatePlotData(): Updates the internal data for the plots
    updatePlotData() {
        this.filteredData = this.getFilteredData();
        this.plotData = this.filteredData;
        const graphTypes = Translation.translate("GraphTypes", {returnObjects: true});

        if (graphTypes[this.plotInputs[PlotFilterOpts.GraphType]] == GraphTypes.Map) {
            const data = d3.nest()
                            .key(d => d[DataCols.SubGroup])
                            .object(this.plotData);

            this.plotData = {};
            const provinceKeys = Translation.translate("ProvinceKeys", {returnObjects: true});

            for (const province in data) {
                let provinceKey = provinceKeys[province];
                if (provinceKey == undefined) {
                    provinceKey = province;
                }

                this.plotData[provinceKey] = data[province][0];
            }
        }
    }

    async load() {
        await this.loadData();
        this.initPlotInputs();
        this.initPlotSelections();
        this.updatePlotData();
    }

    // loadCSV(file): Loads the table and its columns from a CSV file
    async loadCSV(file) {
        const data = await d3.csv(file);
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        return {data, columns};
    }
}