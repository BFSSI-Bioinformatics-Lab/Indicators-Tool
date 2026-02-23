////////////////////////////////////////////////////////////////////
//                                                                //
// Purpose: Handles the overall display of the program            //
//                                                                //
// What it Contains:                                              //
//      - wrappers to draw and update the sun burst graph and     //
//          the bar graph                                         //
//      - the main function to run the overall program            //
//      - initiliazes the backend of the program                  //
//                                                                //
////////////////////////////////////////////////////////////////////      


import { Translation } from './tools.js';
import { TranslationObj, PageSrc, Pages, PlotFilterOpts, PlotFilterOrder, PlotFilterOrderInds } from './constants.js';
import { Model } from './backend.js';


class App {
    constructor(model) {
        this.model = model;
        this.isSetup = {
            [Pages.Home]: false,
            [Pages.Plots]: false
        };
    }

    // init(page): Initializes the entire app
    async init(page = undefined) {
        this.updateStaticText();
        this.setupNavMenu();
        this.loadMainPage(page);
    }

    // UpdateStaticText: Updates text for static elements when the page loads
    updateStaticText() {
        d3.select(".blue-header #wb-cont").html(Translation.translate("PageHeaderTitle"));

        const pageSelectTranslations = Translation.translate("PageSelectTitles", {returnObjects: true});
        d3.selectAll(".pageSelectBtnContainer button").each((data, ind, nodes) => {
            const button = d3.select(nodes[ind]);
            const page = button.attr("value");
            button.html(pageSelectTranslations[page]);
        });
    }

    setupNavMenu() {
        const self = this;
        d3.selectAll(".pageSelectBtnContainer button")
            .on("click", function(data) {
                let selectedPageSelect = d3.select(this);
                const activePageSelect = d3.select(".pageSelectBtnContainer button.active");

                self.setSelectedOpt(selectedPageSelect, activePageSelect, data, (selectedOpt, data) => {
                    const page = data;
                    if (page) {
                        self.model.pageName = page;
                        self.loadMainPage();
                    }
                });
            });

        const activePageSelect = d3.select(`.pageSelectBtnContainer button[value="${this.model.pageName}"]`);
        this.setNavOptActive(activePageSelect);
    }

    // setNavOptActive(element): Makes some option to be selected
    setNavOptActive(element) {
        element.classed("active", true);
        element.classed("btn-default", false);
        element.classed("btn-primary", true);
        element.attr("aria-current", "page"); // for assessibility
    }

    // setNavOptInactive(element): Makes some option to be unselected
    setNavOptInactive(element) {
        element.classed("active", false);
        element.classed("btn-primary", false);
        element.classed("btn-default", true);
        element.attr("aria-current", null); // for assessibility
    }

    // setSelectedOpt(selectedOpt, activeOpt, data, onSelected): Sets the selected option to be
    //  active and disables the previous selected option
    setSelectedOpt(selectedOpt, activeOpt, data, onSelected) {
        if (data === undefined) {
            data = selectedOpt.attr("value");
        }

        this.setNavOptInactive(activeOpt);
        this.setNavOptActive(selectedOpt);
        onSelected(selectedOpt, data);
    }

    // Loads the selected main page for the app
    loadMainPage(page = undefined) {
        const self = this;
        if (page === undefined) {
            page = self.model.pageName;
        }

        $("#mainPage").load(PageSrc[page], function() { self.updateMainPage(page); });
    }

    // updateMainPage(): Updates the entire main page without loading its corresponding HTML
    updateMainPage(page = undefined) {
        this.page = d3.select(".pageContainer");
        if (page === undefined) {
            page = this.model.pageName;
        }
        
        if (page == Pages.Home) {
            this.updateHomePage();
        } else if (page == Pages.Plots) {
            this.updatePlotPage();
        }
    }

    // TODO: How to handle the home page
    updateHomePage() {
        this.isSetup[Pages.Home] = true;
    }

    // updateDropdown(dropdownContainer, selections, input, title, onDropdownSelect): Updates a dropdown
    updateDropdown(dropdownContainer, selections, input, title, onDropdownSelect, enabled = true) {
        const dropdown = dropdownContainer.select("select");
        dropdown.property("disabled", !enabled);

        dropdown.selectAll("option").remove();
        dropdown
            .on("change", onDropdownSelect)
            .style("width", "100%")
            .selectAll("option")
            .data(selections)
            .enter()
            .append("option")
            .property("value", d => d)
            .text(d => d);
        dropdown.property("value", input);

        const dropdownLabel = dropdownContainer.select("label");
        dropdownLabel.text(title);
    }

    updatePlotFilterOpt(selector, filterOpt) {
        const value = selector.property("value");
        this.model.updatePlotFilterOpt(filterOpt, value);
        
        const orderInd = PlotFilterOrderInds[filterOpt];
        for (let i = orderInd + 1; i < PlotFilterOrder.length; ++i) {
            const opt = PlotFilterOrder[i];
            this.updateDropdownFuncs[opt]();
        }
    }

    // updatePlotDropdown(): Updates the dropdown for the plots
    updatePlotDropdown(filterOpt, dropdownContainer) {
        const dropdown = dropdownContainer.select("select");
        const plotFilterTitles = Translation.translate("PlotFilterTitles", {returnObjects: true});
        const selections = this.model.plotSelections[filterOpt];

        const selectionIsEmpty = (selections.length < 0 || (selections.length == 1 && selections[0] == ""));

        this.updateDropdown(dropdownContainer, this.model.plotSelections[filterOpt], this.model.plotInputs[filterOpt], 
                            plotFilterTitles[filterOpt], () => this.updatePlotFilterOpt(dropdown, filterOpt), !selectionIsEmpty);
    }

    setupPlotPage() {
        d3.select("#aboutPlotText").html(Translation.translate("AboutPlot"));

        this.updateDropdownFuncs = {
            [PlotFilterOpts.Topic]: () => {this.updatePlotDropdown(PlotFilterOpts.Topic, d3.select("#topicDropdown"))},
            [PlotFilterOpts.Indicator]: () => {this.updatePlotDropdown(PlotFilterOpts.Indicator, d3.select("#indicatorDropdown"))},
            [PlotFilterOpts.Population]: () => {this.updatePlotDropdown(PlotFilterOpts.Population, d3.select("#populationDropdown"))}
        };


        for (const opt in this.updateDropdownFuncs) {
            this.updateDropdownFuncs[opt]();
        }
    }

    updatePlotPage() {
        this.setupPlotPage();
        this.isSetup[Pages.Plots] = true;
    }
}



//////////
// MAIN //
//////////

Translation.register(TranslationObj);

// load in the view for the application
window.addEventListener("load", () => {
    let model = new Model();

    let app = new App(model);

    Promise.all([model.load()]).then(() => {
        app.init(Pages.Home);
    });
});