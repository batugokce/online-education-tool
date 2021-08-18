import React from "react";

export function generateEmptyOrderingJson(order) {
    return {
        'type':'ordering',
        'order': order,
        'description': "",
        'point' : 0,
        'orderings': []
    }
}

export function generateOrderingJson(description, orderings, point, order) {
    return {
        'type':'ordering',
        'order': order,
        'description': description,
        'point' : point,
        'orderings': orderings
    }
}

export function generateOrderings() {
    return {
        'text': '',
        'correctOrder': ''
    }
}

export function generateEmptyTrueFalseJson(order) {
    return {
        'type':'tf',
        'order': order,
        'description': "",
        'point' : 0,
        'trueFalses': []
    }
}

export function generateTrueFalseJson(description, trueFalses, point, order) {
    return {
        'type':'tf',
        'order': order,
        'description': description,
        'point' : point,
        'trueFalses': trueFalses
    }
}

export function generateTrueFalses() {
    return {
        'text': '',
        'correctAnswer': ''
    }
}

export function generateEmptyMatchingJson(order) {
    return {
        'type':'matching',
        'order': order,
        'description': "",
        'point' : 0,
        'matchings': []
    }
}

export function generateMatchingJson(description, matchings, point, order) {
    return {
        'type':'matching',
        'order': order,
        'description': description,
        'point' : point,
        'matchings': matchings
    }
}

export function generateMatchings(number) {
    return {
        'number': number,
        'leftPart': '',
        'rightPart': ''
    }
}

export function generateEmptyWrittenJson(order) {
    return {
        'type':'written',
        'order': order,
        'description': "",
        'point' : 0,
        'writtenQuestion': {
            'progressiveGrading' : false
        }
    }
}

export function generateWrittenJson(description, point, order, progressiveGrading) {
    return {
        'type':'written',
        'order': order,
        'description': description,
        'point' : point,
        'writtenQuestion': {
            'progressiveGrading' : progressiveGrading,
        }
    }
}

export function generateEmptyGapFillingJson(order) {
    return {
        'type':'fill',
        'order': order,
        'description': "",
        'point' : 0,
        'gapFillingMain': {
            'clues': '',
            'gapFillings': [

            ]
        }
    }
}

export function generateGapFillingJson(description, gapFillings, clues, point, order) {
    return {
        'type':'fill',
        'order': order,
        'description': description,
        'point' : point,
        'gapFillingMain': {
            'clues': clues,
            'gapFillings': gapFillings
        }
    }
}

export function generateGapFillings(num) {
    return {
        'num': num,
        'questionText': '',
        'answer': ''
    }
}

export function generateEmptyMCJson(order) {
    return {
        'type':'mc',
        'order': order,
        'description': "",
        'point' : 0,
        'multipleChoices': []
    }
}

export function generateMCJson(description, multipleChoices, point, order) {
    return {
        'type':'mc',
        'order': order,
        'description': description,
        'point' : point,
        'multipleChoices': multipleChoices
    }
}

export function generateMultipleChoices(num) {
    return {
        'num': num,
        'text': '',
        'option1': '',
        'option2': '',
        'option3': '',
        'option4': '',
        'option5': '',
        'correctAnswer': ''
    }
}