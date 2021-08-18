const qBank = [
    {
        question: "Blue Moon is always crowded. Let’s / a table before we go.",
        correct: "book",
        questionId: "7"
    },
    {
        question: "Topkapı Palace in İstanbul has a lot of / every day.",
        correct: "visitors",
        questionId: "8"
    },
    {
        question: "Rashid studies / at METU. He is from Libya.",
        correct: "engineering",
        questionId: "9"
    },

];

// n = 3 to export 3 question
export default (n = 3) =>
    Promise.resolve(qBank.sort(() => 0.5 - Math.random()).slice(0, n));