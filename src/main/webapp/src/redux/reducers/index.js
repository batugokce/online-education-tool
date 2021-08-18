import {
    ADD_SECTION,
    DELETE_SECTION, GO_DOWN, GO_UP,
    SAVE_SECTION
} from "../constants/actionTypes";

const initialState = {
    sections: []
};

function rootReducer(state = initialState, action) {
    let indexOfItem = action.key-1;
    switch (action.type) {
        case ADD_SECTION:
            return {
                sections: [...state.sections, action.payload]
            }
        case SAVE_SECTION:
            return {
                sections: [...state.sections.slice(0,indexOfItem), action.payload, ...state.sections.slice(indexOfItem+1)]
            }
        case DELETE_SECTION:
            return {
                sections: [...state.sections.slice(0,indexOfItem), ...state.sections.slice(indexOfItem+1)]
            }
        case GO_UP:
            if (indexOfItem === 0) {
                return state;
            }
            let onUpSectionToGoUp = state.sections[indexOfItem];
            let onUpSectionToGoDown = state.sections[indexOfItem-1];

            return {
                sections: [...state.sections.slice(0,indexOfItem-1), onUpSectionToGoUp, onUpSectionToGoDown, ...state.sections.slice(indexOfItem+1)]
            }
        case GO_DOWN:
            if (indexOfItem === state.sections.length-1) {
                return state;
            }
            let onDownSectionToGoDown = state.sections[indexOfItem];
            let onDownSectionToGoUp = state.sections[indexOfItem+1];

            return {
                sections: [...state.sections.slice(0,indexOfItem), onDownSectionToGoUp, onDownSectionToGoDown, ...state.sections.slice(indexOfItem+2)]
            }
        default:
            return state
    }
}

export default rootReducer;