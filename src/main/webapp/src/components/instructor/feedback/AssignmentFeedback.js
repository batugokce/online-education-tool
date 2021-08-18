import React, {Component} from "react";
import axios from "axios";
import authHeader from "../../service/authHeader";
import {ProgressSpinner} from "primereact/progressspinner";
import {Section} from "../../student/question/Section";
import {Col, Divider, Row} from "antd";
import {ScrollPanel} from "primereact/scrollpanel";
import {Quiz} from "../../student/question/Quiz";
import {Editor} from "primereact/editor";
import InstructorNavbar from "../InstructorNavbar";
import {Toast} from "primereact/toast";
import sanitizeHtml from "sanitize-html";

export default class AssignmentFeedback extends Component{
    constructor() {
        super();
        this.state={
            minutes: 0,
            seconds: 0,
            isQuizFinished:false,
            studentId: 12,
            articleId: null,
            assignment: null,
            answerSections: [],
            sectionArray:[],
            isWrittenGraded : false,
            article:null,
            articleTitle:"",
            show:false,
            setShow:false,
            correctAnswersAndQuiz:null,
            pointDTO:null,
            message:"",
            isLoading: true,
            isLoadingQuiz: false,
            multipleChoicePoint : null,
            trueFalsePoint : null,
            orderingPoint : null,
            matchingPoint: null,
            gapFillingPoint : null,
            lastSavedTime: null,
            definitions: [],
            feedback:null,
            feedbackGiven:false,
            isLoading2:false,
            oldFeedback:null

        }

    }

    componentDidMount() {
        this.getAssignment();
        this.getFeedback();
    }

    getAssignment(){
        axios.post("/api/v1/review/getAssignmentById/"+this.props.match.params.assignmentID+"/"+this.props.match.params.userName, {},{headers: authHeader()})
            .then(response=>{
                if(response.data.type=="warn"){
                    this.setState({
                        articleId: response.data.data.article.id,
                        correctAnswersAndQuiz:response.data.data.article.sections,
                        pointDTO:response.data.data.pointDTO,
                        message:response.data.message,
                        article:response.data.data.article.text.text,
                        articleTitle: response.data.data.article.text.title,
                        isQuizFinished:true,
                        definitions: response.data.data.article.definitions,
                    })
                    this.setState({sectionArray:[]})
                    this.state.correctAnswersAndQuiz.forEach(section => this.classifyCorrectAnswers(section));
                    this.setState({isLoading: false})
                }
            })
    }
    classify(section){
        let newSection = new Section();
        if(section.multipleChoiceAnswers!=null && section.multipleChoiceAnswers.length>0){
            newSection.changeMultipleChoice(
                section.id,
                true,
                section.order,
                section.multipleChoiceAnswers,
                section.description,
                section.point
            )
        } else if(section.orderingAnswers!=null && section.orderingAnswers.length>0){
            newSection.changeOrdering(
                section.id,
                true,
                section.order,
                section.orderingAnswers,
                section.description,
                section.point
            )
        } else if(section.trueFalseAnswers!=null && section.trueFalseAnswers.length>0){
            newSection.changeTrueFalse(
                section.id,
                true,
                section.order,
                section.trueFalseAnswers,
                section.description,
                section.point,
            )
        } else if(section.matchingAnswers!=null && section.matchingAnswers.length>0) {
            newSection.changeMatching(
                section.id,
                true,
                section.order,
                section.matchingAnswers,
                section.description,
                section.point,
            )
        } else if(section.gapFillingMain!=null && section.gapFillingMain.gapFillingAnswers.length>0) {
            let words = section.gapFillingMain.clues.split('##');
            let words2 = [];
            words.map((word)=> words2.push(word+","));
            words2[words2.length-1] = words[words.length-1]
            newSection.changeGapFilling(
                section.id,
                true,
                section.order,
                section.gapFillingMain.gapFillingAnswers,
                section.description,
                words2,
                section.gapFillingMain.clues,
                section.gapFillingMain.id,
                section.point,
            )
        } else if (section.writtenAnswer!=null){
            newSection.changeWritten(
                section.id,
                true,
                section.order,
                section.description,
                section.writtenAnswer,
                section.point,
                section.graded
            )
        }
        this.setState({
            sectionArray: [...this.state.sectionArray, newSection]
        })
        console.log(this.state.sectionArray)
    }

