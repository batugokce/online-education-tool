import React, {Component} from "react";
import "./index.css"

export class Section extends Component {
    constructor() {
        super();
        this.isMultipleChoice=false
        this.isTrueFalse=false
        this.isWritten=false
        this.isMatching=false
        this.isGapFilling=false
        this.isOrdering=false

        this.id=null
        this.orderIndex=0

        this.multipleChoiceQuestionBank=[]
        this.multipleChoiceDescription=""
        this.trueFalseQuestionBank=[]
        this.trueFalseDescription=""
        this.orderingQuestionBank=[]
        this.orderingDescription=""
        this.matchingQuestionBank =[]
        this.matchingDescription=""
        this.gapFillingQuestionBank= []
        this.gapFillingDescription=""
        this.gapFillingClues=null
        this.gapFillingCluesString=null
        this.gapFillingMainId=null
        this.writtenDescription=""
        this.writtenQuestionBank= null

        this.multipleChoicePoint=null
        this.trueFalsePoint=null
        this.orderingPoint=null
        this.matchingPoint=null
        this.gapFillingPoint=null
        this.writtenPoint=null
        this.isWrittenGraded=false
    }
    changeMultipleChoice(id, isMultipleChoice,
                orderIndex,
                multipleChoiceQuestionBank,
                multipleChoiceDescription,
                multipleChoicePoint) {

            this.id=id

            this.isMultipleChoice=isMultipleChoice
            this.orderIndex=orderIndex

            this.multipleChoiceQuestionBank=multipleChoiceQuestionBank
            this.multipleChoiceDescription=multipleChoiceDescription

            this.multipleChoicePoint=multipleChoicePoint
    };

    changeTrueFalse(id, isTrueFalse,
                         orderIndex,
                         trueFalseQuestionBank,
                         trueFalseDescription,
                         trueFalsePoint,) {
        this.id=id

        this.isTrueFalse=isTrueFalse

        this.orderIndex=orderIndex

        this.trueFalseQuestionBank= trueFalseQuestionBank
        this.trueFalseDescription=trueFalseDescription

        this.trueFalsePoint=trueFalsePoint
    };

    changeOrdering(id, isOrdering,
                         orderIndex,
                         orderingQuestionBank,
                         orderingDescription,
                         orderingPoint,) {
        this.id=id
        this.isOrdering=isOrdering

        this.orderIndex=orderIndex

        this.orderingQuestionBank= orderingQuestionBank
        this.orderingDescription=orderingDescription

        this.orderingPoint=orderingPoint
    };

    changeGapFilling(id, isGapFilling,
                         orderIndex,
                         gapFillingQuestionBank,
                         gapFillingDescription,
                         gapFillingClues,
                        gapFillingCluesString,
                         gapFillingMainId,
                         gapFillingPoint,) {
        this.id=id
        this.isGapFilling=isGapFilling

        this.orderIndex=orderIndex

        this.gapFillingQuestionBank= gapFillingQuestionBank
        this.gapFillingDescription=gapFillingDescription
        this.gapFillingClues=gapFillingClues
        this.gapFillingCluesString=gapFillingCluesString
        this.gapFillingMainId=gapFillingMainId
        this.gapFillingPoint=gapFillingPoint
    };

    changeMatching(id, isMatching,
                         orderIndex,
                         matchingQuestionBank,
                         matchingDescription,
                         matchingPoint,
                        ) {
        this.id=id
        this.isMatching=isMatching

        this.orderIndex=orderIndex

        this.matchingQuestionBank = matchingQuestionBank
        this.matchingDescription=matchingDescription

        this.matchingPoint=matchingPoint
    };

    changeWritten(id, isWritten,
                         orderIndex,
                         writtenDescription,
                         writtenQuestionBank,
                         writtenPoint,
                        isWrittenGraded) {
        this.id=id
        this.isWritten=isWritten

        this.orderIndex=orderIndex

        this.writtenDescription=writtenDescription
        this.writtenQuestionBank= writtenQuestionBank
        this.writtenPoint=writtenPoint
        this.isWrittenGraded=isWrittenGraded
    };

}