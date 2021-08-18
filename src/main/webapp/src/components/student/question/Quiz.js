import React, {Component} from "react";
import "./index.css"
import {SectionRendered} from "./SectionRendered";
import {Message} from "primereact/message";
import Written from "./written/Written";
import {prepareDescription} from "../../service/PrepareDescription";

export class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
        };
    }

    saveAnswer=(section)=> {
        this.props.saveAnswer(section);
    }

    convertHeader(description, indexQuestion, point) {
        return prepareDescription(description, indexQuestion, point);
    }

    render() {
        let grade = (this.props.showResults && this.props.pointDTO) ? Math.round(this.props.pointDTO.point) : null;
        let maxGrade = (this.props.showResults && this.props.pointDTO) ? Math.round(this.props.pointDTO.maxPoint) : null;
        return(
            <div className="container">
                <br/>
                {this.props.sectionArray && this.props.sectionArray[0].isWritten  ?
                        <div className="container">
                            {this.props.showResults ?
                                this.props.sectionArray[0].isWrittenGraded ?
                                 <div>
                                     {this.props.isStudent?
                                         <p> Your assignment has been graded </p>
                                         :  <p> Student's assignment has been graded </p> }
                                    <Message severity="info"
                                    text={" Grade: " + this.props.sectionArray[0].writtenQuestionBank.point + " / " + this.props.sectionArray[0].writtenPoint}/>
                                    <p className="p-mb-3 p-text-italic">Submitted answers are given below:</p>
                                </div>
                                : <Message severity="warn" text={"The assignment has not been graded yet "}/>
                            : null}
                            <br/>
                            {this.props.sectionArray[0].writtenQuestionBank.progressiveGrading ?
                                <Message severity="info"
                                         text={"This is a progressive assignment."}/> : null}
                            {this.props.sectionArray[0].writtenQuestionBank ? this.convertHeader(this.props.sectionArray[0].writtenDescription, this.props.sectionArray[0].orderIndex, this.props.sectionArray[0].writtenPoint) : null}
                            {this.props.sectionArray[0].writtenQuestionBank &&
                                <div key={this.props.sectionArray[0].writtenQuestionBank.id}>
                                    <Written section={this.props.sectionArray[0]} questionField={this.props.sectionArray[0].writtenQuestionBank} saveAnswer={this.saveAnswer}
                                    isSubmitted={this.props.showResults}/>
                                    <br/>
                                </div>}
                        </div>
                    : <div>
                        {this.props.showResults && (grade !== null) && (maxGrade !== null) &&
                        <div className="p-col-50 p-md-50">
                            <br/>
                            <div>
                                <Message severity="info" text={" Grade: " + grade + " / " + maxGrade}/>
                                <br/>
                                {this.props.isStudent?
                                    <p className="p-mb-3 p-text-italic">Your answers and correct choices are given below:</p>
                                :  <p className="p-mb-3 p-text-italic">Student's answers and correct choices are given below:</p> }
                            </div>

                        </div>}
                        {this.props.sectionArray.length > 0 && this.props.sectionArray.map((section) =>
                        <div key={section.orderIndex}>

                            <SectionRendered section={section}
                                             showResults={this.props.showResults}
                                             saveAnswer={this.saveAnswer}
                                             pointDTO = {this.props.pointDTO}
                                             isStudent = {this.props.isStudent}
                                    />
                        </div>)}

                    </div>
                }
            </div>
        );
    }
}