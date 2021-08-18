const qBank = [
    {
        question: "People have been using natural medicines for thousands of years. For example, Hippocrates gave the bark of the willow tree (1) / because it helped them to get rid of their aches and pains. (2) / , which comes from cinchona tree, is another example of a natural remedy. These trees grow in the Andes Mountains in South America. Quinine has been used to (3) / by the Peruvian Indians for a long time.\n" +
            "In 1775, William Withering couldn’t treat a patient with a serious heart problem. Then, he heard about purple foxglove from a (4) / who treated patients with heart problems.\n" +
            "In our gardens and homes, there are many (5) / . Lavender is one of them. If you have (6) / problems, you can put some lavender oil on your pillow. For the burns or cuts, aloe vera is very helpful. When you (7) / from an aloe vera plant, you get the sap of the plant. You should (8) / your burns or cuts. This will help them to heal and also stop you getting a scar.\n"+
            " Garlic has healing powers, too. If you have a cold, garlic may help you because (9) / .",
        correct: "",
        questionId: "9"
    },

];

// n = 3 to export 3 question
export default (n = 3) =>
    Promise.resolve(qBank.sort(() => 0.5 - Math.random()).slice(0, n));