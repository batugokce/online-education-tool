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

export class QuizOldVersion extends Component {
    constructor() {
        super();
        this.state = {
            showResults: false,
        };
    }


    isCorrect=(answerObject)=>{
        return this.props.multipleChoiceQuestionBank[answerObject.questionId]===answerObject.answer;
    }

    convertHeader(description, indexQuestion, point){
        let indexMatchingLetterArrayUpperCase = ["A","B","C","D","E","F","G","H","I"];
        let letter = indexMatchingLetterArrayUpperCase[indexQuestion];
        return(
            <h4>{letter}.) {description} ({point} pts.)</h4>
        )
    }


    render() {
        let indexMC = 1;
        let indexTF = 1;
        let indexFillInTheBlank = 1;
        let indexOrdering = 1;
        let indexMatchingNumber = 1;
        let indexQuestionType = 0;
        let indexMatchingLetterArray = ["a","b","c","d","e","f","g","h","ı"];
        let grade = (this.props.showResults && this.props.pointDTO ) ? Math.round(this.props.pointDTO.point): null;
        let maxGrade = (this.props.showResults  && this.props.pointDTO )? Math.round(this.props.pointDTO.maxPoint): null;
        return (
            <div className="container">
                { this.props.showResults && (grade !== null) && (maxGrade !== null) && <div className="p-col-50 p-md-50">
                    <br/>
                    { this.props.writtenQuestionBank  ?
                        this.props.isWrittenGraded ?
                            <div>
                                <p> Your assignment has been graded </p>
                                <Message severity="info" text={" Your grade: "+ grade + " / " + maxGrade}   />
                                <p className="p-mb-3 p-text-italic">Your answers are given below:</p>
                            </div>
                        : <Message severity="info" text={"Your assignment has not been graded yet "}   />
                    :
                        <div>
                            <Message severity="info" text={" Your grade: "+ grade + " / " + maxGrade}   />
                            <br/>
                            <p className="p-mb-3 p-text-italic">Your answers and correct choices are given below:</p>
                        </div>}

                </div>
                   }
                <br/>
                {this.props.multipleChoiceQuestionBank.length > 0 ?
                    this.convertHeader(this.props.multipleChoiceDescription,indexQuestionType++, this.props.multipleChoicePoint) :null}
                {this.props.multipleChoiceQuestionBank.length > 0 &&
                this.props.multipleChoiceQuestionBank.map((questionField) =>
                    <div key={questionField.id}>
                        <div style={{ padding: '.5em'}}>
                            <h5>{indexMC++}-) {questionField.text}</h5>
                            <MultipleChoiceBox questionField={questionField} saveAnswer={this.saveAnswer} isSubmitted={this.props.showResults}/>
                            <br />
                        </div>
                    </div>
                    )}

                {this.props.trueFalseQuestionBank.length > 0 ? this.convertHeader(this.props.trueFalseDescription,indexQuestionType++, this.props.trueFalsePoint) :null}
                {this.props.trueFalseQuestionBank.length > 0 &&
                this.props.trueFalseQuestionBank.map((questionField) =>
                    <div key={questionField.id}>
                        <div style={{ padding: '.5em'}}>
                            <p>{indexTF++}-) {questionField.text}</p>
                            <TrueFalseBox questionField={questionField} saveAnswer={this.saveAnswer} isSubmitted={this.props.showResults}/>
                        </div>
                        <br/>
                    </div>
                )}

                {this.props.matchingQuestionBank.length > 0 ? this.convertHeader(this.props.matchingDescription,indexQuestionType++, this.props.matchingPoint) :null}
                {this.props.matchingQuestionBank.length > 0 ? <Form  >
                    {this.props.matchingQuestionBank.map((questionField) => <div key={questionField.id}>
                        <Matching questionField={questionField} indexNumber={indexMatchingNumber++} indexLetter={indexMatchingLetterArray[indexMatchingNumber]} isSubmitted={this.props.showResults}
                                  rightArray={this.props.matchingQuestionBank.map(item => item.randomRightPart)}     />
                    </div>)}<br/></Form> : null}



                {this.props.gapFillingQuestionBank.length > 0 ? this.convertHeader(this.props.gapFillingDescription,indexQuestionType++, this.props.gapFillingPoint) :null}
                {this.props.gapFillingQuestionBank.length > 0 ?
                    <div>
                        <span className="block-example border border-secondary">
                            <h5 style={{ padding: '.5em'}}>{this.props.gapFillingClues}</h5>
                        </span>
                    </div> :null}
                {this.props.gapFillingQuestionBank && this.props.gapFillingQuestionBank.length > 0 &&
                this.props.gapFillingQuestionBank.map((questionField) =>
                    <div key={questionField.id}>
                       <BlankBox questionField={questionField} saveAnswer={this.saveAnswer} indexNumber={indexFillInTheBlank++} isSubmitted={this.props.showResults}/>
                        <br/>
                    </div>

                )}


                {this.props.orderingQuestionBank.length > 0 ? this.convertHeader(this.props.orderingDescription,indexQuestionType++, this.props.orderingPoint) :null}
                    {this.props.orderingQuestionBank.length > 0 &&
                    this.props.orderingQuestionBank.map((questionField) =>
                        <div key={questionField.id}>
                            <Ordering questionField={questionField} saveAnswer={this.saveAnswer} indexNumber={indexOrdering++} isSubmitted={this.props.showResults}/>
                            <br/>
                        </div>
                    )}


                {this.props.writtenQuestionBank ? this.convertHeader(this.props.writtenDescription,indexQuestionType++, this.props.writtenPoint) :null}
                {this.props.writtenQuestionBank &&
                    <div key={this.props.writtenQuestionBank.id}>
                        <Written questionField={this.props.writtenQuestionBank} saveAnswer={this.saveAnswer}  isSubmitted={this.props.showResults} />
                        <br/>
                    </div>
                }
             </div>)
    }
}