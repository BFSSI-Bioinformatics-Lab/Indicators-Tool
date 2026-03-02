import { Pages, DataCols, PlotFilterOpts, PlotFilterOrderInds, PlotFilterOrder } from "./constants.js"
import { DictTools } from "./tools.js";


export class Model {
    constructor() {
        this.pageName = Pages.Home;
        this.groupedData;
        this.plotSelections = {};
        this.plotInputs = {};
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
                this.plotInputs[currentOpt] = DictTools.getFirstKey(selections);
                this.plotSelections[currentOpt] = Object.keys(selections);
            }
        }
    }

    // TODO: How to handle updating the data for the plots
    updatePlotData() {
        
    }

    async load() {
        await this.loadData();
        this.initPlotInputs();
        this.initPlotSelections();
    }

    // loadCSV(file): Loads the table and its columns from a CSV file
    async loadCSV(file) {
        const data = await d3.csv(file);
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        return {data, columns};
    }
}