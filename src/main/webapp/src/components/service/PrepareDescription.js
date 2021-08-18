import sanitizeHtml from "sanitize-html";
import {getSanitizerOptions, removePTags} from "./sanitizerOptions";
import React from "react";

function nextLetter(s, index){
    return s.replace(/([a-zA-Z])[^a-zA-Z]*$/, function(a){
        let c = a.charCodeAt(0);
        switch(c){
            case 90: return 'A';
            case 122: return 'a';
            default: return String.fromCharCode(c+index);
        }
    });
}

export function prepareDescription(description, indexQuestion, point){
    let letter = nextLetter("A",indexQuestion-1);
    let cleanHtml = sanitizeHtml(removePTags(description), getSanitizerOptions());
    let result = letter + ") " + cleanHtml + "(" + point + " pts.)";
    return(
        <h4 className={"mb-3"} ><div dangerouslySetInnerHTML={{ __html: result }} /></h4>
    )
}