    classifyCorrectAnswers(sectionWithCorrectAnswers){
        let newSection = new Section();
        if(sectionWithCorrectAnswers.multipleChoices!=null && sectionWithCorrectAnswers.multipleChoices.length>0){
            newSection.changeMultipleChoice(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.multipleChoices,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point
            )
        } else if(sectionWithCorrectAnswers.orderings!=null && sectionWithCorrectAnswers.orderings.length>0){
            newSection.changeOrdering(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.orderings,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point
            )
        } else if(sectionWithCorrectAnswers.trueFalses!=null && sectionWithCorrectAnswers.trueFalses.length>0){
            newSection.changeTrueFalse(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.trueFalses,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point,
            )
        } else if(sectionWithCorrectAnswers.matchings!=null && sectionWithCorrectAnswers.matchings.length>0) {
            newSection.changeMatching(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.matchings,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.point,
            )
        } else if(sectionWithCorrectAnswers.gapFillingMain!=null && sectionWithCorrectAnswers.gapFillingMain.gapFillings.length>0) {
            let words = sectionWithCorrectAnswers.gapFillingMain.clues.split('##');
            let words2 = [];
            words.map((word)=> words2.push(word+","));
            words2[words2.length-1] = words[words.length-1]
            newSection.changeGapFilling(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.gapFillingMain.gapFillings,
                sectionWithCorrectAnswers.description,
                words2,
                sectionWithCorrectAnswers.gapFillingMain.clues,
                sectionWithCorrectAnswers.gapFillingMain.id,
                sectionWithCorrectAnswers.point,
            )
        } else if(sectionWithCorrectAnswers.writtenQuestion!=null) {
            newSection.changeWritten(
                sectionWithCorrectAnswers.id,
                true,
                sectionWithCorrectAnswers.order,
                sectionWithCorrectAnswers.description,
                sectionWithCorrectAnswers.writtenQuestion,
                sectionWithCorrectAnswers.point,
                sectionWithCorrectAnswers.writtenQuestion.graded
            )
        }
        this.setState({
            sectionArray: [...this.state.sectionArray, newSection]
        })
        console.log(this.state.sectionArray)
    }
    saveAnswersForSectionwise=(section)=> {

    }
    handleFeedback=(feedback)=> {
        this.setState( {
            feedback: feedback,
        });
    }
    getFeedback(){
        axios.get("api/v1/answer/assignments/getFeedback/"+this.props.match.params.assignmentID+"/"+this.props.match.params.userName,{headers:authHeader()})
            .then(response=>{
                this.setState({
                    feedback:response.data.data,
                    isLoading2:false,
                    oldFeedback:response.data.data
                })
            })
    }
    submitFeedback=()=>{
        let data={
            articleId:this.props.match.params.assignmentID,
            username:this.props.match.params.userName,
            feedback:this.state.feedback
        }
        if(this.state.oldFeedback){
            this.showToast("ERROR","YOU HAVE ALREADY GIVE FEEDBACK");
        }
        else{
        axios.post("api/v1/answer/assignments/" + localStorage.getItem("username") + "/saveFeedback", data,{headers:authHeader()})
            .then(response=>{
                this.showToast(response.data.type, response.data.message);
            });
        }
    }
    showToast(type, message) {
        this.toast.show({severity: type, detail: message});
    }

    redirectToAssignments = () => {
        this.props.history.push("/instructor/assignments")
    }

    render() {
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

        let cleanHtmlForFeedback;
        if (this.state.oldFeedback) cleanHtmlForFeedback = sanitizeHtml(this.state.oldFeedback, sanitizationOptions);
        return(
            this.state.isLoading || this.state.isLoading2 ?
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                    <ProgressSpinner className="p-d-block p-mx-auto"  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
                </div> :
                <div >
                <InstructorNavbar/>
                    <div style={{margin:24}}>
                    {!this.state.isQuizFinished ? <p>Student did not finished the article</p>
                    :
                        <Row style = {{height:"100vh"}}>
                            <Col span={11} style = {{margin:24}} >
                                <Row>
                                    <Col span={11}>
                                        <h2>STUDENT ANSWERS</h2>
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="scrollpanel" >
                                    <div className="card" style={{"width":"100%"}} >
                                        <ScrollPanel style={{height: "100vh"}} className="custombar1">
                                            <Quiz sectionArray={this.state.sectionArray}
                                                  showResults={this.state.isQuizFinished}
                                                  pointDTO={this.state.pointDTO}
                                                  saveAnswer={this.saveAnswersForSectionwise}
                                                    isStudent={false}/>
                                        </ScrollPanel>
                                    </div>
                                </Row>
                            </Col>
                            <Col style = {{height:"100vh"}}>
                                <Divider type="vertical" style={{ height: "90%" }} />
                            </Col>
                            <Col style = {{margin:24}}>
                                <Row>
                                    <Col span={12}>
                                        <h2>FEEDBACK</h2>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <div  style={{width:"600px"}} >
                                            { this.state.oldFeedback?
                                                <Row className="scrollpanel">
                                                <div className="card" style={{width:"600px"}} >
                                                    <ScrollPanel style={{height: "50vh"}} className="custombar1">
                                                        <div style={{margin: 24}}>
                                                            <h5 >Your Feedback: </h5>
                                                            <p dangerouslySetInnerHTML={{ __html: cleanHtmlForFeedback }}/>
                                                        </div>
                                                    </ScrollPanel>
                                                </div>
                                            </Row>
                                                 :
                                                <div>
                                                <Editor style={{height: '320px'}} value= {this.state.feedback}
                                                        onTextChange={(e) => this.handleFeedback(e.htmlValue)}/>
                                                        <br/>
                                                </div>}

                                    </div>
                                </Row>
                                <br/>
                                <div style={{ display: "flex" }} className={"mb-5"} >
                                    <button onClick={()=>this.redirectToAssignments()} className="btn btn-secondary">
                                        Back to Assignments
                                    </button>
                                    &nbsp;
                                    {this.state.oldFeedback
                                        ? null
                                        :
                                        <button  onClick={() => this.submitFeedback()}
                                                 className="btn btn-primary">
                                            Submit
                                        </button>
                                    }
                                </div>

                            </Col>

                        </Row>


                    }
                    </div>
                    <Toast ref={(el) => this.toast = el} />
                </div>
        );
    }
}