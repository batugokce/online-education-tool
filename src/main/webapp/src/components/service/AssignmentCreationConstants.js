export function getEnglishLevelItems() {
    return [
        {value: 'BEGINNER', label: 'Beginner'},
        {value: 'ELEMENTARY', label: 'Elementary'},
        {value: 'PRE_INTERMEDIATE', label: 'Pre-intermediate'},
        {value: 'INTERMEDIATE', label: 'Intermediate'},
        {value: 'UPPER_INTERMEDIATE', label: 'Upper-intermediate'}
    ];
}

export function getDifficultyLevels() {
    return [
        {label: 'Easy', value: 'EASY'},
        {label: 'Medium', value: 'MEDIUM'},
        {label: 'Hard', value: 'HARD'},
    ];
}

export function getCategories() {
    return [
        {label: 'Sports', value: 'SPORTS'},
        {label: 'Science', value: 'SCIENCE'},
        {label: 'Nature', value: 'NATURE'},
        {label: 'Art', value: 'ART'},
        {label: 'Culture', value: 'CULTURE'},
        {label: 'Health', value: 'HEALTH'},
        {label: 'Education', value: 'EDUCATION'},
        {label: 'Economy', value: 'ECONOMY'},
        {label: 'History', value: 'HISTORY'},
        {label: 'Other', value: 'OTHER'},
    ];
}

export function getAdvancedEditorToolbar() {
    return {
        toolbar: [
            [{'header': [2, 3,4, false]}],
            ['bold', 'italic', 'underline'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'background': []}],
            ['image']
        ],
        imageResize: {
            modules: [ 'Resize', 'DisplaySize' ]
        }
    };
}