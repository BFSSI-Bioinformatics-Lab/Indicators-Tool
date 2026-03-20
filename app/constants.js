
// Different Pages in the App
export const Pages = {
    Home: "Home",
    Plots: "Plots"
}

// File locations for each page
export const PageSrc = {
    [Pages.Home]: "./templates/home_page.html",
    [Pages.Plots]: "./templates/plot_page.html"
};

// columns in the CSV files
export const DataCols = {
    Topic: "Topic ",
    Indicator: "Indicator",
    Population: "Population",
    GraphType: "Graph type",
    SubGroup: "Subgroup",
    Estimate: "Estimate"
}

// Different filter options for the plots
export const PlotFilterOpts = {
    Topic: "Topic ",
    Indicator: "Indicator",
    Population: "Population",
    GraphType: "GraphType"
}

// Different types of graphs
export const GraphTypes = {
    Sex: "sex",
    Age: "age",
    Map: "map",
    Population: "population",
    Income: "income",
    Education: "education",
    BackgroundAndIdentity: "background and identity",
    ImmigrantStatus: "immigrant status",
    NotApplicable: "not applicable",
    AgeSex: "age sex"
}

// Paths to the images for the graph
export const GraphSelectImages = {
    [GraphTypes.Sex]:  "./images/rbasg.png",
    [GraphTypes.Age]: "./images/rbf.png",
    [GraphTypes.Map]: "./images/rbfg.png",
    [GraphTypes.Population]: "./images/rbasg.png",
    [GraphTypes.Income]: "./images/rbf.png",
    [GraphTypes.Education]: "./images/rbfg.png",
    [GraphTypes.BackgroundAndIdentity]: "./images/rbasg.png",
    [GraphTypes.ImmigrantStatus]: "./images/rbf.png",
    [GraphTypes.ImmigrantStatus]: "./images/rbfg.png",
    [GraphTypes.NotApplicable]: "./images/rbasg.png",
    [GraphTypes.AgeSex]: "./images/rbf.png"
}

// PlotFilterOrder: Order for the filter options in the plots
export const PlotFilterOrder = [PlotFilterOpts.Topic, PlotFilterOpts.Indicator, PlotFilterOpts.Population, PlotFilterOpts.GraphType];
export const PlotFilterOrderInds = {};
for (let i = 0; i < PlotFilterOrder.length; ++i) {
    PlotFilterOrderInds[PlotFilterOrder[i]] = i;
}

// Keys for identifying provinces
export const ProvinceKeys = {
    Ontario: "ontario",
    Manitoba: "manitoba",
    Saskatchewan: "saskatchewan",
    Alberta: "alberta",
    BritishColumnbia: "britishColumbia",
    Nunavut: "nunavut",
    NorthWestTerritories: "northWestTerritories",
    Yukon: "yukon",
    Quebec: "quebec",
    NewfoundlandAndLabrador: "newfoundlandAndLabrador",
    NewBrunswick: "newBrunswick",
    NovaScotia: "novaScotia",
    PrinceEdwardIsland: "princeEdwardIsland"
}

// DefaultDims: Default dimensions used for certain dimension attributes
export const DefaultDims = {
    fontSize: 12,
    paddingSize: 5,
    pos: 0,
    length: 0,
    borderWidth: 3,
    lineSpacing: 1
};

// text wrap attributes
export const TextWrap  = {
    NoWrap: "No Wrap",
    Wrap: "Wrap"
};

