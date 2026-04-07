/////////////////////////////////////////////////////////////////////
//                                                                 //
// Purpose: Defines the helper functions used in the app           //
//                                                                 //
//                                                                 //
/////////////////////////////////////////////////////////////////////


import { DefaultDims, TextWrap } from "./constants.js";


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


// DictTool: Tools for handling dictionaries
export class DictTools {
    // getKeyAtInd(dct, ind): Retrieve the key at a certain index
    static getKeyAtInd(dct, ind) {
        let currentInd = 0;
        for (const key in dct) {
            if (ind == currentInd) return key;
            currentInd++;
        }

        return undefined;
    }

    // getFirstKey(dct): Retrieves the first key in the dictionary
    static getFirstKey(dct) {
        for (const key in dct) {
            return key;
        }
    }
}


// Visuals: Class for handling
export class Visuals {
    // drawSingleLineText(text, TextY): Draws the text on a single line in the textbox
    static drawSingleLineText({textGroup = null, text = "", textX = DefaultDims.pos, textY = DefaultDims.pos, clear = true} = {}) {
        // remove any existing text
        if (clear) {
            textGroup.selectAll("tspan").remove();
        }

            const textNode = textGroup.append("tspan")
                .attr("x", textX).attr("y", textY)
                .text(text);

        return textNode;
    }

    // getNextTextY(textY, numOfTextLines): Retrives the next y-position for the texts
    //  in a text box
    static getNextTextY(textY, numOfTextLines, fontSize, lineSpacing) {
        return textY +  (numOfTextLines + 1) * fontSize + numOfTextLines * lineSpacing
    }

    // drawWrappedText(text, numLines):
    //   Draws the text to be wrapped around the textbox by creating
    //      tspan elements to fit text into a given width
    static drawWrappedText({textGroup = null, text = "", width = DefaultDims.length, textX = DefaultDims.pos, textY = DefaultDims.pos, 
                            numLines = [0], fontSize = DefaultDims.fontSize, lineSpacing = DefaultDims.lineSpacing, clear = true} = {}) {
        const words = text.split(" ");
        const tspanXPos = textX;
        let currentTextY = textY;
        
        // remove any existing text
        if (clear) {
            textGroup.selectAll("tspan").remove();
        }
        
        // draws the remainder of the text on a new line if the text exceeds the specified width
        words.reduce((arr, word) => {
            let textNode = arr[arr.length - 1];
            let line = textNode.text().split(" ");
            line.push(word);
            textNode.text(line.join(" "));
            if (textNode.node().getComputedTextLength() > width) {
                line.pop();
                currentTextY = Visuals.getNextTextY(textY, arr.length, fontSize, lineSpacing);

                textNode.text(line.join(" "));
                textNode = textGroup.append("tspan")
                    .attr("x", tspanXPos)
                    .attr("y", currentTextY)
                    .text(word);
                arr.push(textNode);
                numLines[0]++;
                numLines.push(textNode.text().length)
            } else {
                textNode.text(line.join(" "));
                arr[arr.length - 1] = textNode;
            }
            return arr;
        }, [textGroup.append("tspan").attr("x", tspanXPos).attr("y", textY + fontSize)]);
        numLines[0]++; 
        numLines.push(words.pop().length);
    }

    // drawText(): Draws text on 'textGroup'
    // Note: 'text' is either a string or a list of strings
    static drawText({textGroup = null, text = "", textX = DefaultDims.pos, textY = DefaultDims.pos, width = DefaultDims.length, 
              fontSize = DefaultDims.fontSize, lineSpacing = DefaultDims.lineSpacing, textWrap = TextWrap.Wrap, paddingLeft = 0, paddingRight = 0} = {}) {

        const origTextY = textY;
        let textLines = text;
        let linesWritten = 0;
        let clear = true;
        let line = "";
        let numLines = 0;

        if (typeof textLines === 'string') {
            textLines = [textLines];
        }

        const textLinesLen = textLines.length;

        // draws many lines of wrapped text that are each seperated by a newline
        if (textWrap == TextWrap.Wrap) {
            numLines = [];

            for (let i = 0; i < textLinesLen; ++i) {
                line = textLines[i];
                numLines = [];

                if (i > 0) {
                    clear = false;
                }

                Visuals.drawWrappedText({textGroup, text: line, width, textX, textY, numLines, fontSize, lineSpacing, clear});
                linesWritten += numLines.length;
                textY = Visuals.getNextTextY(origTextY, linesWritten, fontSize, lineSpacing);
            }

            textY -= fontSize;
            numLines = linesWritten - 1;

        // draws many lines of text on a single line with each text seperated by a newline
        } else if (textWrap == TextWrap.NoWrap) {
            textY += fontSize;
            numLines = 1;

            for (let i = 0; i < textLinesLen; ++i) {
                line = textLines[i];

                if (i > 0) {
                    clear = false;
                }

                let textNode = Visuals.drawSingleLineText({textGroup, text: line, textX, textY, clear});
                width = Math.max(paddingLeft + textNode.node().getComputedTextLength() + paddingRight, width);

                linesWritten += 1;
                textY = Visuals.getNextTextY(origTextY, linesWritten, fontSize, lineSpacing);
            }
        }

        return {width, textBottomYPos: textY - lineSpacing - fontSize, numLines};
    }

