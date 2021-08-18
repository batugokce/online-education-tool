const qBank = [
    {
        question: "Claverton Boarding School is in London.",
        answers: [{name: "T", key: 'q1a1'},
            {name: "F", key: 'q1a2'},],
        correct: "T",
        questionId: "4"
    },
    {
        question: "There is a canteen next to the main building.",
        answers: [{name: "T", key: 'q2a1'},
            {name: "F", key: 'q2a2'}],
        correct: "F",
        questionId: "5"
    },
    {
        question: "There aren’t any sports facilities at the school.",
        answers: [{name: "T", key: 'q3a1'}, {name: "F", key: 'q3a2'}],
        correct: "T",
        questionId: "6"
    },

];

// n = 3 to export 3 question
export default (n = 3) =>
    Promise.resolve(qBank.sort(() => 0.5 - Math.random()).slice(0, n));