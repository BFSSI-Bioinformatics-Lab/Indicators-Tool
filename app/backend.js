import { Pages } from "./constants.js"


export class Model {
    constructor() {
        this.pageName = Pages.Home;
    }

    // TODO: How to load in the data
    async load() {
        const data = await this.loadCSV(`data/${i18next.language}/Mock data for prototype.csv`);
    }

    // loadCSV(file): Loads the table and its columns from a CSV file
    async loadCSV(file) {
        const data = await d3.csv(file);
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        return {data, columns};
    }
}