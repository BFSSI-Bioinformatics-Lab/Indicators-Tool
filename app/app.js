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


import { Translation, TranslationObj } from './assets.js';


//////////
// MAIN //
//////////

Translation.register(TranslationObj);

// load in the view for the application
window.addEventListener("load", () => {
    console.log("HELLO WORLD");
});