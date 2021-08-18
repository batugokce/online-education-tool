export function getSanitizerOptions() {
    return {
        allowedTags: ['p','br','h2','h1','strong','span','em','u','ol','ul','li','img'],
        allowedAttributes: {
            'span': [ 'class','style' ],
            'img': ['src', 'width']
        },
        allowedSchemes: [
            'data'
        ]
    }
}

export function disableAllOptions() {
    return {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape'
    }
}

export function removePTags(text) {
    if (text !== null) {
        text = text.replaceAll("<p>","")
        text = text.replaceAll("</p>","")
    }
    return text;
}