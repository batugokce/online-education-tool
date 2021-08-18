const qBank = [
    {
        question:
            "According to the Article, what is one reason why David Prince wants the IPC to change its current rules ?",
        answers: [{name: "Paralympic athletes from less wealthy countries may be at a disadvantage, since assistive technology can be extremely expensive.", key: 'q1a1'},
            {name: "Athletes who are double amputees using assistive technology have an advantage over single amputees, yet the two groups compete against each other.", key: 'q1a2'},
            {name: "An IPC spokesperson said that athletes with coordination impairments compete without using any assistive technology.", key: 'q1a3'},
            {name: "The IPC handbook currently prohibits unrealistic enhancement of an athlete's ability using assistive technology, even if the athlete has a disability.", key: 'q1a4'}],
        correct: "An IPC spokesperson said that athletes with coordination impairments compete without using any assistive technology.",
        questionId: "1"
    },
    {
        question:
           "The best alternate headline for this Article would be __________.?",
        answers: [{name: "Samsung's Blind Cap Helps Visually Impaired Paralympic Swimmers Race", key: 'q2a1'},
            {name: "Greek Paralympic Runner Michail Seitis Sets World Record in Men's 400-Meter Final", key: 'q2a2'},
            {name: "Some Say Assistive Technology Gives Certain Paralympic Athletes an Unfair Edge", key: 'q2a3'},
            {name: "Paralympic Games Offer Athletes With Disabilities a Chance To Compete", key: 'q2a4'}],
        correct: "Paralympic Games Offer Athletes With Disabilities a Chance To Compete",
        questionId: "2"
    },
    {
        question:
            "Which is the closest synonym for the word disquieting ?",
        answers: [{name: "Glorious", key: 'q3a1'}, {name: "Concerning", key: 'q3a2'}, {name: "Unerring", key: 'q3a3'}, {name: "Quirky", key: 'q3a4'}],
        correct: "Glorious",
        questionId: "3"
    },

];

// n = 3 to export 3 question
export default (n = 3) =>
    Promise.resolve(qBank.sort(() => 0.5 - Math.random()).slice(0, n));