    /* Creates tooltip for hovering over bars */
    static createTooltip({tooltipGroup, title, lines, hide = false, colour =  "black", tooltipMinWidth = 200, toolTipHeight = 100,
                   tooltipPaddingVert = 8, tooltipPaddingHor = 8, tooltipTextPaddingVert = 4,
                   tooltipTextPaddingHor = 8, tooltipHighlightWidth = 4, tooltipBorderWidth = 2,
                   tooltipFontSize = 12, tooltipTitleMarginBtm = 4} = {}){

        // ------- draw the tooltip ------------

        // attributes for the tool tip
        const toolTip = {};
        let toolTipWidth = tooltipMinWidth;
        const textGroupPosX = tooltipHighlightWidth + tooltipPaddingHor +  tooltipTextPaddingHor;
        let currentTextGroupPosY = tooltipPaddingVert + tooltipTextPaddingVert;

        const toolTipHighlightXPos = tooltipPaddingHor + tooltipHighlightWidth / 2;

        // draw the container for the tooltip
        toolTip.group = tooltipGroup.append("g")
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
            .attr("stroke-width", tooltipBorderWidth)
            .attr("rx", 5);

        // draw the highlight
        toolTip.highlight = toolTip.group.append("line")
            .attr("x1", toolTipHighlightXPos)
            .attr("x2", toolTipHighlightXPos)
            .attr("y1", tooltipPaddingVert)
            .attr("y2", toolTipHeight - tooltipPaddingVert)
            .attr("stroke", colour) 
            .attr("stroke-width", tooltipHighlightWidth)
            .attr("stroke-linecap", "round");

        // draw the title
        toolTip.titleGroup = toolTip.group.append("text")
            .attr("font-size", tooltipFontSize)
            .attr("font-weight", "bold")
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const titleDims = Visuals.drawText({textGroup: toolTip.titleGroup, text: title, fontSize: tooltipFontSize, 
                                            textWrap: TextWrap.NoWrap, padding: tooltipPaddingVert});

        currentTextGroupPosY += titleDims.textBottomYPos + tooltipTitleMarginBtm;

        // draw the text
        toolTip.textGroup = toolTip.group.append("text")
            .attr("font-size", tooltipFontSize)
            .attr("fill", "var(--fontColour)")
            .attr("transform", `translate(${textGroupPosX}, ${currentTextGroupPosY})`);

        const textDims = Visuals.drawText({textGroup: toolTip.textGroup, text: lines, fontSize: tooltipFontSize, 
                                           textWrap: TextWrap.NoWrap, padding: tooltipPaddingVert});

        currentTextGroupPosY += textDims.textBottomYPos;

        // update the height of the tooltip to be larger than the height of all the text
        toolTipHeight = Math.max(toolTipHeight, currentTextGroupPosY + tooltipPaddingVert + tooltipTextPaddingVert);
        toolTip.background.attr("height", toolTipHeight);
        toolTip.highlight.attr("y2", toolTipHeight - tooltipPaddingVert);

        // update the width of the tooltip to be larger than the width of all the text
        toolTipWidth = Math.max(toolTipWidth, 2 * tooltipPaddingHor + tooltipHighlightWidth + 2 * tooltipTextPaddingHor + Math.max(titleDims.width, textDims.width));
        toolTip.background.attr("width", toolTipWidth);

        // -------------------------------------

        return toolTip;
    }
}