
// Different Pages in the App
export const Pages = {
    Home: "Home",
    Plots: "Plots",
    Loading: "Loading"
}

// File locations for each page
export const PageSrc = {
    [Pages.Home]: "./templates/home_page.html",
    [Pages.Loading]: "./templates/loading.html",
    [Pages.Plots]: "./templates/plot_page.html"
};

// columns in the CSV files
export const DataCols = {
    Topic: "Topic ",
    Indicator: "Indicator",
    Population: "Population"
}

// PlotFilterOpts: Different filter options for the plots
export const PlotFilterOpts = {
    Topic: "Topic ",
    Indicator: "Indicator",
    Population: "Population"
}

// PlotFilterOrder: Order for the filter options in the plots
export const PlotFilterOrder = [PlotFilterOpts.Topic, PlotFilterOpts.Indicator, PlotFilterOpts.Population];
export const PlotFilterOrderInds = {};
for (let i = 0; i < PlotFilterOrder.length; ++i) {
    PlotFilterOrderInds[PlotFilterOrder[i]] = i;
}

// ================= ENGLISH TRANSLATIONS =======================

const LangEN = {
    translation: {
        Number: "{{num, number}}",
        PageHeaderTitle: `Indicators Tool <small style="color:#fff;">from Health Canada</small>`,
        PageSelectTitles: {
            [Pages.Home]: "<b>Explore</b> the Indicators",
            [Pages.Plots]: "<b>Explore</b> the Dashboard"
        },
        PlotFilterTitles: {
            [PlotFilterOpts.Topic]: `Topic`,
            [PlotFilterOpts.Indicator]: `Indicator`,
            [PlotFilterOpts.Population]: `Population`
        },
        AboutPlot: `<b>About this dashboard</b>: Explore the health of people in Canada through the data
        dashboard. Choose a topic from the drop down menu, then choose an indicator. Explore the data for each indicator by
        clicking on the chart images on each indicator page. Some indicators may have additional data trends you can view`
    }
}

// ==============================================================
// ============== FRENCH TRANSLATIONS ===========================

const REMPLACER_MOI = "REMPLACER MOI"
const REMPLACER_MOI_AVEC_ARGUMENTS = `${REMPLACER_MOI} - les arguments du texte: `;


const LangFR = {
    translation: {
        Number: "{{num, number}}",
        PageHeaderTitle: `${REMPLACER_MOI} <small style="color:#fff;">de Santé Canada</small>`,
        PageSelectTitles: {
            [Pages.Home]: `<b>Explorer</b> ${REMPLACER_MOI}`,
            [Pages.Plots]: `<b>Explorer</b> ${REMPLACER_MOI}`
        },
        PlotFilterTitles: {
            [PlotFilterOpts.Topic]: `${REMPLACER_MOI}`,
            [PlotFilterOpts.Indicator]: `${REMPLACER_MOI}`,
            [PlotFilterOpts.Population]: `${REMPLACER_MOI}`
        },
        AboutPlot: `<b>${REMPLACER_MOI}</b>: ${REMPLACER_MOI}`
    }
}

// ==============================================================

// translations for certain text used in the project
export const TranslationObj = {
    en: LangEN,
    fr: LangFR,
}