// Dims: Dimensions used in the visuals
export const Dims = {
    MapGraph: {
        HeadingFontSize: 110,
        MapScale: 1.32,
        GraphWidth: 2900,
        GraphHeight: 2600,
        GraphTop: 250,
        GraphBottom: 80,
        GraphLeft: 220,
        GraphRight: 200,
        TooltipMinWidth: 400,
        TooltipHeight: 240,
        TooltipPaddingVert: 24,
        TooltipPaddingHor: 18,
        TooltipTextPaddingVert: 8,
        TooltipTextPaddingHor: 24,
        TooltipHighlightWidth: 10,
        TooltipBorderWidth: 10,
        TooltipFontSize: 65,
        TooltipTitleMarginBtm: 12,
        TooltipMouseXOffset: 100,
        TooltipMouseYOffset: 100
    }
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
            [PlotFilterOpts.Population]: `Population`,
            [PlotFilterOpts.GraphType]: `Graph Type`
        },

        AboutPlot: `<b>About this dashboard</b>: Explore the health of people in Canada through the data
        dashboard. Choose a topic from the drop down menu, then choose an indicator. Explore the data for each indicator by
        clicking on the chart images on each indicator page. Some indicators may have additional data trends you can view`,
        
        GraphTypes: {
            "Sex": GraphTypes.Sex,
            "Age": GraphTypes.Age,
            "Map": GraphTypes.Map,
            "Population": GraphTypes.Population,
            "Income": GraphTypes.Income,
            "Education": GraphTypes.Education,
            "Cultural/racial background & Indigenous identity": GraphTypes.BackgroundAndIdentity,
            "Immigrant status": GraphTypes.ImmigrantStatus,
            "N/A": GraphTypes.NotApplicable,
            "Age-sex": GraphTypes.AgeSex
        },

        NoGraphAvailable: "No Graph Available",

        ProvinceKeys: {
            "Ontario": ProvinceKeys.Ontario,
            "Manitoba": ProvinceKeys.Manitoba,
            "Saskatchewan": ProvinceKeys.Saskatchewan,
            "Alberta": ProvinceKeys.Alberta,
            "British Columbia": ProvinceKeys.BritishColumnbia,
            "Nunavut": ProvinceKeys.Nunavut,
            "Northwest Territories": ProvinceKeys.NorthWestTerritories,
            "Yukon": ProvinceKeys.Yukon,
            "Quebec": ProvinceKeys.Quebec,
            "Newfoundland and Labrador": ProvinceKeys.NewfoundlandAndLabrador,
            "New Brunswick": ProvinceKeys.NewBrunswick,
            "Nova Scotia": ProvinceKeys.NovaScotia,
            "Prince Edward Island": ProvinceKeys.PrinceEdwardIsland
        },

        MapGraph: {
            graphTitle: "Indicator Estimate Across Provinces",
            tooltip: [
                "Estimate: {{ estimate }}"
            ]
        }
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
            [PlotFilterOpts.Population]: `${REMPLACER_MOI}`,
            [PlotFilterOpts.GraphType]: `${REMPLACER_MOI}`
        },
        AboutPlot: `<b>${REMPLACER_MOI}</b>: ${REMPLACER_MOI}`,

        GraphTypes: {
            "Sex": GraphTypes.Sex,
            "Age": GraphTypes.Age,
            "Map": GraphTypes.Map,
            "Population": GraphTypes.Population,
            "Income": GraphTypes.Income,
            "Education": GraphTypes.Education,
            "Cultural/racial background & Indigenous identity": GraphTypes.BackgroundAndIdentity,
            "Immigrant status": GraphTypes.ImmigrantStatus,
            "N/A": GraphTypes.NotApplicable,
            "Age-sex": GraphTypes.AgeSex
        },

        NoGraphAvailable: `${REMPLACER_MOI}`,

        ProvinceKeys: {
            "Ontario": ProvinceKeys.Ontario,
            "Manitoba": ProvinceKeys.Manitoba,
            "Saskatchewan": ProvinceKeys.Saskatchewan,
            "Alberta": ProvinceKeys.Alberta,
            "British Columbia": ProvinceKeys.BritishColumnbia,
            "Nunavut": ProvinceKeys.Nunavut,
            "Northwest Territories": ProvinceKeys.NorthWestTerritories,
            "Yukon": ProvinceKeys.Yukon,
            "Quebec": ProvinceKeys.Quebec,
            "Newfoundland and Labrador": ProvinceKeys.NewfoundlandAndLabrador,
            "New Brunswick": ProvinceKeys.NewBrunswick,
            "Nova Scotia": ProvinceKeys.NovaScotia,
            "Prince Edward Island": ProvinceKeys.PrinceEdwardIsland
        },

        MapGraph: {
            graphTitle: REMPLACER_MOI,
            tooltip: [
                `${REMPLACER_MOI_AVEC_ARGUMENTS}: {{ estimate }}`
            ]
        }
    }
}

// ==============================================================

// translations for certain text used in the project
export const TranslationObj = {
    en: LangEN,
    fr: LangFR,
}
