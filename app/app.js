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


import { Translation, TranslationObj, PageSrc, Pages } from './constants.js';
import { Model } from './backend.js';


class App {
    constructor(model) {
        this.model = model;
    }

    // init(page): Initializes the entire app
    async init(page = undefined) {
        this.updateStaticText();
        this.setupNavMenu();
        this.loadMainPage(page);
    }

    // UpdateStaticText: Updates text for static elements when the page loads
    updateStaticText() {
        d3.select("#pageTitle").html(Translation.translate("PageTitle"));

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

    }

    // TODO: How to handle the page for the plots
    updatePlotPage() {
        
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
    app.init(Pages.Loading);

    Promise.all([model.load()]).then(() => {
        app.loadMainPage();
    });
});