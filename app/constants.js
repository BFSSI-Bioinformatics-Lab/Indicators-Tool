
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


// Translation: Helper class for doing translations
export class Translation {
    static register(resources){
        i18next.use(i18nextBrowserLanguageDetector).init({
            fallbackLng: "en",
            detection: {
                order: ['querystring', 'htmlTag', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
            },
            resources: resources
        })
        i18next.changeLanguage();
    }
    
    // Note:
    // For some food groups with special characters like "Fruits & Vegetables", we want the title to be displayed as "Fruits & Vegetables" instead of "Fruits &amp; Vegatables"
    //  After passing in the food group into the i18next library, the library encoded the food group to be "Fruits &amp; Vegatables"
    // So all the special characters got encoded to their corresponding HTML Entities (eg. &lt; , &gt; , &quot;)
    //
    // So we need to decode back the encoded string with HTML entities to turn back "Fruits &amp; Vegetables" to "Fruits & Vegetables"
    static translate(key, args){
        const result = i18next.t(key, args);

        if (typeof result !== 'string') return result;
        return he.decode(result);
    }

    // translateNumStr(numStr, decimalPlaces): Translate a number to its correct
    //  numeric represented string for different languages
    // eg. '1.2' -> '1,2' in French
    //
    // Note:
    //  See https://www.i18next.com/translation-function/formatting for more formatting
    static translateNum(numStr, decimalPlaces = 1) {
        let num = Number(numStr);
        if (Number.isNaN(num)) return numStr;

        let translateArgs = {num}
        if (decimalPlaces) {
            translateArgs["minimumFractionDigits"] = decimalPlaces;
            translateArgs["maximumFractionDigits"] = decimalPlaces;
        }

        return this.translate("Number", translateArgs);
    }
}


// ================= ENGLISH TRANSLATIONS =======================

const LangEN = {
    translation: {
        Number: "{{num, number}}",
        PageHeaderTitle: `Indicators Tool <small style="color:#fff;">from Health Canada</small>`,
        PageTitle: `Indicators Tool <small><strong>from Health Canada</strong></small>`,
        PageSelectTitles: {
            [Pages.Home]: "<b>Explore</b> the Indicators",
            [Pages.Plots]: "<b>Explore</b> the Dashboard"
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
        PageHeaderTitle: `${REMPLACER_MOI} <small style="color:#fff;">from Health Canada</small>`,
        PageTitle: `${REMPLACER_MOI} <small><strong>de Santé Canada</strong></small>`,
        PageSelectTitles: {
            [Pages.Home]: `<b>Explorer</b> ${REMPLACER_MOI}`,
            [Pages.Plots]: `<b>Explorer</b> ${REMPLACER_MOI}`
        }
    }
}

// ==============================================================

// translations for certain text used in the project
export const TranslationObj = {
    en: LangEN,
    fr: LangFR,
}
