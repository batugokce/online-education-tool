import React, {Component} from "react";
import MultipleChoiceBox from './multiple-choice/MultipleChoiceBox';
import TrueFalseBox from "./true-false/TrueFalseBox";
import BlankBox from "./fill-in-the-blank/small-sentences/BlankBox";
import "./index.css"
import {Message} from "primereact/message";
import Ordering from "./ordering/Ordering";
import Matching from "./matching/Matching";
import Form from "react-bootstrap/Form";
import Written from "./written/Written";
import "./blankbox.css";
import {prepareDescription} from "../../service/PrepareDescription";


export class SectionRendered extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (JSON.parse(localStorage.getItem("fos1")) != null && (document.getElementById("fos1") != null)) {
            document.getElementById("fos1").checked = JSON.parse(localStorage.getItem("fos1"));
        }

        if (JSON.parse(localStorage.getItem("fos2")) != null && (document.getElementById("fos2") != null)) {
            document.getElementById("fos2").checked = JSON.parse(localStorage.getItem("fos2"));
        }

        if (JSON.parse(localStorage.getItem("fos3")) != null && (document.getElementById("fos3") != null)) {
            document.getElementById("fos3").checked = JSON.parse(localStorage.getItem("fos3") && (document.getElementById("fos3") != null));
        }

        if (JSON.parse(localStorage.getItem("fos4")) != null && (document.getElementById("fos4") != null)) {
            document.getElementById("fos4").checked = JSON.parse(localStorage.getItem("fos4"));
        }

        if (JSON.parse(localStorage.getItem("fos5")) != null && (document.getElementById("fos5") != null)) {
            document.getElementById("fos5").checked = JSON.parse(localStorage.getItem("fos5"));
        }
    }

    save() {

        if (document.getElementById("fos1") != null) {
            var checkbox1 = document.getElementById("fos1");
            localStorage.setItem("fos1", checkbox1.checked);
        }

        if (document.getElementById("fos2") != null) {
            var checkbox = document.getElementById("fos2");
            localStorage.setItem("fos2", checkbox.checked);
        }

        if (document.getElementById("fos3") != null) {
            var checkbox3 = document.getElementById("fos3");
            localStorage.setItem("fos3", checkbox3.checked);
        }

        if (document.getElementById("fos4") != null) {
            var checkbox4 = document.getElementById("fos4");
            localStorage.setItem("fos4", checkbox4.checked);
        }

        if (document.getElementById("fos5") != null) {
            var checkbox5 = document.getElementById("fos5");
            localStorage.setItem("fos5", checkbox5.checked);
        }


    }


    convertHeader(description, indexQuestion, point) {
        return prepareDescription(description, indexQuestion, point);
    }

    saveAnswer = () => {
        let sectionUpdated = {
            "id": null,
            "order": null,
            "description": null,
            "point": null,
            "multipleChoiceAnswers": [],
            "orderings": [],
            "trueFalseAnswers": [],
            "matchingAnswers": [],
            "gapFillingMain": {
                "gapFillingAnswers": [],
                "clues": null,
                "id": null
            },
            "writtenAnswer": null
        };
        sectionUpdated.id = this.props.section.id
        sectionUpdated.order = this.props.section.orderIndex
        if (this.props.section.isMultipleChoice) {
            sectionUpdated.description = this.props.section.multipleChoiceDescription
            sectionUpdated.point = this.props.section.multipleChoicePoint
            sectionUpdated.multipleChoiceAnswers = this.props.section.multipleChoiceQuestionBank
        } else if (this.props.section.isTrueFalse) {
            sectionUpdated.description = this.props.section.trueFalseDescription
            sectionUpdated.point = this.props.section.trueFalsePoint
            sectionUpdated.trueFalseAnswers = this.props.section.trueFalseQuestionBank
        } else if (this.props.section.isWritten) {
            sectionUpdated.description = this.props.section.writtenDescription
            sectionUpdated.point = this.props.section.writtenPoint
            sectionUpdated.writtenAnswer = this.props.section.writtenQuestionBank
        } else if (this.props.section.isMatching) {
            sectionUpdated.description = this.props.section.matchingDescription
            sectionUpdated.point = this.props.section.matchingPoint
            sectionUpdated.matchingAnswers = this.props.section.matchingQuestionBank
        } else if (this.props.section.isGapFilling) {
            sectionUpdated.description = this.props.section.gapFillingDescription
            sectionUpdated.point = this.props.section.gapFillingPoint
            sectionUpdated.gapFillingMain.gapFillingAnswers = this.props.section.gapFillingQuestionBank
            sectionUpdated.gapFillingMain.clues = this.props.section.gapFillingCluesString
            sectionUpdated.gapFillingMain.id = this.props.section.gapFillingMainId
        } else if (this.props.section.isOrdering) {
            sectionUpdated.description = this.props.section.orderingDescription
            sectionUpdated.point = this.props.section.orderingPoint
            sectionUpdated.orderingAnswers = this.props.section.orderingQuestionBank
        }
        this.props.saveAnswer(sectionUpdated);
    }

    mapToSectionTypes = (section) => {
        if (section.isMultipleChoice) {
            let indexMC = 1;
            return (
                <div className="container">

                    {this.props.isStudent?
                        <div className="foscheck">
                            <input type="checkbox" id="fos1" onClick={() => this.save()}/>
                            <label htmlFor="fos1"/>
                        </div>
                        :  null }


                    {this.props.section.multipleChoiceQuestionBank.length > 0 ?
                        this.convertHeader(this.props.section.multipleChoiceDescription, this.props.section.orderIndex, this.props.section.multipleChoicePoint) : null}
                    {this.props.section.multipleChoiceQuestionBank.length > 0 &&
                    this.props.section.multipleChoiceQuestionBank.map((questionField) =>

                        <div key={questionField.id}>
                            <div style={{padding: '.5em'}}>
                                <h5>{indexMC++}-) {questionField.text}</h5>
                                <MultipleChoiceBox questionField={questionField} saveAnswer={this.saveAnswer}
                                                   isSubmitted={this.props.showResults}/>
                                <br/>
                            </div>
                        </div>
                    )}
                </div>);
        } else if (section.isTrueFalse) {
            let indexTF = 1;
            return (
                <div className="container">

                    {this.props.isStudent? <div className="foscheck">
                        <input type="checkbox" id="fos2" onClick={() => this.save()}/>
                        <label htmlFor="fos2"/>
                    </div> : null}

                    {this.props.section.trueFalseQuestionBank.length > 0 ?
                        this.convertHeader(this.props.section.trueFalseDescription, this.props.section.orderIndex, this.props.section.trueFalsePoint) : null}
                    {this.props.section.trueFalseQuestionBank.length > 0 &&
                    this.props.section.trueFalseQuestionBank.map((questionField) =>

                        <div key={questionField.id}>
                            <div style={{padding: '.5em'}}>
                                <h5>{indexTF++}-) {questionField.text}</h5>
                                <TrueFalseBox questionField={questionField} saveAnswer={this.saveAnswer}
                                              isSubmitted={this.props.showResults}/>
                                <br/>
                            </div>
                        </div>
                    )}
                </div>);

        }  else if (section.isMatching) {
            return (
                <div className="container">
                    {this.props.isStudent?  <div className="foscheck">
                        <input type="checkbox" id="fos3" onClick={() => this.save()}/>
                        <label htmlFor="fos3"/>
                    </div> : null}

                    {this.props.section.matchingQuestionBank.length > 0 ?
                        this.convertHeader(this.props.section.matchingDescription, this.props.section.orderIndex, this.props.section.matchingPoint) : null}
                    <Form>
                        {this.props.section.matchingQuestionBank.map((questionField) => <div key={questionField.id}>
                            <Matching questionField={questionField} isSubmitted={this.props.showResults}
                                      rightArray={section.matchingQuestionBank.map(item => item.randomRightPart)}
                                      saveAnswer={this.saveAnswer}/>
                        </div>)}<br/>
                    </Form>
                </div>);
        } else if (section.isGapFilling) {
            let indexFillInTheBlank = 1;
            return (
                <div className="container">

                    {this.props.isStudent? <div className="foscheck">
                        <input type="checkbox" id="fos4" onClick={() => this.save()}/>
                        <label htmlFor="fos4"/>
                    </div> :null}

                    {this.props.section.gapFillingQuestionBank.length > 0 ?
                        this.convertHeader(this.props.section.gapFillingDescription, this.props.section.orderIndex, this.props.section.gapFillingPoint) : null}
                    <div>
                        <span className="block-example border border-secondary">
                            <h5 style={{padding: '.5em'}}>{section.gapFillingClues}</h5>
                        </span>
                    </div>
                    {this.props.section.gapFillingQuestionBank.length > 0 &&
                    this.props.section.gapFillingQuestionBank.map((questionField) =>
                        <div key={questionField.id}>
                            <BlankBox questionField={questionField} saveAnswer={this.saveAnswer}
                                      indexNumber={indexFillInTheBlank++} isSubmitted={this.props.showResults}/>
                            <br/>
                        </div>
                    )}
                </div>);
        } else if (section.isOrdering) {
            let indexOrdering = 1;
            return (
                <div className="container">

                    {this.props.isStudent? <div className="foscheck">
                        <input type="checkbox" id="fos5" onClick={() => this.save()}/>
                        <label htmlFor="fos5"/>
                    </div> : null}

                    {this.props.section.orderingQuestionBank.length > 0 ?
                        this.convertHeader(this.props.section.orderingDescription, this.props.section.orderIndex, this.props.section.orderingPoint) : null}
                    {this.props.section.orderingQuestionBank.length > 0 &&
                    this.props.section.orderingQuestionBank.map((questionField) =>
                        <div key={questionField.id}>
                            <Ordering questionField={questionField} saveAnswer={this.saveAnswer}
                                      indexNumber={indexOrdering++} isSubmitted={this.props.showResults}/>
                            <br/>
                        </div>
                    )}
                </div>);
        }
    }

    render() {
        return (
            this.mapToSectionTypes(this.props.section)
        );
    }
}
