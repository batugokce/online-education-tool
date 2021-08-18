import {
    ADD_SECTION,
    DELETE_SECTION, GO_DOWN, GO_UP,
    SAVE_SECTION
} from "../constants/actionTypes";

export function addSection(payload) {
    return { type: ADD_SECTION, payload }
}

export function saveSection(key, payload) {
    return { type: SAVE_SECTION, key, payload }
}

export function deleteSection(key) {
    return { type: DELETE_SECTION, key }
}

export function goUp(key) {
    return { type: GO_UP, key}
}

export function goDown(key) {
    return { type: GO_DOWN, key}
}
