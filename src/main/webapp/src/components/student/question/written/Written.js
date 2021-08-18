import {Editor} from "primereact/editor";
import React,{Component} from "react";
import {ProgressSpinner} from "primereact/progressspinner";
import {getEditorSimpleHeader} from "../../../instructor/utilities";
import {Message} from "primereact/message";
import sanitizeHtml from "sanitize-html";

let timer;
export default class Written extends Component{
    constructor(props) {
        super(props);

        this.state = {
            answer: undefined,
            newAnswer:"",
            isLoading: true,
            isSaved:false,
            instructorFeedback: ""
        };
    }

    componentDidMount() {
        console.log(this.props)
        if (this.props.isSubmitted && this.props.questionField.studentAnswer!==""){
            this.setState( {
                answer: this.props.questionField.studentAnswer,
                newAnswer: this.props.questionField.studentAnswer,
                instructorFeedback: this.props.questionField.instructorFeedback,
                progressiveGrading: this.props.questionField.progressiveGrading,
                feedbackVersion: this.props.questionField.feedbackVersion
            });
        }
        else if (!this.props.isSubmitted){
            if (this.props.questionField.progressiveGrading && (this.props.questionField.feedbackVersion >= 1)) {
                this.setState( {
                    answer: this.props.questionField.studentAnswer,
                    newAnswer: this.props.questionField.studentAnswer,
                    instructorFeedback: this.props.questionField.instructorFeedback,
                    progressiveGrading: this.props.questionField.progressiveGrading,
                    feedbackVersion: this.props.questionField.feedbackVersion
                });
            }
            this.setState( {
                answer: this.props.questionField.text,
                newAnswer: this.props.questionField.text,
            });
            timer = setInterval(this.saveAnswer
                , 15000)
        }
        this.setState({
            isLoading: false,
        })

    }

    handleState=(answer)=> {
        this.props.questionField.text = answer;
        this.setState( {
            newAnswer: answer,
        });
    }


    saveAnswer=()=> {
        //this.props.saveAnswer(answer, this.props.questionField.id);
        //console.log(this.props.questionField);
        if(!this.props.isSubmitted) {
            if(this.state.answer !== this.state.newAnswer){
                if (this.props.questionField.progressiveGrading && (this.props.questionField.feedbackVersion === 1)) {
                    this.props.questionField.feedbackVersion = 2; // the last submission in case of progressive grading
                }
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

                sectionUpdated.description = this.props.section.writtenDescription
                sectionUpdated.point = this.props.section.writtenPoint
                sectionUpdated.writtenAnswer = this.props.section.writtenQuestionBank

                this.props.saveAnswer(sectionUpdated);
                this.setState({
                    isSaved:true
                })
            }
            //clearInterval(timer);
            this.setState( {
                answer: this.state.newAnswer,
            });
        }

    }

    render() {
        let firstDraft = this.state.progressiveGrading && (this.state.feedbackVersion === 0);
        let canReedit = this.state.progressiveGrading && (this.state.feedbackVersion >= 1 &&  this.state.feedbackVersion < 3 );
        const sanitizationOptions = {
            allowedTags: [ 'p','h2','h1','strong','span','em','u','ol','ul','li','img'],
            allowedAttributes: {
                'span': [ 'class','style' ],
                'img': ['src', 'width']
            },
            allowedSchemes: [
                'data'
            ]
        }

        const cleanHtml = sanitizeHtml(this.state.instructorFeedback, sanitizationOptions);
        return (
            this.state.isLoading ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div>
                : <div >
                    {canReedit ?  <Message severity="info"
                                           text={"You can now edit/rewrite your text according to your instructor comments.\n" + "This submission will be your second draft."}/> : null}
                                           <br/>
                    <Editor readOnly={this.props.isSubmitted && !canReedit}  style={{height: '320px'}} value= {this.state.newAnswer}
                            onTextChange={(e) => this.handleState(e.htmlValue)}
                            headerTemplate={getEditorSimpleHeader()}/><br/>
                    {this.props.questionField.progressiveGrading && this.props.questionField.feedbackVersion > 0 && this.state.instructorFeedback && this.state.instructorFeedback.length>0
                    ?<div>
                        <h3>Instructor's Feedback For First Draft</h3>
                        <div className="card">
                            <div dangerouslySetInnerHTML={{ __html: cleanHtml }}/>
                        </div>
                    </div>

                    : null}
                </div>
        );
    }
}

